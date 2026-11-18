import http from 'node:http';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, writeFile, stat, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { Worker } from 'node:worker_threads';
import { gzip as gzipCallback } from 'node:zlib';
import { promisify } from 'node:util';
import { createClient } from 'openhongguo';

const gzip = promisify(gzipCallback);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'));
const MEDIA = path.join(DATA, 'media');
const IMAGES_DIR = path.join(DATA, 'images');
const CATALOG_CACHE_FILE = path.join(DATA, 'catalog-cache.json');
const WEB = path.join(ROOT, 'web');
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
function envInteger(name, fallback, min, max) {
  const raw = process.env[name]?.trim();
  const value = raw ? Number(raw) : fallback;
  return Number.isSafeInteger(value) ? Math.min(max, Math.max(min, value)) : fallback;
}
const PORT = envInteger('PORT', 4173, 0, 65535);
const WORKERS = envInteger('MEDIA_WORKERS', 2, 1, 4);
const IMAGE_WORKERS = envInteger('IMAGE_WORKERS', 4, 2, 6);
const MAX_JOBS = envInteger('MAX_CACHE_JOBS', 24, 4, 100);
const TTL = envInteger('CACHE_TTL_SECONDS', 3600, 60, 604800) * 1000;
const ENCODE_TIMEOUT = envInteger('ENCODE_TIMEOUT_MS', 900_000, 1000, 3_600_000);
const origins = (process.env.ALLOWED_ORIGINS || '').split(',').map((v) => v.trim()).filter(Boolean);

await mkdir(MEDIA, { recursive: true });
await mkdir(IMAGES_DIR, { recursive: true });

const client = await createClient({
  profile: path.join(DATA, 'anonymous.json'),
  timeoutMs: 30000,
  retryAttempts: 3,
  deviceResets: 2,
});

// Concurrency-bounded SDK queue (2 concurrent slots to avoid head-of-line blocking while respecting upstream)
const SDK_CONCURRENCY = 2;
let sdkActive = 0;
const sdkQueue = [];
function sdk(fn) {
  if (sdkQueue.length >= 80) return Promise.reject(err('The catalog is busy. Please retry shortly.', 'QUEUE_FULL', 503));
  return new Promise((resolve, reject) => {
    sdkQueue.push({ fn, resolve, reject });
    pumpSdk();
  });
}
function pumpSdk() {
  while (sdkActive < SDK_CONCURRENCY && sdkQueue.length) {
    const task = sdkQueue.shift();
    sdkActive++;
    Promise.resolve()
      .then(task.fn)
      .then(task.resolve, task.reject)
      .finally(() => {
        sdkActive--;
        pumpSdk();
      });
  }
}

const cache = new Map();
function cacheValue(key, value) {
  if (!Number.isFinite(value.fetchedAt)) value.fetchedAt = Date.now();
  cache.delete(key);
  cache.set(key, value);
  while (cache.size > 250) cache.delete(cache.keys().next().value);
}
const inflight = new Map();
const jobs = new Map();
const queue = [];
let active = 0;
const children = new Set();

// Load persisted catalog snapshot on boot so initial page loads in <5ms
try {
  const raw = await readFile(CATALOG_CACHE_FILE, 'utf8');
  const saved = JSON.parse(raw);
  const now = Date.now();
  for (const [k, v] of Object.entries(saved || {})) {
    if (v?.value && Number.isFinite(v.savedAt) && now - v.savedAt < 86_400_000 &&
        /^(discover:|rank:|new:)/.test(k)) {
      cacheValue(k, {
        value: v.value,
        fetchedAt: v.savedAt,
        until: now + 90_000,
        staleUntil: now + 86_400_000,
      });
    }
  }
} catch {}

let saveCatalogTimer = null;
function scheduleCatalogSave() {
  if (saveCatalogTimer) return;
  saveCatalogTimer = setTimeout(async () => {
    saveCatalogTimer = null;
    try {
      const snapshot = {};
      for (const [k, v] of cache.entries()) {
        if (k.startsWith('discover:') || k.startsWith('rank:') || k.startsWith('new:')) {
          snapshot[k] = { value: v.value, savedAt: v.fetchedAt };
        }
      }
      await writeFile(CATALOG_CACHE_FILE, JSON.stringify(snapshot));
    } catch {}
  }, 2000);
  saveCatalogTimer.unref?.();
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.m3u8': 'application/vnd.apple.mpegurl; charset=utf-8',
  '.m4s': 'video/iso.segment',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
};

const idValid = (s) => typeof s === 'string' && /^\d{4,24}$/.test(s);
const err = (message, code = 'REQUEST_FAILED', status = 502) =>
  Object.assign(new Error(message), { code, status });

function publicError(e) {
  return {
    error:
      e.code === 'ANONYMOUS_LIMITED'
        ? 'The video provider is not returning a playable source. Please try again later.'
        : e.code === 'ENOENT' && e.path === FFMPEG
        ? 'FFmpeg is not installed on the streaming server.'
        : String(e.message || 'Request failed').replace(/https?:\/\/\S+/g, '[upstream]'),
    code: e.code || 'REQUEST_FAILED',
    retryable: Boolean(e.retryable),
  };
}

function setSecurityHeaders(res, isMedia = false) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), geolocation=(), microphone=(), payment=(), usb=(), focus-without-user-activation=()'
  );
  if (!isMedia) {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'report-sample'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self' https://hakzxjubzetljrnokcbf.supabase.co; font-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
    );
  }
}

async function sendJson(req, res, status, data) {
  res.setHeader('Vary', [...new Set(String(res.getHeader('Vary') || '').split(',').map(v => v.trim()).filter(Boolean).concat('Accept-Encoding'))].join(', '));
  const payload = Buffer.from(JSON.stringify(data));
  const acceptGzip = /\bgzip\b/i.test(req.headers['accept-encoding'] || '');
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  };
  if (acceptGzip && payload.length > 1024) {
    const compressed = await gzip(payload);
    headers['Content-Encoding'] = 'gzip';
    headers['Content-Length'] = compressed.length;
    res.writeHead(status, headers);
    res.end(compressed);
    return;
  }
  headers['Content-Length'] = payload.length;
  res.writeHead(status, headers);
  res.end(payload);
}

