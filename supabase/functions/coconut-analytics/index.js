const events = new Set(['page_view','series_view','play_start','play_complete','watch_time','ad_impression','ad_click']);
const pages = new Set(['home','browse','series','live','discover','rank','new','search','favorite','folders','history','settings','detail','player']);
const ads = new Set(['advertise','local','sponsor']);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const mediaId = /^[0-9]{4,24}$/;
const buckets = new Map();

function withinBudget(request, report) {
  // This budget is only an abuse deterrent. No peer address is stored in the analytics data.
  const peer = request.headers.get('x-forwarded-for')?.split(',')[0].trim().slice(0, 64) || 'unknown';
  const key = (report ? 'report:' : 'event:') + peer;
  const window = Math.floor(Date.now() / 60000);
  const prior = buckets.get(key);
  const count = prior?.window === window ? prior.count + 1 : 1;
  buckets.delete(key);
  buckets.set(key, { window, count });
  if (buckets.size > 512) buckets.delete(buckets.keys().next().value);
  return count <= (report ? 15 : 150);
}

async function readJson(request) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const decoder = new TextDecoder();
  let size = 0;
  let value = '';
  while (true) {
    const next = await reader.read();
    if (next.done) return JSON.parse(value + decoder.decode());
    size += next.value.byteLength;
    if (size > 16000) {
      await reader.cancel();
      throw new Error('Payload too large');
    }
    value += decoder.decode(next.value, { stream: true });
  }
}

function sanitize(event, sessionId) {
  if (!event || typeof event !== 'object' || typeof event.id !== 'string' || !uuid.test(event.id) ||
    !events.has(event.type) || !pages.has(event.page)) return null;
  const series = typeof event.series === 'string' && mediaId.test(event.series) ? event.series : null;
  const episode = typeof event.episode === 'string' && mediaId.test(event.episode) ? event.episode : null;
  const ad = ads.has(event.ad) ? event.ad : null;
  const seconds = Number.isInteger(event.seconds) && event.seconds > 0 && event.seconds <= 60 ? event.seconds : null;
  const isPlayback = ['play_start','play_complete','watch_time'].includes(event.type);
  if ((event.type === 'series_view' && !series) || (isPlayback && (!series || !episode)) ||
    (event.type === 'watch_time' && !seconds) || (event.type.startsWith('ad_') && !ad)) return null;
  return {
    event_id: event.id, session_id: sessionId, event_type: event.type, page: event.page,
    series_id: series,
    series_title: series && typeof event.title === 'string' ? Array.from(event.title.replace(/[\u0000-\u001f]+/g, ' ').replace(/\s+/g, ' ').trim()).slice(0, 120).join('') : null,
    episode_id: episode, ad_id: event.type.startsWith('ad_') ? ad : null,
    seconds: event.type === 'watch_time' ? seconds : null,
  };
}

async function rpc(name, data) {
  const project = Deno.env.get('SUPABASE_URL');
  const secrets = Deno.env.get('SUPABASE_SECRET_KEYS');
  const key = (secrets ? JSON.parse(secrets).default : null) || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!project || !key) throw new Error('Analytics database is unavailable');
  const headers = { apikey: key, 'Content-Type': 'application/json' };
  if (!key.startsWith('sb_secret_')) headers.Authorization = 'Bearer ' + key;
  const response = await fetch(project + '/rest/v1/rpc/' + name, {
    method: 'POST', headers, body: JSON.stringify(data), signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('Analytics database request failed: ' + response.status);
  if (response.status === 204) return null;
  const result = await response.text();
  return result ? JSON.parse(result) : null;
}

Deno.serve(async request => {
  const origin = request.headers.get('origin');
  const headers = {
    'Cache-Control': 'no-store',
    Vary: 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Coconut-Stats-Key',
    'X-Content-Type-Options': 'nosniff',
  };
  // Reports require an independent high-entropy key, regardless of origin.
  if (origin && /^https?:\/\/[a-z0-9.[\]:-]+$/i.test(origin)) headers['Access-Control-Allow-Origin'] = origin;
  const reply = (message, status) => Response.json(message, { status, headers });
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return reply({ error: 'Use POST' }, 405);
  const pathname = new URL(request.url).pathname.replace(/\/$/, '');
  const isReport = pathname.endsWith('/report');
  if (!isReport && !pathname.endsWith('/coconut-analytics')) return reply({ error: 'Not found' }, 404);
  if (!withinBudget(request, isReport)) return reply({ error: 'Please try again shortly' }, 429);

  let body;
  try { body = await readJson(request); }
  catch { return reply({ error: 'Invalid analytics request' }, 400); }

  try {
    if (isReport) {
      const key = request.headers.get('x-coconut-stats-key');
      if (!key || !/^[a-f0-9]{64}$/.test(key)) return reply({ error: 'Access key required' }, 401);
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
      const accessHash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
      const days = [7,30,90].includes(body?.days) ? body.days : 30;
      const report = await rpc('coconut_stats_report', { access_hash: accessHash, days });
      return report ? reply(report, 200) : reply({ error: 'Invalid access key' }, 401);
    }

    if (typeof body?.session !== 'string' || !uuid.test(body.session) || !Array.isArray(body?.events) ||
      !body.events.length || body.events.length > 20) return reply({ error: 'Invalid event batch' }, 400);
    const batch = body.events.map(event => sanitize(event, body.session)).filter(Boolean);
    if (!batch.length) return reply({ error: 'No supported events' }, 400);
    await rpc('coconut_record_events', { batch });
    return new Response(null, { status: 204, headers });
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Analytics request failed');
    return reply({ error: 'Analytics temporarily unavailable' }, 503);
  }
});
