import { appendFile, cp, mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const origin = (process.env.PUBLIC_API_ORIGIN || '').replace(/\/$/, '');
if (origin) {
  const url = new URL(origin);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('PUBLIC_API_ORIGIN must be an HTTP(S) origin without credentials or a path');
}
await mkdir(path.join(root, 'dist'), { recursive: true });
await cp(path.join(root, 'web'), path.join(root, 'dist'), { recursive: true });
await mkdir(path.join(root, 'dist/vendor'), { recursive: true });
await cp(path.join(root, 'node_modules/hls.js/dist/hls.min.js'), path.join(root, 'dist/vendor/hls.min.js'));
await appendFile(path.join(root, 'dist/config.js'), `window.DUANJU_CONFIG.apiOrigin = ${JSON.stringify(origin).replace(/</g, '\\u003c')};\n`);
await readFile(path.join(root, 'dist/index.html'));
console.log('Frontend built in dist/. Backend origin: ' + (origin || 'same origin'));