async function memo(key, fn, ttl = 180_000, forceRefresh = false, shouldCache = () => true) {
  const now = Date.now();
  const hit = cache.get(key);
  if (!forceRefresh && hit && hit.until > now) return hit.value;

  const load = () => sdk(fn).then(value => {
    if (shouldCache(value)) {
      const fetchedAt = Date.now();
      cacheValue(key, { value, fetchedAt, until: fetchedAt + ttl, staleUntil: fetchedAt + ttl * 8 });
      if (/^(discover:|rank:|new:)/.test(key)) scheduleCatalogSave();
    }
    return value;
  });

  if (!forceRefresh && hit && hit.staleUntil > now) {
    if (!inflight.has(key)) {
      inflight.set(key, load().catch(() => hit.value).finally(() => inflight.delete(key)));
    }
    return hit.value;
  }
  if (inflight.has(key)) return inflight.get(key);
  const pending = load().finally(() => inflight.delete(key));
  inflight.set(key, pending);
  return pending;
}

async function playback(id, refresh = false) {
  const key = 'resolve-play:' + id + ':' + refresh;
  if (inflight.has(key)) return inflight.get(key);
  const pending = resolvePlayback(id, refresh).finally(() => inflight.delete(key));
  inflight.set(key, pending);
  return pending;
}

async function resolvePlayback(id, refresh = false) {
  if (refresh) cache.delete('play:' + id);
  const hit = cache.get('play:' + id);
  if (
    !refresh &&
    hit &&
    hit.until > Date.now() &&
    hit.value?.playback?.streams?.length &&
    (!hit.value.playback.protected || hit.value.contentKey?.key) &&
    (!hit.value.playback.expires_at || hit.value.playback.expires_at * 1000 > Date.now() + 60000)
  ) {
    return hit.value;
  }
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const value = await sdk(() => client.resolvePlayback(id));
      if (!value?.playback?.streams?.length) {
        throw err('No compatible source rendition is available.', 'UNSUPPORTED_CODEC', 422);
      }
      if (value.playback.protected && !value.contentKey?.key) {
        throw err('The upstream content key is unavailable.', 'CONTENT_KEY_UNAVAILABLE', 502);
      }
      cacheValue('play:' + id, {
        value,
        until: Date.now() + 120_000,
        staleUntil: Date.now() + 180_000,
      });
      return value;
    } catch (e) {
      lastErr = e;
      // The SDK already performs its configured recovery. Respect terminal failures.
      if (e.retryable !== true || attempt === 2) break;
      await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
    }
  }
  throw lastErr;
}

function height(s) {
  return (
    Number(s.definition?.match(/(\d+)p/i)?.[1]) ||
    Math.min(Number(s.width) || 0, Number(s.height) || 0)
  );
}

function streams(pb) {
  return (pb.streams || [])
    .filter((s) => s.url && height(s) <= 1080 && !/bytevc2|vvc|h266/i.test(s.codec || ''))
    .sort((a, b) => height(a) - height(b) || (a.bitrate || 0) - (b.bitrate || 0));
}

const STANDARD_TIERS = [1080, 720, 540, 480, 360, 240];

function qualities(pb) {
  const list = streams(pb);
  const maxH = Math.max(0, ...list.map((s) => height(s)));
  const nativeHeights = new Set(list.map((s) => height(s)).filter(Boolean));
  const available = STANDARD_TIERS.filter((h) => h <= (maxH || 1080) || nativeHeights.has(h));
  for (const h of nativeHeights) {
    if (!available.includes(h)) available.push(h);
  }
  return available
    .sort((a, b) => b - a)
    .map((h) => ({
      label: h + 'p',
      height: h,
      native: nativeHeights.has(h),
    }));
}

function select(pb, quality) {
  const list = streams(pb);
  if (!list.length) {
    throw err('No compatible source rendition is available.', 'UNSUPPORTED_CODEC', 422);
  }
  const byPref = (arr) =>
    [...arr].sort(
      (a, b) =>
        height(a) - height(b) ||
        Number(/h264|avc/i.test(a.codec)) - Number(/h264|avc/i.test(b.codec)) ||
        (a.bitrate || 0) - (b.bitrate || 0)
    );

  if (!quality || quality === 'auto') {
    // Prefer 720p or 1080p for fast HD start
    const hd = list.filter((s) => height(s) === 720 || height(s) === 1080);
    const chosen = (hd.length ? byPref(hd) : byPref(list)).at(-1);
    return { stream: chosen, targetHeight: height(chosen) };
  }

  const target = Number(String(quality).replace('p', ''));
  const exact = list.filter((s) => height(s) === target);
  if (exact.length) {
    const chosen = byPref(exact).at(-1);
    return { stream: chosen, targetHeight: target };
  }
  // Pick smallest stream >= target so we can downscale cleanly, or highest available stream
  const higher = list.filter((s) => height(s) >= target);
  if (higher.length) {
    const minHigherH = Math.min(...higher.map((s) => height(s)));
    const chosen = byPref(higher.filter((s) => height(s) === minHigherH)).at(-1);
    return { stream: chosen, targetHeight: target };
  }
  const fallback = byPref(list).at(-1);
  return { stream: fallback, targetHeight: height(fallback) };
}

function outputResolution(stream, targetHeight, streamHeight) {
  const width = Number(stream.width);
  const height = Number(stream.height);
  if (!(width > 0 && height > 0)) return null;
  if (!targetHeight || targetHeight >= streamHeight) return `${width}×${height}`;

  const even = value => Math.max(2, Math.round(value / 2) * 2);
  return width > height
    ? `${even(width * targetHeight / height)}×${targetHeight}`
    : `${targetHeight}×${even(height * targetHeight / width)}`;
}

