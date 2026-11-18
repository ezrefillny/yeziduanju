# Pinned openhongguo playback fix

Package: `openhongguo-0.3.0-6919947.tgz`

Source: https://github.com/beilunyang/openhongguo/tree/6919947a19f3e3135da83c4e9dad379c93c43110

The npm 0.3.0 release uses the old playback request. This upstream revision includes the V5 route and the corrected device query/headers. The application uses this local npm archive so `npm ci`, Docker and Vercel installs do not silently revert to the broken published build. Upstream source is unmodified. The package retains upstream Apache-2.0 and Go licenses.

Built with Go 1.27.4 for js/wasm using upstream `bindings/node/scripts/build.mjs`, then `npm pack` from `bindings/node`. There are no profiles, content keys or media in this archive.

Archive SHA-256: `67808b16af871682d4468bce0f428afc85d12f3444c18a480510b9f02ab96b2a`

To rebuild: check out the exact source commit, put Go on PATH, run `npm run build` and `npm test` inside `bindings/node`, then `npm pack`. Run `go test ./sdk ./internal/protocol/...` at the source root. Preserve the source revision and update this checksum and the lockfile when intentionally replacing the archive.

2026-11-17: upstream Go tests and all six Node binding tests passed. Application streaming tests successfully decoded the first, middle and final episodes of a 96-episode series at 1080 x 1920. See the application audit for verification limits.
