# Coconut TV · 椰子短剧

A responsive short-drama player with a macOS-style interface, English/Chinese UI, live Hongguo catalog, and a self-hosted HLS media worker. The layout follows the original hongguo-player's sidebar, filters, and poster grid; the frontend is newly written.

## Run locally

Requirements: Node.js 20 or newer and FFmpeg on PATH. FFmpeg must include the libx264 encoder.

```sh
npm ci
npm start
```

Open http://localhost:4173. The server supplies both the interface and streaming API. First playback needs a few seconds to resolve the source and prepare segments. Media continues preparing while playback starts.

## Features

- Real catalog browsing, search, series details, and episode selection.
- Complete episodes through openhongguo, packaged locally as H.264/AAC HLS.
- Source-quality selection up to 1080p where available, with portrait orientation preserved.
- Optional WebGL2 video upscaling to 1440p or 4K output targets. The renderer preserves aspect ratio, and playback controls remain a separate layer. Upscaling is off by default and uses the original video in Picture in Picture.
- English/Chinese interface, light/dark appearance, responsive navigation.
- Playback speed, seeking, fullscreen, picture-in-picture where the browser supports it, and automatic next episode.
- Local watch history, resume position, and favorites in the browser.
- Persistent anonymous backend device profile, bounded media workers, and expiring media cache.

The language switch changes interface text, not episode audio, subtitles, or source titles. Availability and maximum quality depend on the upstream title. Requests can be refused or return empty responses; retrying does not guarantee access to every title.

## Configuration and deployment

See `.env.example` for environment variables. The server reads actual environment variables; export them in your shell/container or start Node with `--env-file=.env` after making a local copy. Device profiles and prepared media live in ignored `data/` and must not be committed or deployed as frontend assets.

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel frontend and Docker backend setup. The frontend build is `npm run build`; it writes `dist/` and reads `PUBLIC_API_ORIGIN`. No cloud service is created by running the build.

Vercel hosts the frontend in this design. Its streaming backend is a separate persistent Node/FFmpeg service. You can also self-host both together with Docker.

## Upstream

Uses [openhongguo](https://github.com/beilunyang/openhongguo) 0.3.0 and [hls.js](https://github.com/video-dev/hls.js). Their package notices remain applicable. The SDK repository includes an Apache-2.0 license alongside research/noncommercial wording in its documentation; clarify those terms and content permissions before a commercial or public redistribution service. This project does not supply rights to the upstream episode catalog.