function jobView(j) {
  return {
    id: j.id,
    status: j.status,
    episodeId: j.episodeId,
    manifestUrl: '/media/' + j.id + '/index.m3u8',
    quality: j.quality || j.requestedQuality,
    qualities: j.qualities || [],
    duration: j.duration || 0,
    segmentsReady: j.segmentsReady || 0,
    bufferedSeconds: j.bufferedSeconds || 0,
    resolution: j.resolution || null,
    bitrate: j.bitrate || 0,
    codec: 'H.264 / AAC',
    error: j.error || null,
    errorCode: j.errorCode || null,
  };
}

function pump() {
  while (active < WORKERS && queue.length) {
    const job = queue.shift();
    active++;
    runJob(job).finally(() => {
      active--;
      pump();
    });
  }
}

async function runJob(job) {
  job.status = 'preparing';
  try {
    const resolved = await playback(job.episodeId);
    const pb = resolved.playback;
    const { stream, targetHeight } = select(pb, job.requestedQuality);
    if (pb.protected && !resolved.contentKey?.key) {
      throw err('The upstream content key is unavailable.', 'CONTENT_KEY_UNAVAILABLE');
    }
    const streamH = height(stream);
    job.quality = (targetHeight || streamH) + 'p';
    job.qualities = qualities(pb);
    job.duration = pb.duration_seconds || 0;
    job.bitrate = stream.bitrate || 0;
    job.resolution = outputResolution(stream, targetHeight, streamH) || job.quality;
    await mkdir(job.dir, { recursive: true });

    let runError;
    const sources = [stream.url, stream.backup_url].filter(Boolean);
    for (const source of sources) {
      try {
        await encode(job, source, pb, resolved.contentKey?.key, targetHeight, streamH);
        runError = null;
        break;
      } catch (e) {
        runError = e;
        if (job.segmentsReady >= 2) break;
      }
    }
    if (runError) throw runError;
    job.status = 'complete';
    job.updated = Date.now();
  } catch (e) {
    job.status = 'error';
    job.error = publicError(e).error;
    job.errorCode = e.code || 'ENCODE_FAILED';
    job.updated = Date.now();
    console.error('[media]', job.id, e.code || 'ENCODE_FAILED', e.message);
  }
}

