import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

// Run the actual source functions in isolated contexts. No browser automation or upstream calls.
const app = await readFile(new URL('../web/app.js', import.meta.url), 'utf8');
const server = await readFile(new URL('../server/index.mjs', import.meta.url), 'utf8');
const html = await readFile(new URL('../web/index.html', import.meta.url), 'utf8');
const section = (source, start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));

test('corrupt local storage cannot break folders, history or watched state', () => {
  let raw;
  const ctx = vm.createContext({ localStorage: { getItem: () => raw } });
  vm.runInContext(section(app, 'function read(k, d)', 'function store(k, v)'), ctx);
  raw = '{invalid';
  assert.equal(vm.runInContext("read('duanju.theme', 'dark')", ctx), 'dark');
  raw = '[null,42,{"id":"folder","name":"Saved","series":null}]';
  assert.equal(vm.runInContext("read('duanju.folders', [])[0].series.length", ctx), 0);
  raw = '[]';
  assert.equal(vm.runInContext("Array.isArray(read('duanju.watchedEpisodes', {}))", ctx), false);
  raw = '{"not":"an array"}';
  assert.equal(vm.runInContext("read('duanju.history', []).length", ctx), 0);
});

test('catalog cursor rejects malformed JSON and preserves paging position while bounding exclusions', () => {
  const ctx = vm.createContext({ Buffer, err: (message, code, status) => Object.assign(new Error(message), { code, status }) });
  vm.runInContext(section(server, 'function boundedCatalogCursor', 'function catalogPage'), ctx);
  assert.throws(() => ctx.boundedCatalogCursor('s1.broken'), { status: 400 });
  assert.throws(() => ctx.boundedCatalogCursor('s1.' + Buffer.from('null').toString('base64url')), { status: 400 });
  const payload = { o: 720, s: Array.from({ length: 720 }, (_, i) => String(i)), q: { sort: ['hot_score'] } };
  const bounded = ctx.boundedCatalogCursor('s1.' + Buffer.from(JSON.stringify(payload)).toString('base64url'));
  const result = JSON.parse(Buffer.from(bounded.slice(3), 'base64url'));
  assert.equal(result.o, 720);
  assert.equal(result.s.length, 180);
  assert.equal(result.s[0], '540');
  assert.deepEqual(result.q, payload.q);
});

test('latest page selection wins if an older network request finishes later', async () => {
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  const ctx = vm.createContext({
    pageIntent: 0, loadNonce: 1, currentPage: 1, failedPage: 0, items: [], catalogSources: [{}],
    totalKnownPages: () => 2, getPageSize: () => 18,
    getPageItems: p => p === 1 ? Array(18).fill({ id: 'first' }) : [{ id: 'older-request' }],
    ensureBufferForPage: () => pending, skeleton() {}, renderHeroSlideshow() {}, renderCards() {},
    renderPaginationControls() {}, ensureNextPagesPreloaded() {},
    window: { scrollTo() {} }, reduceMotion: true, matchMedia: () => ({ matches: true }),
  });
  vm.runInContext(section(app, 'async function goToPage', 'function skeleton'), ctx);
  const older = ctx.goToPage(2);
  await ctx.goToPage(1);
  release();
  await older;
  assert.equal(ctx.currentPage, 1);
  assert.equal(ctx.items[0].id, 'first');
});

test('changing catalog cancels its pending fetch and deduplicates overlapping source pages', async () => {
  let receivedSignal;
  const ctx = vm.createContext({
    URL, AbortController, AbortSignal, setTimeout,
    activeNav: 'discover', streamRequest: undefined, catalogAbort: new AbortController(), loadNonce: 1,
    catalogSources: [{ url: '/api/discover', cursor: '', visited: new Set() }],
    streamSeenIds: new Set(['1234']), streamBuffer: [{ id: '1234' }],
    location: { origin: 'http://localhost' }, listOf: page => page.items, normalize: item => item,
    api: async (_url, options) => {
      receivedSignal = options.signal;
      return { items: [{ id: '1234' }, { id: '5678' }], cursor: 'next', has_more: true };
    },
  });
  vm.runInContext(section(app, 'function fetchNextStreamBatch', 'async function ensureBufferForPage'), ctx);
  await ctx.fetchNextStreamBatch(1);
  assert.deepEqual(Array.from(ctx.streamSeenIds), ['1234', '5678']);
  assert.equal(ctx.catalogSources[0].cursor, 'next');
  ctx.catalogAbort.abort();
  assert.equal(receivedSignal.aborted, true);
});

