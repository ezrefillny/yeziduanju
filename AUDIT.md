# Follow-up — 2026-11-18

The homepage hero now uses the provider's original promotional poster, displayed without cropping or a dark image mask in a compact portrait layout. Desktop poster width is capped at 340 CSS pixels (the sampled originals are 400 pixels wide); mobile is capped at 260 pixels. This is an intentional composition change, not a claim that the provider supplied a new HD poster. The earlier episode-still presentation below is superseded for the homepage. Detail artwork remains separate.

Quality switching fixes:

- Unchanged polling results no longer replace the dropdown's option DOM, preserving focus and click targets.
- The menu scrolls within its allotted height; options do not shrink or spill outside it.
- Only server-reported renditions appear once known; queued updates retain the last known options.
- Rapid switches preserve the intended seek position, and paused playback remains paused after metadata loads.
- The server reports the duration of encoded HLS segments. Playback waits until the requested position is available, preventing HLS from clamping a resume seek back to the opening fragments.
- Selecting the existing quality avoids an unnecessary restart.

Contrast: raised-surface text, muted labels, player dropdown states, detail action buttons, light-mode watched/selected controls and accent states were corrected. Preset and custom accents receive theme-specific contrast adjustments. Numeric regression checks verify at least 4.5:1 for the tested normal/hover/selected foreground-background pairs and all accent presets, plus white/black/yellow custom-color cases. This checks the defined palettes, not every rendered pixel over imagery.

Validation: 18 source-level regression tests and syntax/build checks pass. No Computer Use or browser layout automation was used. Live quality/seek checks are recorded in `data/quality-switch-verification.json`. Browser rendering and physical-device verification remain outstanding.

---

# Coconut TV audit — 2026-11-17

## Status

Source and local API audit completed with fixes. This continuation used no Computer Use or browser automation. Desktop/mobile CSS and interaction logic were reviewed, but no new rendered layout, device, animation or GPU verification was performed. Older browser playback results do not establish current streaming availability.

**Playback restored in the follow-up:** the npm 0.3.0 package was using the obsolete playback request. The original repository added a V5 fix after that package was published. The project now installs a local package built from unmodified upstream commit `6919947a19f3e3135da83c4e9dad379c93c43110`, pinned in package.json and the lockfile. Provenance, licenses and checksum are documented in `vendor/README.md`. Docker copies that package before dependency installation.

First, middle and final episodes (1, 49 and 96) of series `7706512650816982040` successfully produced complete HLS streams. FFmpeg decoded both the beginning and near-end seeks (171, 54 and 150 seconds). FFprobe confirmed H.264 video at 1080 x 1920 with AAC audio. This replaces the earlier upstream-blocked result; it does not certify every provider title or browser/device.

The player episode range control is now a custom dropdown fixed above a separately scrolling episode list. Fullscreen CSS no longer hides the panel/header. Shelf sorting and available caption choices also use the custom dropdown engine, with keyboard navigation and selection semantics. All native select markup was removed.

The slideshow no longer creates a blurred, enlarged poster background. It displays original episode artwork, preserves portrait proportions on phones, caps lower-resolution poster fallbacks, and preloads the next original image. No mock or generated images were added.

## Changes in this audit pass

- Catalog pagination combines the all-types, live, animation and AI feeds, deduplicates IDs and follows cursors through exhaustion. No 28-page limit. Superseded requests are canceled; late page responses cannot overwrite a newer selection. Invalid cursors produce HTTP 400.
- Playback requests and media listeners are canceled when leaving or switching episodes. HLS startup also handles metadata that arrived before its manifest callback. Concurrent job creation and source resolution are deduplicated. Terminal SDK failures stop redundant application retries and receive clear English/Chinese messages.
- Hero/detail artwork uses original episode imagery when available, with poster fallback. Portrait art avoids excessive desktop cropping. No generated media was added.
- Synopsis and episode metadata load independently; cached description text renders immediately. Episode buttons announce the correct episode. Misleading HD badges were removed from low-resolution options.
- Player quality/speed settings remain inside the video stage. Settings, episode controls, light-mode colors, mobile sizing, safe areas and focus visibility were refined. Reduced-motion preferences and paused/inactive states limit animation work.
- Library sorting, folder creation, custom accent input, watched progress and update badges were corrected. Invalid persisted arrays/objects no longer break library startup. Unsupported ratings, dates, duration estimates, AI claims and account-sync implications were removed.
- Video resampling uses the existing WebGL bicubic renderer, independently of the DOM player controls. It is interpolation, not an AI reconstruction model; source availability and device GPU limits still apply.
- Image delivery validates raster signatures, bounds memory and queues, and uses the complete source URL for cache keys. API queues and per-peer request budgets are bounded. The backend rejects invalid JSON shapes and byte ranges; cross-origin access is explicit by default. Security headers cover API preflight and frontend responses.
- Catalog cache size is bounded. Persisted records retain the original fetch timestamp, preventing unrelated saves/restarts from renewing obsolete catalog entries indefinitely.
- The Vercel frontend build and deployment guide were updated. Streaming still requires a persistent Node/FFmpeg backend. No deployment was performed and no secret is embedded in frontend configuration.

## Verification

- `npm run check`: server, frontend and resampler syntax passed.
- `npm test`: 14 source-level regression tests passed. These cover corrupt storage, cursor validation, page races, cancellation, deduplication, HLS startup timing, translations/IDs, error localization, quality labeling and cache bounds/age.
- `npm run build`: static frontend built successfully in `dist/`.
- Live HTTP checks: health, invalid JSON objects, invalid episode IDs/cursors, disallowed origins/preflight, same-origin preflight, private image URL rejection, invalid byte ranges, private profile path rejection, security headers and the current frontend asset version passed.
- Earlier error-path verification: three concurrent playback POSTs produced one shared job, and the provider error code/message reached the client. Following the SDK update, successful streaming and seeking were independently verified as described above.
- Four-feed catalog scan: all-types 558 distinct IDs in 32 batches; live 1,080 in 61; animation 594 in 34; AI 792 in 45. Every feed returned `has_more: false`; the union contained **2,466 distinct IDs**. These are the titles returned during this scan, not a guarantee of the provider's entire inventory or playability. Feeds change over time.
- Sample series artwork: **1080 × 1920**, 62,603 bytes. First request 1.996 s; cached request 0.011 s. Its series/episodes bundle took 0.569 s, then 0.017 s cached. These are local samples, not latency guarantees.
- Dependency audit after installing the pinned SDK reported zero known vulnerabilities. Upstream SDK/protocol/signing Go tests and all six Node binding tests passed.

Machine-readable local results: `data/playback-v5-result.json`, `data/audit-catalog-result.json` and `data/audit-http-result.json` (the latter records the earlier error-path check). The data directory is excluded from the frontend build and Docker build context.

## Remaining validation

1. Verify autoplay, saved-position resume and quality changes in the actual browser; source resolution, HLS encoding, 1080p decoding and seeking now pass server-side tests.
2. Verify rendered desktop and phone layouts, keyboard interactions, fullscreen/PiP and touch scrubbing; test real iOS/Android devices and GPU load with upscaling enabled. These were not run in this continuation.
3. Verify the intended HTTPS frontend/backend origins and resource capacity on the deployment host before publishing.