async function refreshJobManifest(job) {
  try {
    const text = await readFile(path.join(job.dir, 'index.m3u8'), 'utf8');
    if (text.startsWith('#EXTM3U') && text.includes('segment-00000.m4s')) {
      job.manifestText = text;
      job.bufferedSeconds = [...text.matchAll(/#EXTINF:([\d.]+)/g)].reduce((total, match) => total + Number(match[1]), 0);
      const matches = text.match(/segment-\d+\.m4s/g);
      job.segmentsReady = matches ? matches.length : job.segmentsReady || 1;
      return true;
    }
  } catch {}
  return false;
}

function encode(job, source, pb, key, targetHeight, streamH) {
  return new Promise((resolve, reject) => {
    const args = ['-hide_banner', '-nostdin', '-loglevel', 'error', '-y', '-rw_timeout', '30000000'];
    if (key) args.push('-decryption_key', key);
    args.push('-i', source);
    if (pb.audio_url) {
      if (key) args.push('-decryption_key', key);
      args.push('-rw_timeout', '30000000', '-i', pb.audio_url, '-map', '0:v:0', '-map', '1:a:0?');
    } else {
      args.push('-map', '0:v:0', '-map', '0:a:0?');
    }

    if (targetHeight && streamH && targetHeight < streamH) {
      args.push(
        '-vf',
        `scale='if(gt(iw,ih),-2,${targetHeight})':'if(gt(iw,ih),${targetHeight},-2)'`
      );
    }

    args.push(
      '-c:v',
      'libx264',
      '-preset',
      process.env.ENCODER_PRESET || 'ultrafast',
      '-crf',
      '22',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '128k',
      '-force_key_frames',
      'expr:gte(t,n_forced*3)',
      '-f',
      'hls',
      '-hls_time',
      '3',
      '-hls_list_size',
      '0',
      '-hls_playlist_type',
      'event',
      '-hls_segment_type',
      'fmp4',
      '-hls_fmp4_init_filename',
      'init.mp4',
      '-hls_flags',
      'independent_segments+temp_file',
      '-hls_segment_filename',
      'segment-%05d.m4s',
      'index.m3u8'
    );

    const child = spawn(FFMPEG, args, {
      cwd: job.dir,
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    children.add(child);
    let stderr = '';
    child.stderr.on('data', (d) => {
      stderr = (stderr + d.toString()).slice(-4000);
    });

    const readiness = setInterval(async () => {
      try {
        const initStat = await stat(path.join(job.dir, 'init.mp4'));
        const seg0Stat = await stat(path.join(job.dir, 'segment-00000.m4s'));
        if (initStat.size > 0 && seg0Stat.size > 0) {
          const hasSeg1 = await stat(path.join(job.dir, 'segment-00001.m4s'))
            .then((s) => s.size > 0)
            .catch(() => false);
          const okManifest = await refreshJobManifest(job);
          if (okManifest && (hasSeg1 || job.segmentsReady >= 2) && job.status === 'preparing') {
            job.status = 'ready';
            job.updated = Date.now();
          }
        }
      } catch {}
    }, 150);

    const timer = setTimeout(() => {
      child.kill();
    }, ENCODE_TIMEOUT);

    const cleanup = () => {
      clearInterval(readiness);
      clearTimeout(timer);
      children.delete(child);
    };

    child.on('error', (e) => {
      cleanup();
      reject(e);
    });

    child.on('close', async (code) => {
      cleanup();
      await refreshJobManifest(job);
      if (code === 0 && job.manifestText) {
        resolve();
      } else {
        reject(
          err(
            stderr.includes('404')
              ? 'The upstream stream expired or is unavailable. Please retry.'
              : 'Media preparation failed. Please retry or select a lower quality.',
            'ENCODE_FAILED'
          )
        );
      }
    });
  });
}

async function sweep() {
  const old = [...jobs.values()]
    .filter((j) => ['complete', 'error'].includes(j.status))
    .sort((a, b) => a.updated - b.updated);
  for (const j of old) {
    if (Date.now() - j.updated > TTL || jobs.size > MAX_JOBS) {
      jobs.delete(j.id);
      await rm(j.dir, { recursive: true, force: true });
    }
  }
  for (const entry of await readdir(MEDIA, { withFileTypes: true })) {
    if (entry.isDirectory() && /^[a-f0-9-]{36}$/.test(entry.name) && !jobs.has(entry.name)) {
      const dir = path.join(MEDIA, entry.name);
      try {
        const s = await stat(dir);
        if (Date.now() - s.mtimeMs > TTL) await rm(dir, { recursive: true, force: true });
      } catch {}
    }
  }
}
setInterval(() => sweep().catch(() => {}), 60_000).unref();

async function body(req) {
  let value = '';
  for await (const chunk of req) {
    value += chunk;
    if (value.length > 16384) throw err('Request is too large.', 'INVALID_REQUEST', 413);
  }
  try {
    const parsed = JSON.parse(value || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid body');
    return parsed;
  } catch {
    throw err('Invalid JSON.', 'INVALID_REQUEST', 400);
  }
}

async function statWithRetry(file, retries = 4) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await stat(file);
    } catch (e) {
      if (i === retries) throw e;
      await new Promise((r) => setTimeout(r, 60));
    }
  }
}

async function serveFile(req, res, file, media = false) {
  let s;
  try {
    s = await statWithRetry(file, media ? 4 : 0);
  } catch {
    throw err('File not found.', 'NOT_FOUND', 404);
  }
  if (!s.isFile()) throw err('File not found.', 'NOT_FOUND', 404);

  const ext = path.extname(file);
  const mime = types[ext] || 'application/octet-stream';
  const isImmutableVendor = file.endsWith('hls.min.js');
  const etag = `"${s.size.toString(16)}-${Math.floor(s.mtimeMs).toString(16)}"`;

  if (!media && req.headers['if-none-match'] === etag) {
    res.writeHead(304, { ETag: etag, Vary: res.getHeader('Vary') ? 'Origin, Accept-Encoding' : 'Accept-Encoding' });
    return res.end();
  }

  // Compress text-based static assets (.html, .css, .js, .m3u8) when non-range GET
  if (!req.headers.range && ['.html', '.css', '.js', '.mjs', '.m3u8'].includes(ext)) {
    const raw = await readFile(file);
    const acceptGzip = /\bgzip\b/i.test(req.headers['accept-encoding'] || '');
    const headers = {
      'Content-Type': mime,
      'Cache-Control':
        ext === '.m3u8'
          ? 'no-store'
          : isImmutableVendor
            ? 'public, max-age=86400'
            : 'public, max-age=0, must-revalidate',
      ETag: etag,
      Vary: res.getHeader('Vary') ? 'Origin, Accept-Encoding' : 'Accept-Encoding',
    };
    if (acceptGzip && raw.length > 1024) {
      const compressed = await gzip(raw);
      headers['Content-Encoding'] = 'gzip';
      headers['Content-Length'] = compressed.length;
      res.writeHead(200, headers);
      return res.end(req.method === 'HEAD' ? undefined : compressed);
    }
    headers['Content-Length'] = raw.length;
    res.writeHead(200, headers);
    return res.end(req.method === 'HEAD' ? undefined : raw);
  }

  let start = 0;
  let end = s.size - 1;
  let status = 200;
  if (req.headers.range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if (!m || (!m[1] && !m[2]) || (!m[1] && Number(m[2]) === 0)) {
      res.writeHead(416, { 'Content-Range': `bytes */${s.size}` });
      return res.end();
    }
    if (!m[1]) start = Math.max(0, s.size - Number(m[2]));
    else start = Number(m[1]);
    if (m[1] && m[2]) end = Number(m[2]);
    end = Math.min(end, s.size - 1);
    if (start > end || start >= s.size) {
      res.writeHead(416, { 'Content-Range': `bytes */${s.size}` });
      return res.end();
    }
    status = 206;
  }
  const headers = {
    'Content-Type': mime,
    'Content-Length': end - start + 1,
    'Accept-Ranges': 'bytes',
    'Cache-Control': file.endsWith('.m3u8')
      ? 'no-store'
      : media
        ? 'private, max-age=600'
        : 'no-cache',
  };
  if (status === 206) headers['Content-Range'] = `bytes ${start}-${end}/${s.size}`;
  res.writeHead(status, headers);
  if (req.method === 'HEAD') return res.end();
  const stream = createReadStream(file, { start, end });
  stream.on('error', () => res.destroy());
  res.once('close', () => stream.destroy());
  stream.pipe(res);
}

// Persistent HEIC -> JPEG Worker Pool + Disk & Memory Cache
const imageHosts = [
  'byteimg.com',
  'pstatp.com',
  'snssdk.com',
  'fqnovel.com',
  'fqnovelpic.com',
  'novelpic.com',
  'novelpicgo.com',
  'toutiaoimg.com',
  'douyinpic.com',
];

const imageMemCache = new Map();
function cacheImage(key, entry) {
  imageMemCache.delete(key);
  imageMemCache.set(key, entry);
  let size = [...imageMemCache.values()].reduce((total, value) => total + value.bytes.length, 0);
  while (size > 64 * 1024 * 1024 || imageMemCache.size > 300) {
    const first = imageMemCache.keys().next().value;
    size -= imageMemCache.get(first).bytes.length;
    imageMemCache.delete(first);
  }
}
const imageInflight = new Map();
const workerPool = [];
const workerWaitQueue = [];
let workerTaskSeq = 0;

function spawnImageWorker() {
  const worker = new Worker(new URL('./image-worker.mjs', import.meta.url));
  const entry = { worker, busy: false, current: null };
  worker.on('message', (msg) => {
    const task = entry.current;
    entry.current = null;
    entry.busy = false;
    if (task) {
      clearTimeout(task.timer);
      if (msg && msg.bytes) task.resolve(Buffer.from(msg.bytes));
      else task.reject(err('Image conversion failed.', 'IMAGE_UNAVAILABLE', 502));
    }
    pumpImageWorkers();
  });
  worker.on('error', () => {
    const task = entry.current;
    entry.current = null;
    entry.busy = false;
    const idx = workerPool.indexOf(entry);
    if (idx >= 0) workerPool.splice(idx, 1);
    if (task) {
      clearTimeout(task.timer);
      task.reject(err('Image conversion failed.', 'IMAGE_UNAVAILABLE', 502));
    }
    spawnImageWorker();
    pumpImageWorkers();
  });
  workerPool.push(entry);
}

for (let i = 0; i < IMAGE_WORKERS; i++) {
  spawnImageWorker();
}

function pumpImageWorkers() {
  for (const entry of workerPool) {
    if (!entry.busy && workerWaitQueue.length) {
      const task = workerWaitQueue.shift();
      entry.busy = true;
      entry.current = task;
      task.timer = setTimeout(() => {
        entry.current = null;
        entry.busy = false;
        const idx = workerPool.indexOf(entry);
        if (idx >= 0) workerPool.splice(idx, 1);
        try {
          entry.worker.terminate();
        } catch {}
        spawnImageWorker();
        task.reject(err('Image conversion timed out.', 'IMAGE_UNAVAILABLE', 504));
        pumpImageWorkers();
      }, 15_000);
      const copy = new Uint8Array(task.bytes);
      entry.worker.postMessage({ id: task.id, bytes: copy, quality: 0.85 }, [copy.buffer]);
    }
  }
}

function heicJPEG(bytes) {
  return new Promise((resolve, reject) => {
    if (workerWaitQueue.length > 120) {
      reject(err('Image queue is busy.', 'IMAGE_BUSY', 429));
      return;
    }
    workerWaitQueue.push({ id: ++workerTaskSeq, bytes, resolve, reject, timer: null });
    pumpImageWorkers();
  });
}

function imageURL(value) {
  let u;
  try {
    u = new URL(value);
  } catch {
    throw err('Invalid image URL.', 'INVALID_REQUEST', 400);
  }
  if (
    u.protocol !== 'https:' ||
    u.username ||
    u.password ||
    (u.port && u.port !== '443') ||
    !imageHosts.some((h) => u.hostname === h || u.hostname.endsWith('.' + h))
  ) {
    throw err('Image host is not supported.', 'INVALID_REQUEST', 400);
  }
  return u;
}

function imageCacheKey(rawUrl) {
  const u = imageURL(rawUrl);
  return createHash('sha1').update(u.origin + u.pathname + u.search).digest('hex');
}

let activeImageFetches = 0;
const imageFetchQueue = [];
function runImageFetch(fn) {
  if (imageFetchQueue.length >= 96) return Promise.reject(err('Image queue is busy.', 'IMAGE_BUSY', 503));
  return new Promise((resolve, reject) => {
    imageFetchQueue.push({ fn, resolve, reject });
    pumpImageFetches();
  });
}
function pumpImageFetches() {
  while (activeImageFetches < 16 && imageFetchQueue.length) {
    const task = imageFetchQueue.shift();
    activeImageFetches++;
    Promise.resolve()
      .then(task.fn)
      .then(task.resolve, task.reject)
      .finally(() => {
        activeImageFetches--;
        pumpImageFetches();
      });
  }
}

async function resolveAndConvertImage(url) {
  const key = imageCacheKey(url);
  const memHit = imageMemCache.get(key);
  if (memHit) return memHit;

  const diskPath = path.join(IMAGES_DIR, key + '.jpg');
  try {
    const diskBytes = await readFile(diskPath);
    if (diskBytes.length > 64) {
      const entry = { bytes: diskBytes, type: rasterType(diskBytes), etag: `"${key}"` };
      cacheImage(key, entry);
      return entry;
    }
  } catch {}

  if (imageInflight.has(key)) {
    return imageInflight.get(key);
  }

  const pending = runImageFetch(async () => {
    let targetUrl = url;
    let response;
    for (let i = 0; i < 4; i++) {
      const u = imageURL(targetUrl);
      response = await fetch(u, {
        redirect: 'manual',
        signal: AbortSignal.timeout(12_000),
        headers: {
          Accept: 'image/webp,image/jpeg,image/png,image/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15',
        },
      });
      if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
        await response.body?.cancel();
        targetUrl = new URL(response.headers.get('location'), u).href;
        continue;
      }
      break;
    }
    if (!response?.ok || !response.headers.get('content-type')?.startsWith('image/')) {
      throw err('Image unavailable.', 'IMAGE_UNAVAILABLE', 404);
    }
    const chunks = [];
    let length = 0;
    for await (const chunk of response.body) {
      length += chunk.length;
      if (length > 8 * 1024 * 1024) throw err('Image is too large.', 'IMAGE_UNAVAILABLE', 413);
      chunks.push(chunk);
    }
    let bytes = Buffer.concat(chunks);
    let type = response.headers.get('content-type') || 'image/jpeg';
    if (
      /heic|heif/i.test(type) ||
      (bytes.length > 32 &&
        bytes.toString('ascii', 4, 8) === 'ftyp' &&
        /heic|heix|heif/i.test(bytes.toString('ascii', 8, 32)))
    ) {
      bytes = await heicJPEG(bytes);
      type = 'image/jpeg';
    }
    type = rasterType(bytes);
    const entry = { bytes, type, etag: `"${key}"` };
    cacheImage(key, entry);
    writeFile(diskPath, bytes).catch(() => {});
    return entry;
  }).finally(() => {
    imageInflight.delete(key);
  });

  imageInflight.set(key, pending);
  return pending;
}

// Accept raster formats only. Do not serve active SVG/HTML through the same-origin image proxy.
function rasterType(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'image/jpeg';
  if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png';
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (/^GIF8[79]a/.test(bytes.toString('ascii', 0, 6))) return 'image/gif';
  throw err('Unsupported image format.', 'IMAGE_UNAVAILABLE', 415);
}

function loadSeriesBundle(id) {
  return memo('series-bundle:' + id, async () => {
    const [detail] = await client.getSeriesBatch([id]).catch(() => []);
    if (detail?.series && Array.isArray(detail.episodes)) return detail;

    // Some titles are omitted from the batch response. Preserve the individual lookups.
    const [seriesResult, episodesResult] = await Promise.allSettled([
      detail?.series || client.getSeries(id),
      client.listEpisodes(id),
    ]);
    if (seriesResult.status === 'rejected' && episodesResult.status === 'rejected') throw seriesResult.reason;
    return {
      series: seriesResult.status === 'fulfilled' ? seriesResult.value : null,
      episodes: episodesResult.status === 'fulfilled' ? episodesResult.value.items || [] : null,
    };
  }, 300_000, false, value => Boolean(value.series) && Array.isArray(value.episodes));
}

async function seriesArtwork(id, landscapeOnly = false) {
  const { episodes } = await loadSeriesBundle(id);
  const episode = landscapeOnly
    ? episodes?.find(ep => ep.cover_url && ep.vertical === false) ||
      episodes?.find(ep => ep.cover_url && ep.vertical == null)
    : episodes?.find(ep => ep.cover_url);
  if (!episode) {
    if (landscapeOnly && Array.isArray(episodes) && episodes.length) return null;
    throw err('Artwork unavailable.', 'IMAGE_UNAVAILABLE', 404);
  }
  const original = imageURL(episode.cover_url);
  // This unsigned CDN transformation was verified to return original 1080/1920-pixel episode stills.
  if (!original.search && original.hostname.endsWith('.byteimg.com') && /~tplv-shrink:640:0\.image$/.test(original.pathname)) {
    const larger = new URL(original);
    larger.pathname = larger.pathname.replace(':640:0.image', ':1920:0.image');
    try { return await resolveAndConvertImage(larger.href); } catch {}
  }
  return resolveAndConvertImage(original.href);
}

async function proxyImage(req, res, url) {
  if (!url) throw err('Invalid image URL.', 'INVALID_REQUEST', 400);
  const key = imageCacheKey(url);
  if (req.headers['if-none-match'] === `"${key}"`) {
    res.writeHead(304);
    return res.end();
  }
  const result = await resolveAndConvertImage(url);
  res.writeHead(200, {
    'Content-Type': result.type,
    'Content-Length': result.bytes.length,
    'Cache-Control': 'public, max-age=604800, immutable',
    ETag: result.etag,
  });
  res.end(req.method === 'HEAD' ? undefined : result.bytes);
}

// Map UI filter tokens to openhongguo shortFilter selections
const GENRE_MAP = {
  live: 'short_play',
  animation: 'comic_series',
  ai: 'ai_series',
};
const THEME_MAP = {
  romance: 'cate_5000',
  fantasy: 'cate_5008',
  suspense: 'cate_5004',
  comedy: 'cate_5024',
  costume: 'cate_5007',
  rebirth: 'cate_5031',
  family: 'cate_5001',
  urban: 'cate_5022',
  action: 'cate_9165',
};
const EPOCH_MAP = {
  city: 'cate_5338',
  ancient: 'cate_5339',
  workplace: 'cate_5301',
  campus: 'cate_5315',
  republic: 'cate_5340',
};
const THEME_LABEL = {
  romance: 'Romance · 爱情',
  fantasy: 'Fantasy · 玄幻',
  suspense: 'Suspense · 悬疑',
  comedy: 'Comedy · 喜剧',
  costume: 'Period · 古装',
  rebirth: 'Comeback · 逆袭',
  family: 'Family · 家庭',
  urban: 'Urban · 都市',
  action: 'Action · 动作',
};

function boundedCatalogCursor(cursor) {
  if (typeof cursor !== 'string' || !cursor.startsWith('s1.')) return cursor;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(cursor.slice(3), 'base64url').toString('utf8'));
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error();
  } catch {
    throw err('Invalid pagination cursor.', 'INVALID_REQUEST', 400);
  }
  if (!Array.isArray(payload.s) || payload.s.length <= 180) return cursor;
  // The browser deduplicates the full list. Keep recent exclusions for upstream paging.
  payload.s = payload.s.slice(-180);
  return 's1.' + Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function catalogPage(data) {
  const cursor = boundedCatalogCursor(data.cursor || data.next_cursor);
  return { ...data, cursor, has_more: Boolean(data.has_more && cursor) };
}