test('leaving playback aborts both pending requests and media listeners', () => {
  const controller = new AbortController();
  const listeners = new AbortController();
  let destroyed = false;
  let dismissed = false;
  const ctx = vm.createContext({
    hideNextUp() { dismissed = true; },
    activePlaybackRequest: controller, activeStreamEvents: listeners,
    hls: { destroy() { destroyed = true; } }, videoResampler: { reset() {} },
    $: () => ({ pause() {}, removeAttribute() {}, load() {} }),
  });
  vm.runInContext(section(app, 'function stopStream()', 'function recordProgress'), ctx);
  ctx.stopStream();
  assert.equal(controller.signal.aborted, true);
  assert.equal(listeners.signal.aborted, true);
  assert.equal(destroyed, true);
  assert.equal(dismissed, true);
  assert.equal(ctx.hls, null);
});

test('HLS starts when metadata has already arrived before manifest callback', async () => {
  let playCalls = 0;
  const callbacks = new Map();
  class FakeHls {
    static isSupported() { return true; }
    static Events = { MANIFEST_PARSED: 'manifest', ERROR: 'error' };
    on(name, fn) { callbacks.set(name, fn); }
    loadSource() {}
    attachMedia() {}
  }
  const video = { readyState: 1, currentTime: 0, play: async () => { playCalls++; } };
  const ctx = vm.createContext({
    AbortController, Hls: FakeHls, window: { Hls: FakeHls },
    $: selector => selector === '#video' ? video : { hidden: false, checked: false },
    endpoint: value => value, hlsBufferConfig: () => ({}),
    playerNonce: 2, currentSpeed: '1.5', currentJob: {}, updateStreamBadgeAndHud() {},
  });
  vm.runInContext(section(app, 'async function attachStream', 'async function playEpisode'), ctx);
  await ctx.attachStream('/media/test/index.m3u8', 2, 35);
  callbacks.get('manifest')();
  assert.equal(playCalls, 1);
  assert.equal(video.currentTime, 35);
  assert.equal(video.playbackRate, 1.5);
  ctx.playerNonce = 3;
  callbacks.get('manifest')();
  assert.equal(playCalls, 1);
});

