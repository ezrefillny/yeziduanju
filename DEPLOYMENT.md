# Deployment

The browser frontend is prepared for Vercel. The included Dockerfile packages the Node.js streaming backend with FFmpeg.

## Local configuration

With Node.js 20.6 or later, copy `.env.example` to `.env` and run `npm run start:local`. This loads the local configuration and binds the backend to `127.0.0.1:4173` by default. Use `npm run build:local` to load the same file for a frontend build. Leave `PUBLIC_API_ORIGIN` empty when this Node process also serves the website.

## Vercel frontend

1. Import this directory as the project root. Framework preset: Other. The included `vercel.json` sets the build and output directory.
2. Under Settings → Environment Variables, set `PUBLIC_API_ORIGIN` as Config for Production. Use the HTTPS origin of your running streaming backend, such as `https://stream.example.com`. Enter only the scheme and hostname, plus the port if needed. Configure the same value for Preview if you plan to test preview deployments against this backend.
3. Deploy. The build runs `npm run build` and emits `dist/`, including the vendored HLS player.
4. Set the backend's `ALLOWED_ORIGINS` to the exact Vercel frontend URL. For preview deployments, add each intended preview origin explicitly.
5. Rebuild after changing `PUBLIC_API_ORIGIN`. The frontend uses the build configuration; browser Settings do not override the backend URL.

Vercel deployments need a publicly reachable HTTPS backend. A localhost backend is suitable for local development only. Do not put device profiles, media cache, or content keys in the frontend or Vercel build variables.

## Streaming backend

Run the supplied Docker container on a persistent Linux host. It runs Node.js with FFmpeg and serves both the website and its API when used alone. Mount `/app/data` for device profiles and media cache. Use HTTPS at the host's reverse proxy and set `ALLOWED_ORIGINS` to the frontend origin when separating the two hosts.

Use `docker compose up --build -d` for the included container setup. Access the local website at `http://localhost:4173`. Compose uses `HOST` and `PORT` for the published host port. The container listens on `0.0.0.0:4173` and stores data in the named volume mounted at `/app/data`. A reverse proxy on the same host can use the default loopback binding. Restrict access to trusted users at your HTTPS proxy before exposing the service publicly: the worker uses real CPU, storage, and upstream requests.

1080p is offered when supplied by the upstream title. On a memory-limited host, start with `MEDIA_WORKERS=1` and `FFMPEG_THREADS=1`. Benchmark the actual host before increasing worker concurrency. English/Chinese changes interface text. Episode audio and titles remain as supplied by the source.

## Verification before publishing

Check catalog loading, first/middle/final episodes, seeking, autoplay, phone layout, both interface languages, source quality selection, and an actual 1080p source. Verify allowed-origin CORS for both API and media requests from the Vercel URL. No Vercel production deployment is performed by these preparation files.

## Request and resource limits

Same-origin requests work by default. Cross-origin access requires an explicit `ALLOWED_ORIGINS` entry. The backend bounds SDK, image and media queues and returns retryable HTTP errors when busy. Its per-minute request limits use the socket peer address, not client-supplied forwarding headers. When using a shared reverse proxy, configure per-client limits at that proxy and account for the backend's aggregate peer limits.

`API_TOKEN` is intended for direct authenticated API clients or a trusted gateway. The static browser app does not collect an API token. Do not embed this secret in `PUBLIC_API_ORIGIN` or other frontend configuration. Image assets remain public by design.

## Pinned playback SDK

Keep `vendor/openhongguo-0.3.0-6919947.tgz` with the repository. It contains the original openhongguo project's V5 playback fixes, built from commit `6919947a19f3e3135da83c4e9dad379c93c43110`; the public npm 0.3.0 package predates those fixes. Both package.json and package-lock.json refer to this archive. `npm ci` needs it during Vercel and Docker builds. Go is only needed to rebuild the SDK archive, not to deploy or run the application. See `vendor/README.md` for provenance and checksum.

## Analytics

The website sends browsing, playback and ad events to the Coconut TV Edge Function in the specified Supabase project. The frontend only receives the public function URL. The Edge Function uses its Supabase-provided server key to write data and compute reports. The analytics tables live in a private schema and the reporting RPCs are reserved for the service role.

Open /studio-insights and enter your private dashboard key. Keep the key in a password manager or an ignored local file. Never put it in Git, frontend variables, or a URL. To issue another key, generate 32 random bytes as a 64-character lowercase hex string, hash the text with SHA-256, and insert only the lowercase hash in coconut_analytics.owner_keys through the Supabase SQL editor. The included migrations and Edge Function can be reapplied to another Supabase project by pointing web/config.js and the local server Content Security Policy at its analytics function URL.

Sessions are counted per browser tab, without a persistent visitor ID. Playback starts are counted when video begins playing. Watch time measures time spent playing, and an ad impression requires half of the slot to be visible for one second. The placeholder ad uses a telephone link, so the report counts phone-link taps rather than completed calls. Search terms and visitor contact information are not collected. Clients that send Global Privacy Control or Do Not Track are excluded from website analytics.