async function fetchDiscoverCatalog({ type = 'all', genre = '', setting = '', sort = 'hot_score', cursor = '', force = false }) {
  if (type !== 'all' && !Object.hasOwn(GENRE_MAP, type)) throw err('Invalid series type.', 'INVALID_REQUEST', 400);
  if (genre && !Object.hasOwn(THEME_MAP, genre)) throw err('Invalid genre.', 'INVALID_REQUEST', 400);
  if (setting && !Object.hasOwn(EPOCH_MAP, setting)) throw err('Invalid setting.', 'INVALID_REQUEST', 400);
  if (!['hot_score', 'online_time', 'hot_collect'].includes(sort)) throw err('Invalid sort order.', 'INVALID_REQUEST', 400);
  const selections = {};
  if (type !== 'all') selections.genre = [GENRE_MAP[type]];
  if (genre) selections.category_dim_theme = [THEME_MAP[genre]];
  if (setting) selections.category_dim_epoch = [EPOCH_MAP[setting]];
  selections.sort = [sort];
  const fallback = cursor.startsWith('feed:');
  const shortPage = !fallback && (!cursor || cursor.startsWith('s1.'));
  const key = `discover:sf:${type}:${genre}:${setting}:${sort}:${cursor}`;
  const data = await memo(
    key,
    async () => {
      if (shortPage) {
        try {
          const page = await client.shortFilter({ selections, cursor: boundedCatalogCursor(cursor) });
          return {
            ...page,
            items: page.items.map((item) => ({
              ...item,
              category: item.category || (genre && THEME_LABEL[genre]) || undefined,
            })),
          };
        } catch (error) {
          if (cursor || error.code !== 'CONTENT_UNAVAILABLE') throw error;
          if (genre || setting || type === 'ai' || sort !== 'hot_score') {
            return { items: [], has_more: false };
          }
        }
      }
      const channel = type === 'live' ? '真人剧' : type === 'animation' ? '漫剧' : '推荐';
      const page = await client.discover({ channel, cursor: fallback ? cursor.slice(5) : cursor });
      return { ...page, cursor: page.cursor ? 'feed:' + page.cursor : '' };
    },
    180_000,
    force
  );
  const page = catalogPage(data);
  if (type !== 'all' && Array.isArray(page.items)) {
    page.items = page.items.map(item => ({ ...item, type: item.type || type }));
  }
  return page;
}