test('all static interface translations exist in both languages and HTML IDs are unique', () => {
  const dict = vm.runInNewContext(section(app, 'const dict =', 'function read(') + '; dict');
  const keys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map(match => match[1]);
  for (const lang of ['en', 'zh']) for (const key of keys) assert.ok(dict[lang][key], `${lang}.${key}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  assert.ok(html.includes('id="library-sort-toggle"'));
  assert.ok(html.includes('id="new-folder-quick-btn"'));
});

test('playback coalesces requests and stops retrying terminal upstream failures', async () => {
  let attempts = 0;
  const terminal = Object.assign(new Error('empty upstream response'), { code: 'ANONYMOUS_LIMITED', retryable: false });
  const ctx = vm.createContext({
    inflight: new Map(), cache: new Map(), sdk: fn => fn(),
    client: { resolvePlayback: async () => { attempts++; throw terminal; } },
    setTimeout, cacheValue() {},
  });
  vm.runInContext(section(server, 'async function playback(', 'function height('), ctx);
  const results = await Promise.allSettled([ctx.playback('1234'), ctx.playback('1234')]);
  assert.equal(attempts, 1);
  assert.equal(results[0].reason.code, 'ANONYMOUS_LIMITED');
  assert.equal(results[1].reason, results[0].reason);
  assert.equal(ctx.inflight.size, 0);
  await assert.rejects(ctx.playback('1234'));
  assert.equal(attempts, 2, 'a later explicit retry can request the provider again');
});

test('upstream errors are localized for both direct API and job responses', async () => {
  let data;
  const ctx = vm.createContext({
    AbortSignal, endpoint: value => value, t: key => `translated:${key}`,
    fetch: async () => ({ ok: true, json: async () => data }),
  });
  vm.runInContext(section(app, 'async function api(', 'function imageUrl('), ctx);
  for (const field of ['code', 'errorCode']) {
    data = { error: 'raw SDK error', [field]: 'ANONYMOUS_LIMITED' };
    await assert.rejects(ctx.api('/api/playback/test'), { message: 'translated:sourceUnavailable' });
  }
});

test('quality menus do not label low-resolution streams as HD', () => {
  const menus = new Map();
  const dict = vm.runInNewContext(section(app, 'const dict =', 'function read(') + '; dict');
  const ctx = vm.createContext({
    t: key => dict.en[key], currentQuality: 'auto', defaultQuality: 'auto', episodeQualities: [],
    setCustomSelectOptions: (id, options) => menus.set(id, options),
  });
  vm.runInContext(section(app, 'function renderQualitySelectOptions(', 'function renderSearchQuickTags('), ctx);
  ctx.renderQualitySelectOptions(['240p', '480p', '720p', '1080p']);
  const labels = new Map(menus.get('quality-dropdown').map(option => [option.value, option.label]));
  assert.ok(!labels.get('240p').includes('HD'));
  assert.ok(!labels.get('480p').includes('HD'));
  assert.ok(labels.get('720p').includes('HD'));
  ctx.renderQualitySelectOptions(['360p', '720p']);
  assert.ok(!menus.get('quality-dropdown').some(option => option.value === '1080p'));
  ctx.renderQualitySelectOptions([]);
  assert.ok(!menus.get('quality-dropdown').some(option => option.value === '1080p'), 'queued updates retain known renditions');
});

test('catalog cache stays bounded and retains original fetch age across persistence', () => {
  const ctx = vm.createContext({});
  vm.runInContext(section(server, 'const cache = new Map();', 'const inflight ='), ctx);
  for (let i = 0; i < 251; i++) ctx.cacheValue(String(i), { value: i });
  assert.equal(vm.runInContext('cache.size', ctx), 250);
  assert.equal(vm.runInContext("cache.has('0')", ctx), false);
  ctx.cacheValue('restored', { value: {}, fetchedAt: 1234 });
  assert.equal(vm.runInContext("cache.get('restored').fetchedAt", ctx), 1234);
  assert.match(section(server, 'function scheduleCatalogSave()', 'const types ='), /savedAt: v\.fetchedAt/);
});

test('episode range selector renders all ranges and selects the last partial page', () => {
  const ranges = {}, list = {};
  let menu;
  const episodes = Array.from({ length: 96 }, (_, i) => ({ id: String(1000 + i), number: i + 1 }));
  const ctx = vm.createContext({
    episodes, EPISODE_PAGE_SIZE: 30, currentSeries: { id: 'series' }, history: () => [],
    watchedEpisodesMap: () => ({ series: ['1095'] }),
    t: key => key, esc: String, icon: () => '', episodeLabel: ep => `Episode ${ep.number}`,
    customSelectMarkup: id => `<div id="${id}"></div>`,
    setCustomSelectOptions: (id, options, selected) => { menu = { id, options, selected }; },
  });
  vm.runInContext(section(app, 'function renderEpisodePicker(', 'function renderDetailEpisodesGrid('), ctx);
  assert.equal(ctx.renderEpisodePicker({ ranges, list, index: 3, episodeAttr: 'data-episode', current: '1095' }), 3);
  assert.equal(ranges.hidden, false);
  assert.equal(menu.options.length, 4);
  assert.equal(menu.options[3].label, 'episodes 91–96');
  assert.equal(menu.selected, '3');
  assert.equal((list.innerHTML.match(/class="episode-btn/g) || []).length, 6);
  assert.match(list.innerHTML, /data-episode="1095"/);
  assert.doesNotMatch(list.innerHTML, /data-episode="1000"/);
  assert.match(list.innerHTML, /aria-current="true"/);
});

test('custom dropdown routes update range, shelf ordering and caption tracks', () => {
  let rendered = 0, focused = 0, sorted;
  const list = { scrollTop: 300 }, shelf = {}, tracks = [{ mode: 'showing' }, { mode: 'disabled' }];
  const ctx = vm.createContext({
    episodeRangeIndex: 0, renderEpisodeList: () => { rendered++; },
    $: selector => selector === '#episode-list' ? list : selector.startsWith('#shelf-sort-')
      ? { closest: () => shelf } : { focus: () => { focused++; } },
    loadGenreShelf: (element, sort) => { sorted = [element, sort]; }, captionTracks: () => tracks,
  });
  vm.runInContext(section(app, 'function handleCustomSelectChange(', 'function applyAppearance('), ctx);
  ctx.handleCustomSelectChange('player-range-dropdown', '3');
  assert.equal(ctx.episodeRangeIndex, 3);
  assert.equal(rendered, 1);
  assert.equal(focused, 1);
  assert.equal(list.scrollTop, 0);
  ctx.handleCustomSelectChange('shelf-sort-live', 'online_time');
  assert.deepEqual(sorted, [shelf, 'online_time']);
  ctx.handleCustomSelectChange('player-captions', '1');
  assert.deepEqual(tracks.map(track => track.mode), ['disabled', 'showing']);
  ctx.handleCustomSelectChange('player-captions', 'off');
  assert.ok(tracks.every(track => track.mode === 'disabled'));
});

test('native dropdowns and blurred hero duplicates are absent', async () => {
  assert.doesNotMatch(html + app, /<select\b|new Option\(/);
  assert.doesNotMatch(app, /stream-hero-wash/);
  const css = await readFile(new URL('../web/interface.css', import.meta.url), 'utf8');
  const hidingRule = css.match(/body\.player-filling-screen :is\([^}]+\}/)?.[0] || '';
  assert.doesNotMatch(hidingRule, /episodes-panel|player-page-header/);
});

test('rapid quality changes retain the pending seek and paused state', async () => {
  let calls = [];
  const video = { readyState: 0, currentTime: 0, paused: true };
  const ctx = vm.createContext({
    currentQuality: '1080p', currentEpisode: { id: '1234' },
    pendingPlaybackIntent: { episodeId: '1234', seek: 87, shouldPlay: false },
    $: () => video, playEpisode: (...args) => calls.push(args),
  });
  vm.runInContext(section(app, 'function changePlaybackQuality(', 'function renderSearchQuickTags('), ctx);
  ctx.changePlaybackQuality('720p');
  assert.deepEqual(calls[0], ['1234', '720p', 87, false]);
  ctx.changePlaybackQuality('1080p');
  assert.equal(calls.length, 1, 'choosing the current quality does not restart the stream');
  video.readyState = 1; video.currentTime = 93; video.paused = false;
  ctx.changePlaybackQuality('480p');
  assert.deepEqual(calls[1], ['1234', '480p', 93, true]);
  assert.equal(ctx.playbackReadyAt({ manifestUrl: '/video', status: 'ready', bufferedSeconds: 6 }, 87), false);
  assert.equal(ctx.playbackReadyAt({ manifestUrl: '/video', status: 'ready', bufferedSeconds: 90 }, 87), true);
  assert.equal(ctx.playbackReadyAt({ manifestUrl: '/video', status: 'complete' }, 87), true);
});

test('a quality switch preserves pause after HLS metadata arrives', async () => {
  let played = 0, paused = 0;
  const callbacks = new Map();
  class FakeHls {
    static isSupported() { return true; }
    static Events = { MANIFEST_PARSED: 'manifest', ERROR: 'error' };
    on(name, fn) { callbacks.set(name, fn); }
    loadSource() {}
    attachMedia() {}
  }
  const video = { readyState: 1, currentTime: 0, play: async () => { played++; }, pause: () => { paused++; } };
  const ctx = vm.createContext({
    AbortController, Hls: FakeHls, window: { Hls: FakeHls },
    $: selector => selector === '#video' ? video : { hidden: false, checked: false },
    endpoint: value => value, hlsBufferConfig: () => ({}), playerNonce: 2, currentSpeed: '1', currentJob: {}, updateStreamBadgeAndHud() {},
  });
  vm.runInContext(section(app, 'async function attachStream', 'async function playEpisode'), ctx);
  await ctx.attachStream('/media/test/index.m3u8', 2, 87, false);
  callbacks.get('manifest')();
  assert.equal(played, 0);
  assert.equal(paused, 1);
  assert.equal(video.currentTime, 87);
});

test('unchanged polling data leaves dropdown option DOM and focus intact', () => {
  let replacements = 0, selections = 0;
  const menu = { id: 'quality-dropdown-menu', dataset: {}, setAttribute() {}, set innerHTML(value) { replacements++; } };
  const trigger = { setAttribute() {}, getAttribute: () => 'Quality' };
  const wrap = { dataset: {}, querySelector: () => trigger };
  const label = {};
  const ctx = vm.createContext({
    $: selector => selector.endsWith('-menu') ? menu : selector.endsWith('-label') ? label : wrap,
    esc: String, icon: () => '', setCustomSelectValue: () => { selections++; },
  });
  vm.runInContext(section(app, 'function setCustomSelectOptions(', 'function setCustomSelectValue('), ctx);
  const options = [{ value: 'auto', label: 'Auto' }, { value: '720p', label: '720p HD' }];
  ctx.setCustomSelectOptions('quality-dropdown', options, 'auto');
  ctx.setCustomSelectOptions('quality-dropdown', options, '720p');
  assert.equal(replacements, 1);
  assert.equal(selections, 1);
});

test('both theme palettes and preset/custom accents meet 4.5:1 text contrast', () => {
  const ctx = vm.createContext({});
  vm.runInContext(section(app, 'function colorLuminance(', 'function applyAppearance('), ctx);
  const colors = vm.runInNewContext(section(app, 'const accentColors =', 'let currentSeries') + '; accentColors');
  const pairs = [
    ['#fafafa', '#141418'], ['#b4b4be', '#222228'], ['#a6a6b2', '#222228'],
    ['#121217', '#ececf2'], ['#4a4a56', '#e0e0ea'], ['#60606e', '#e0e0ea'],
    ['#ffffff', '#24232b'], ['#ffffff', '#3b3b46'], ['#ffffff', '#454551'],
    ['#ffffff', '#2c2c34'], ['#ceced7', '#101014'], ['#101014', '#ffffff'],
  ];
  for (const [fg, bg] of pairs) assert.ok(ctx.contrastRatio(fg, bg) >= 4.5, `${fg} on ${bg}`);
  for (const light of [false, true]) {
    for (const entry of [...Object.values(colors), ['#ffffff', '#ffffff'], ['#000000', '#000000'], ['#ffff00', '#ffff00']]) {
      const accent = ctx.readableAccent(entry[light ? 1 : 0], light);
      const bg = light ? '#e0e0ea' : '#222228';
      const tinted = ctx.mixColor(bg, accent, light ? .14 : .18);
      assert.ok(ctx.contrastRatio(accent, tinted) >= 4.5);
      assert.ok(ctx.contrastRatio(light ? '#ffffff' : '#09090b', accent) >= 4.5);
    }
  }
});

test('detail hover and open share one request and retain the synopsis for immediate rendering', async () => {
  let requests = 0;
  const bundle = { series: { title: 'Series', description: 'Synopsis' }, episodes: [{ id: '5678' }] };
  const ctx = vm.createContext({
    seriesBundles: new Map(), seriesRequests: new Map(),
    api: async () => { requests++; return bundle; },
  });
  vm.runInContext(section(app, 'function getSeriesBundle(', 'function normalize('), ctx);
  const prefetch = ctx.getSeriesBundle('1234');
  assert.equal(ctx.getSeriesBundle('1234'), prefetch);
  assert.equal(await ctx.getSeriesMetadata('1234'), bundle.series);
  assert.equal(ctx.seriesBundles.get('1234').value.series.description, 'Synopsis');
  assert.equal(requests, 1);
});

test('player scripts are deferred and a superseded stream never attaches after loading', async () => {
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  const ctx = vm.createContext({
    window: {}, playerNonce: 1, loadPlayerScript: src => {
      assert.equal(src, '/vendor/hls.min.js');
      return pending;
    },
    $: () => assert.fail('a stale stream must not touch the video element'),
  });
  vm.runInContext(section(app, 'async function attachStream(', 'async function playEpisode('), ctx);
  const attachment = ctx.attachStream('/media/test/index.m3u8', 1, 0);
  ctx.playerNonce = 2;
  release();
  await attachment;
  assert.doesNotMatch(html, /<script[^>]+(?:hls\.min|video-resampler)/);
});

test('compact pager keeps the next catalog page available until the feeds end', () => {
  const previous = { setAttribute() {} };
  const next = { setAttribute() {} };
  const pager = { querySelector: selector => selector.includes('prev') ? previous : next };
  const trigger = { setAttribute() {} };
  const label = {};
  const phrases = {
    catalogPageLabel: 'Page {page}',
    catalogPageOf: 'Page {page} of {total}',
  };
  let options;
  const ctx = vm.createContext({
    $: selector => selector === '#pagination-bottom' ? pager
      : selector.endsWith('-label') ? label : trigger,
    totalKnownPages: () => 136, shouldShowHomeShelves: () => false,
    catalogSources: [{}], streamBuffer: { length: 2030 }, currentPage: 136, getPageSize: () => 15,
    t: key => phrases[key] || key,
    setCustomSelectOptions: (_id, choices, selected) => {
      options = choices;
      label.textContent = choices.find(choice => choice.value === String(selected)).label;
    },
  });
  vm.runInContext(section(app, 'function renderPaginationControls(', 'async function goToPage('), ctx);
  ctx.renderPaginationControls();
  assert.equal(pager.hidden, false);
  assert.equal(previous.disabled, false);
  assert.equal(next.disabled, false);
  assert.equal(options.at(-1).value, '137');
  assert.equal(label.textContent, 'Page 136');
  ctx.catalogSources = [];
  ctx.renderPaginationControls();
  assert.equal(next.disabled, true);
  assert.equal(options.at(-1).value, '136');
  assert.equal(label.textContent, 'Page 136 of 136');
});

test('hero tint follows the poster color and keeps synopsis text readable', () => {
  const ctx = vm.createContext({});
  vm.runInContext(section(app, 'function colorLuminance(', 'function readableAccent('), ctx);
  vm.runInContext(section(app, 'function heroPosterPalette(', 'function applyHeroPosterPalette('), ctx);
  const warm = ctx.heroPosterPalette([245, 165, 48, 255, 245, 165, 48, 255, 0, 0, 255, 255]);
  const cool = ctx.heroPosterPalette([40, 106, 224, 255, 40, 106, 224, 255, 255, 255, 255, 255]);
  const channels = hex => hex.slice(1).match(/../g).map(part => parseInt(part, 16));
  const [warmRed, , warmBlue] = channels(warm.glow);
  const [coolRed, , coolBlue] = channels(cool.glow);
  assert.ok(warmRed > warmBlue);
  assert.ok(coolBlue > coolRed);
  assert.equal(warm.accent, '#f5a530');
  assert.equal(cool.accent, '#286ae0');
  const grayWithVioletEdge = Array.from({ length: 36 }, (_, i) =>
    i % 6 === 0 ? [140, 40, 200, 255] : [95, 95, 95, 255]).flat();
  assert.equal(ctx.heroPosterPalette(grayWithVioletEdge, 6).accent, '#8c28c8');
  for (const palette of [warm, cool]) {
    assert.ok(ctx.contrastRatio('#ceced7', palette.glow) >= 4.8);
    assert.ok(ctx.contrastRatio('#ceced7', palette.base) >= 4.8);
  }
  assert.equal(ctx.heroPosterPalette([0, 0, 0, 255, 255, 255, 255, 0]), null);
});

test('cross-origin catalog reads stay simple and JSON writes keep their content type', async () => {
  const calls = [];
  const ctx = vm.createContext({
    AbortSignal, t: key => key, endpoint: url => url,
    fetch: async (_url, opts) => {
      calls.push(opts);
      return { ok: true, json: async () => ({}) };
    },
  });
  vm.runInContext(section(app, 'async function api(', 'function imageUrl('), ctx);
  await ctx.api('/api/discover');
  await ctx.api('/api/playback', { method: 'POST', body: '{}' });
  assert.equal(calls[0].headers['Content-Type'], undefined);
  assert.equal(calls[1].headers['Content-Type'], 'application/json');
});

test('a partial series response is retried and a complete response is reused', async () => {
  let queries = 0;
  const cache = new Map();
  const partial = { series: { title: 'Series' }, episodes: null };
  const complete = { series: partial.series, episodes: [{ id: '1234' }] };
  const ctx = vm.createContext({
    sdk: fn => fn(), cache, inflight: new Map(),
    cacheValue: (key, entry) => cache.set(key, entry), scheduleCatalogSave() {},
  });
  vm.runInContext(section(server, 'async function memo(', 'async function playback('), ctx);
  const request = () => ctx.memo('series-bundle:1000', async () => ++queries === 1 ? partial : complete,
    300_000, false, value => Boolean(value.series) && Array.isArray(value.episodes));
  assert.equal(await request(), partial);
  assert.equal(await request(), complete);
  assert.equal(await request(), complete);
  assert.equal(queries, 2);
});

test('finishing the last episode alone does not hide a partially watched series', () => {
  let watched = ['1', '1', '3'];
  const ctx = vm.createContext({
    watchedEpisodesMap: () => ({ series: watched }),
    history: () => [{ id: 'series', episodeNumber: 3, time: 120, duration: 120 }],
  });
  vm.runInContext(section(app, 'function isSeriesFullyWatched(', 'function toggleEpisodeWatched('), ctx);
  assert.equal(ctx.isSeriesFullyWatched('series', 3), false);
  watched = ['1', '2', '3'];
  assert.equal(ctx.isSeriesFullyWatched('series', 3), true);
});

test('series counts use shared English and Chinese labels and omit unknown totals', () => {
  const phrases = {
    episodeCountOne: '{count} episode',
    episodeCountMany: '{count} episodes',
  };
  const ctx = vm.createContext({ t: key => phrases[key] });
  vm.runInContext(section(app, 'const episodeNumberFormat', 'function seriesCardCaption('), ctx);
  assert.equal(ctx.seriesEpisodeCount({ episode_count: 1 }), '1 episode');
  assert.equal(ctx.seriesEpisodeCount({ episode_count: 1200 }), '1,200 episodes');
  assert.equal(ctx.seriesEpisodeCount({ episode_count: 0, episodes: ['a', 'b'] }), '2 episodes');
  assert.equal(ctx.seriesEpisodeCount({ episode_count: -1 }), '');
  phrases.episodeCountMany = '共 {count} 集';
  assert.equal(ctx.seriesEpisodeCount({ episode_count: 152 }), '共 152 集');
});

test('expanded series genre line suppresses generic and repeated categories', () => {
  const ctx = vm.createContext({ lang: 'en' });
  vm.runInContext(section(app, 'function seriesGenreLine(', 'function renderSeriesDetailContent('), ctx);
  assert.equal(ctx.seriesGenreLine({}), '');
  assert.equal(ctx.seriesGenreLine({ category: 'Series', categories: ['Series'] }), '');
  assert.equal(ctx.seriesGenreLine({ category: 'Drama', categories: ['Drama', 'Fantasy'] }), 'Drama · Fantasy');
  ctx.lang = 'zh';
  assert.equal(ctx.seriesGenreLine({ category: '剧集', categories: ['爱情', '古装'] }), '爱情、古装');
});

test('upscaling status distinguishes the requested target from actual output', () => {
  const nodes = new Map();
  const dict = vm.runInNewContext(section(app, 'const dict =', 'function read(') + '; dict');
  const select = key => {
    if (!nodes.has(key)) nodes.set(key, { dataset: {} });
    return nodes.get(key);
  };
  const ctx = vm.createContext({ $: select, t: key => dict.en[key], neuralMode: 'ultra' });
  vm.runInContext(section(app, 'function updateUpscaleStatus(', 'function setNeuralMode('), ctx);
  ctx.updateUpscaleStatus({ state: 'active', width: 2160, height: 3840 });
  assert.equal(select('#player-upscale-status').textContent, '2160 × 3840 output');
  assert.match(select('#player-upscale-status').title, /4K target/);
  assert.doesNotMatch(html, /id="player-neural-btn"/);
  ctx.updateUpscaleStatus({ state: 'unavailable' });
  assert.match(select('#player-upscale-status').textContent, /using source size/);
});


test('Continue Watching resumes incomplete episodes and skips unavailable or completed episodes', () => {
  const ctx = vm.createContext({});
  vm.runInContext(section(app, 'function progressComplete(', 'function playbackActionLabel('), ctx);
  const list = [
    { id: '1', number: 1 },
    { id: '2', number: 2, playable: false },
    { id: '3', number: 3 },
  ];
  const progress = { episodeId: '1', episodeNumber: 1, time: 118, duration: 120 };
  const nearEnd = ctx.playbackTarget({ ...progress, completed: false }, list);
  assert.equal(nearEnd.id, '1');
  assert.equal(nearEnd.next, false);
  const legacy = ctx.playbackTarget({ ...progress, episode_count: 3 });
  assert.equal(legacy.next, true);
  assert.equal(legacy.id, undefined);
  const finished = ctx.playbackTarget({ ...progress, completed: true, nextEpisodeId: '3', nextEpisodeNumber: 3 });
  assert.equal(finished.id, '3');
  assert.equal(finished.number, 3);
  assert.equal(ctx.playbackTarget(progress, list).id, '3');
  assert.equal(ctx.playbackTarget({ ...progress, episodeId: '3', completed: true }, list), null);
});

test('Next Up cancels its countdown on dismissal and leaves autoplay-disabled playback manual', () => {
  const elements = new Map();
  const select = key => {
    if (!elements.has(key)) elements.set(key, { hidden: true, contains: () => false, focus() {} });
    return elements.get(key);
  };
  const timers = new Map();
  const played = [];
  let timerId = 0;
  const following = { id: '3', number: 3 };
  const ctx = vm.createContext({
    $: select,
    document: { hidden: false },
    nextUpEpisode: null,
    nextUpTimer: undefined,
    episodes: [],
    currentEpisode: { id: '1' },
    adjacentPlayableEpisode: () => following,
    episodeLabel: ep => 'Episode ' + ep.number,
    autoplayNext: true,
    setTimeout(fn, delay) { timers.set(++timerId, fn); assert.equal(delay, 6000); return timerId; },
    clearTimeout(id) { timers.delete(id); },
    playSelectedEpisode(ep) { played.push(ep.id); },
  });
  vm.runInContext(section(app, 'function stopNextUpCountdown(', 'function seekBy('), ctx);
  ctx.showNextUp();
  assert.equal(select('#next-up-heading').textContent, 'Episode 3');
  assert.equal(timers.size, 1);
  ctx.cancelNextUp();
  assert.equal(timers.size, 0);
  assert.equal(select('#next-up-panel').hidden, true);
  assert.deepEqual(played, []);

  ctx.autoplayNext = false;
  ctx.showNextUp();
  assert.equal(select('#next-up-panel').hidden, false);
  assert.equal(timers.size, 0);
  ctx.playNextUp();
  assert.deepEqual(played, ['3']);

  ctx.autoplayNext = true;
  ctx.showNextUp();
  timers.values().next().value();
  assert.deepEqual(played, ['3', '3']);
  assert.equal(select('#next-up-panel').hidden, true);
});


test('featured artwork promotes only sharp landscape images belonging to the active slide', () => {
  const images = [];
  class FakeImage extends EventTarget {
    constructor() { super(); images.push(this); }
  }
  const navigator = { connection: { saveData: false } };
  const ctx = vm.createContext({ Image: FakeImage, navigator, endpoint: value => value });
  vm.runInContext(section(app, 'function loadLandscapeHero(', 'function renderHeroSlideshow('), ctx);
  const mounted = [];
  const frame = { dataset: { heroId: '12345' }, querySelector: () => ({ append: img => mounted.push(img) }) };
  let current = true;
  const request = (width, height) => {
    ctx.loadLandscapeHero(frame, () => current);
    const image = images.at(-1);
    image.naturalWidth = width;
    image.naturalHeight = height;
    return image;
  };
  request(1080, 1920).dispatchEvent(new Event('load'));
  request(640, 360).dispatchEvent(new Event('load'));
  assert.equal(frame.dataset.artwork, undefined);
  assert.equal(mounted.length, 0);
  const old = request(1920, 1080);
  current = false;
  old.dispatchEvent(new Event('load'));
  assert.equal(mounted.length, 0);
  current = true;
  const wide = request(1920, 1080);
  assert.equal(wide.src, '/api/series/12345/artwork?orientation=landscape');
  wide.dispatchEvent(new Event('load'));
  assert.equal(frame.dataset.artwork, 'landscape');
  assert.deepEqual(mounted, [wide]);
  navigator.connection.saveData = true;
  ctx.loadLandscapeHero(frame, () => true);
  assert.equal(images.length, 4);
});

test('the optional landscape artwork route skips known portrait episodes', async () => {
  let episodes = [{ vertical: true, cover_url: 'https://cdn.example/portrait.jpg' }];
  const requested = [];
  const ctx = vm.createContext({
    loadSeriesBundle: async () => ({ episodes }),
    imageURL: value => new URL(value),
    resolveAndConvertImage: async url => { requested.push(url); return url; },
  });
  vm.runInContext(section(server, 'async function seriesArtwork(', 'async function proxyImage('), ctx);
  assert.equal(await ctx.seriesArtwork('12345', true), null);
  assert.deepEqual(requested, []);
  assert.equal(await ctx.seriesArtwork('12345'), 'https://cdn.example/portrait.jpg');
  const unknown = { cover_url: 'https://cdn.example/unknown.jpg' };
  episodes = [...episodes, unknown, { vertical: false, cover_url: 'https://cdn.example/wide.jpg' }];
  assert.equal(await ctx.seriesArtwork('12345', true), 'https://cdn.example/wide.jpg');
  episodes.pop();
  assert.equal(await ctx.seriesArtwork('12345', true), unknown.cover_url);
});


test('episode titles drop numbered placeholders and keep descriptive text', () => {
  const ctx = vm.createContext({});
  vm.runInContext(section(app, 'function distinctEpisodeText(', 'function renderEpisodePicker('), ctx);
  assert.equal(ctx.distinctEpisodeText('Episode 1', 1), '');
  assert.equal(ctx.distinctEpisodeText('E01 — Episode 1', 1), '');
  assert.equal(ctx.distinctEpisodeText('第１集', 1), '');
  assert.equal(ctx.distinctEpisodeText('第 1 集：归来', 1), '归来');
  assert.equal(ctx.distinctEpisodeText('A New Beginning', 1), 'A New Beginning');
  assert.equal(ctx.distinctEpisodeText('1984', 1), '1984');
});

test('device language follows the first supported locale and defaults to English', () => {
  const navigator = { languages: ['fr-CA', 'zh-Hant-TW', 'en-US'] };
  const ctx = vm.createContext({ navigator });
  vm.runInContext(section(app, 'function deviceLanguage(', 'let languagePreference'), ctx);
  assert.equal(ctx.deviceLanguage(), 'zh');
  navigator.languages = ['en-US', 'zh-Hans'];
  assert.equal(ctx.deviceLanguage(), 'en');
  navigator.languages = [];
  navigator.language = 'zh-CN';
  assert.equal(ctx.deviceLanguage(), 'zh');
  navigator.language = 'es-ES';
  assert.equal(ctx.deviceLanguage(), 'en');
});

test('refresh app saves playback progress and reloads the active page', () => {
  const calls = [];
  const ctx = vm.createContext({
    recordProgress: force => calls.push(['save', force]),
    window: { location: { reload: () => calls.push(['reload']) } },
  });
  vm.runInContext(section(app, 'function refreshApp(', "$$('[data-app-refresh]')"), ctx);
  ctx.refreshApp();
  assert.deepEqual(calls, [['save', true], ['reload']]);
});
