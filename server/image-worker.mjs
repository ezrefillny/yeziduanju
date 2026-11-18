import { parentPort, workerData } from 'node:worker_threads';
import convert from 'heic-convert';

async function toJpeg(input, quality = 0.86) {
  const bytes = await convert({
    buffer: Buffer.from(input),
    format: 'JPEG',
    quality,
  });
  return new Uint8Array(bytes);
}

if (workerData) {
  try {
    const bytes = await toJpeg(workerData);
    parentPort.postMessage({ bytes }, [bytes.buffer]);
  } catch {
    parentPort.postMessage({ error: 'Image conversion failed.' });
  }
} else if (parentPort) {
  parentPort.on('message', async (msg) => {
    const { id, bytes: input, quality } = msg || {};
    try {
      const out = await toJpeg(input, quality || 0.86);
      parentPort.postMessage({ id, bytes: out }, [out.buffer]);
    } catch {
      parentPort.postMessage({ id, error: 'Image conversion failed.' });
    }
  });
}