const requestBudgets = new Map();
function checkRequestBudget(req, route) {
  if (!route.startsWith('/api/') || route === '/api/health') return;
  const bucket = route === '/api/image' || route.endsWith('/artwork') ? 'image' : req.method === 'POST' ? 'media' : 'catalog';
  const limit = { image: 600, media: 40, catalog: 360 }[bucket];
  // Ignore untrusted forwarded IP headers. Configure an edge rate limit when behind a shared proxy.
  const key = `${req.socket.remoteAddress}:${bucket}`;
  const now = Date.now();
  let entry = requestBudgets.get(key);
  if (!entry || entry.until <= now) {
    if (requestBudgets.size >= 10000) requestBudgets.delete(requestBudgets.keys().next().value);
    entry = { count: 0, until: now + 60_000 };
    requestBudgets.set(key, entry);
  }
  if (++entry.count > limit) throw err('Too many requests. Please retry in a minute.', 'RATE_LIMITED', 429);
}
setInterval(() => {
  for (const [key, entry] of requestBudgets) if (entry.until <= Date.now()) requestBudgets.delete(key);
}, 60_000).unref();

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  let sameOrigin = false;
  try { sameOrigin = new URL(origin).host === req.headers.host; } catch {}
  const originAllowed = !origin || sameOrigin || origins.includes('*') || origins.includes(origin);
  res.setHeader('Vary', 'Origin');
  if (origin && originAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origins.includes('*') ? '*' : origin);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Range');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length,Content-Range');
  }
  if (req.method === 'OPTIONS') {
    setSecurityHeaders(res);
    res.writeHead(originAllowed ? 204 : 403);
    return res.end();
  }
  try {
    const u = new URL(req.url, 'http://localhost');
    const route = u.pathname;
    setSecurityHeaders(res, route.startsWith('/media/'));
    if ((route.startsWith('/api/') || route.startsWith('/media/')) && !originAllowed) {
      throw err('Origin is not allowed.', 'FORBIDDEN', 403);
    }
    if (req.url.length > 16000 || [...u.searchParams.values()].some(value => value.length > 12000)) {
      throw err('Request is too large.', 'INVALID_REQUEST', 400);
    }
    checkRequestBudget(req, route);

    if (route === '/api/health') {
      return await sendJson(req, res, 200, {
        ok: true,
        service: 'duanju-studio',
        maxQuality: 1080,
        qualities: ['auto', '1080p', '720p', '540p', '480p', '360p', '240p'],
        workers: WORKERS,
      });
    }
    if (['GET', 'HEAD'].includes(req.method) && route === '/api/image') {
      return await proxyImage(req, res, u.searchParams.get('url'));
    }
    const artworkMatch = route.match(/^\/api\/series\/(\d{4,24})\/artwork$/);
    if (['GET', 'HEAD'].includes(req.method) && artworkMatch) {
      const result = await seriesArtwork(artworkMatch[1], u.searchParams.get('orientation') === 'landscape');
      if (!result) {
        res.writeHead(204, { 'Cache-Control': 'public, max-age=300' });
        return res.end();
      }
      res.writeHead(req.headers['if-none-match'] === result.etag ? 304 : 200, {
        'Content-Type': result.type, ETag: result.etag,
        'Cache-Control': 'public, max-age=86400',
      });
      return res.end(req.method === 'HEAD' || res.statusCode === 304 ? undefined : result.bytes);
    }
    if (
      route.startsWith('/api/') &&
      process.env.API_TOKEN &&
      req.headers.authorization !== `Bearer ${process.env.API_TOKEN}`
    ) {
      throw err('A backend access token is required.', 'UNAUTHORIZED', 401);
    }

    if (req.method === 'GET' && route === '/api/search') {
      const q = (u.searchParams.get('q') || '').trim();
      if (q.length > 200) throw err('Search is too long.', 'INVALID_REQUEST', 400);
      if (!q) return await sendJson(req, res, 200, { items: [], has_more: false });
      const cursor = u.searchParams.get('cursor') || '';
      const filter = u.searchParams.get('filter') || '';
      const filters = filter ? [filter] : undefined;
      const data = await memo(`search:${q}:${filter}:${cursor}`, () =>
        client.search(q, { cursor, pageSize: 30, filters })
      );
      return await sendJson(req, res, 200, catalogPage(data));
    }

    if (req.method === 'GET' && route === '/api/discover') {
      const type = u.searchParams.get('type') || 'all';
      const genre = u.searchParams.get('genre') || '';
      const setting = u.searchParams.get('setting') || '';
      const sort = u.searchParams.get('sort') || 'hot_score';
      const cursor = u.searchParams.get('cursor') || '';
      const force = u.searchParams.get('refresh') === '1';
      const data = await fetchDiscoverCatalog({ type, genre, setting, sort, cursor, force });
      return await sendJson(req, res, 200, data);
    }

    if (req.method === 'GET' && route === '/api/rank') {
      const content = u.searchParams.get('content') || '';
      const cursor = u.searchParams.get('cursor') || '';
      const force = u.searchParams.get('refresh') === '1';
      const data = await memo(
        `rank:${content}:${cursor}`,
        () => client.shortRank({ content: content || undefined, cursor: boundedCatalogCursor(cursor) || undefined }),
        180_000,
        force
      );
      return await sendJson(req, res, 200, catalogPage(data));
    }

    if (req.method === 'GET' && route === '/api/new') {
      const cursor = u.searchParams.get('cursor') || '';
      const force = u.searchParams.get('refresh') === '1';
      const data = await memo(
        `new:${cursor}`,
        () => client.newReleases({ cursor: boundedCatalogCursor(cursor) || undefined }),
        180_000,
        force
      );
      return await sendJson(req, res, 200, catalogPage(data));
    }

    let m = route.match(/^\/api\/series\/(\d{4,24})\/bundle$/);
    if (req.method === 'GET' && m) {
      const seriesId = m[1];
      const bundle = await loadSeriesBundle(seriesId);
      return await sendJson(req, res, 200, { series: bundle.series || { id: seriesId }, episodes: bundle.episodes });
    }

    m = route.match(/^\/api\/series\/(\d{4,24})(\/episodes)?$/);
    if (req.method === 'GET' && m) {
      const bundle = await loadSeriesBundle(m[1]);
      const data = m[2] ? bundle.episodes && { items: bundle.episodes, has_more: false } : bundle.series;
      if (!data) throw err('Series information is unavailable. Please try again.', 'CONTENT_UNAVAILABLE', 502);
      return await sendJson(req, res, 200, data);
    }

    m = route.match(/^\/api\/qualities\/(\d{4,24})$/);
    if (req.method === 'GET' && m) {
      const r = await playback(m[1]);
      return await sendJson(req, res, 200, {
        qualities: qualities(r.playback),
        duration: r.playback.duration_seconds,
      });
    }

    if (req.method === 'POST' && route === '/api/playback') {
      if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) {
        throw err('Expected a JSON request.', 'INVALID_REQUEST', 415);
      }
      const b = await body(req);
      if (!idValid(b.episodeId)) {
        throw err('A valid episode ID is required.', 'INVALID_REQUEST', 400);
      }
      const quality = b.quality ?? 'auto';
      if (typeof quality !== 'string' || !/^(auto|240p|360p|480p|540p|720p|1080p)$/.test(quality)) {
        throw err('Invalid quality.', 'INVALID_REQUEST', 400);
      }
      const existing = [...jobs.values()].find(
        (j) =>
          j.episodeId === b.episodeId &&
          j.requestedQuality === quality &&
          j.status !== 'error' &&
          (j.status !== 'complete' || j.manifestText)
      );
      if (existing) {
        existing.updated = Date.now();
        return await sendJson(req, res, 200, jobView(existing));
      }
      if (queue.length >= 12) {
        throw err('The media queue is full. Please try again shortly.', 'QUEUE_FULL', 429);
      }
      // No await between deduplication, capacity check and reservation. Concurrent clicks share one job.
      const id = randomUUID();
      const j = {
        id,
        episodeId: b.episodeId,
        requestedQuality: quality,
        status: 'queued',
        segmentsReady: 0,
        manifestText: null,
        updated: Date.now(),
        dir: path.join(MEDIA, id),
      };
      jobs.set(id, j);
      queue.push(j);
      pump();
      return await sendJson(req, res, 202, jobView(j));
    }

    m = route.match(/^\/api\/playback\/([a-f0-9-]{36})$/);
    if (req.method === 'GET' && m) {
      const j = jobs.get(m[1]);
      if (!j) throw err('Playback session expired.', 'SESSION_EXPIRED', 404);
      j.updated = Date.now();
      return await sendJson(req, res, 200, jobView(j));
    }

    m = route.match(/^\/media\/([a-f0-9-]{36})\/(index\.m3u8|init\.mp4|segment-\d{5,8}\.m4s)$/);
    if (['GET', 'HEAD'].includes(req.method) && m) {
      const j = jobs.get(m[1]);
      if (!j) throw err('Playback session expired.', 'SESSION_EXPIRED', 404);
      j.updated = Date.now();
      const fileName = m[2];
      if (fileName === 'index.m3u8') {
        await refreshJobManifest(j);
        if (j.manifestText) {
          const buf = Buffer.from(j.manifestText, 'utf8');
          res.writeHead(200, {
            'Content-Type': types['.m3u8'],
            'Content-Length': buf.length,
            'Cache-Control': 'no-store',
          });
          return res.end(req.method === 'HEAD' ? undefined : buf);
        }
      }
      return await serveFile(req, res, path.join(j.dir, fileName), true);
    }

    if (route.startsWith('/api/') || route.startsWith('/media/')) {
      throw err('Endpoint not found.', 'NOT_FOUND', 404);
    }
    if (!['GET', 'HEAD'].includes(req.method)) {
      throw err('Method not allowed.', 'METHOD_NOT_ALLOWED', 405);
    }
    if (route === '/vendor/hls.min.js') {
      return await serveFile(req, res, path.join(ROOT, 'node_modules/hls.js/dist/hls.min.js'));
    }
    let relative;
    try {
      relative = decodeURIComponent(route).replace(/^\/+/, '');
    } catch {
      throw err('Invalid request path.', 'INVALID_REQUEST', 400);
    }
    if (relative === 'studio-insights' || relative === 'studio-insights/') relative = 'studio-insights/index.html';
    if (relative === 'studio-insights/index.html') {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      res.setHeader('Referrer-Policy', 'no-referrer');
    }
    const file = path.resolve(WEB, relative || 'index.html');
    if (file !== WEB && !file.startsWith(WEB + path.sep)) {
      throw err('File not found.', 'NOT_FOUND', 404);
    }
    return await serveFile(req, res, file);
  } catch (e) {
    if (!res.headersSent) {
      if (e.status === 429 || e.status === 503) res.setHeader('Retry-After', '60');
      await sendJson(req, res, e.status || 502, publicError(e));
    } else {
      res.destroy();
    }
  }
});
server.requestTimeout = 30_000;
server.headersTimeout = 15_000;

// Pre-warm primary catalog feeds in background on startup
setTimeout(() => {
  fetchDiscoverCatalog({ type: 'all', sort: 'hot_score' }).catch(() => {});
  memo('rank::', () => client.shortRank({}), 180_000).catch(() => {});
  memo('new:', () => client.newReleases({}), 180_000).catch(() => {});
}, 50).unref?.();

server.listen(PORT, process.env.HOST || '0.0.0.0', () =>
  console.log(`Duanju Studio listening on http://localhost:${PORT}`)
);

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    for (const child of children) child.kill();
    for (const entry of workerPool) {
      try {
        entry.worker.terminate();
      } catch {}
    }
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 2000).unref();
  });
}
