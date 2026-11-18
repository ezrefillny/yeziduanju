const byId = id => document.getElementById(id);
const status = byId('status');
const input = byId('access-key');
const dashboard = byId('dashboard');
const rangeButtons = [...document.querySelectorAll('[data-days]')];
let range = 30;
const formatNumber = new Intl.NumberFormat('en-US');
const formatDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const label = { home: 'Home', discover: 'Browse', live: 'Live Action', series: 'Series', rank: 'Top Charts',
  new: 'New Releases', search: 'Search', favorite: 'Watchlist', folders: 'Folders', history: 'History',
  settings: 'Settings', detail: 'Series details', player: 'Player' };
const adNames = { advertise: 'Your ad could be here', local: 'Reach short drama fans', sponsor: 'Sponsor this space' };
let key = '';
let pending;

function message(text) {
  status.textContent = text;
  status.hidden = !text;
}

function table(id, rows, columns) {
  const body = byId(id);
  const content = rows.map(values => {
    const row = document.createElement('tr');
    for (const value of values) {
      const cell = row.insertCell();
      cell.textContent = value;
    }
    return row;
  });
  if (!content.length) {
    const row = document.createElement('tr');
    const cell = row.insertCell();
    cell.colSpan = columns;
    cell.className = 'empty-cell';
    cell.textContent = 'No activity in this period.';
    content.push(row);
  }
  body.replaceChildren(...content);
}

function render(data) {
  const metrics = [
    ['Page visits', formatNumber.format(data.totals.pageviews)],
    ['Sessions', formatNumber.format(data.totals.sessions)],
    ['Series views', formatNumber.format(data.totals.series_views)],
    ['Playback starts', formatNumber.format(data.totals.plays)],
    ['Episodes completed', formatNumber.format(data.totals.completions)],
    ['Watch time', formatNumber.format(Math.round(data.totals.seconds / 60)) + ' min'],
    ['Ad impressions', formatNumber.format(data.totals.impressions)],
    ['Ad phone taps', formatNumber.format(data.totals.clicks)],
  ];
  byId('totals').replaceChildren(...metrics.map(([name, value]) => {
    const item = document.createElement('div');
    const title = document.createElement('dt');
    const count = document.createElement('dd');
    title.textContent = name;
    count.textContent = value;
    item.append(title, count);
    return item;
  }));
  const scale = Math.max(1, ...data.daily.flatMap(day => [day.pageviews, day.plays]));
  byId('chart').replaceChildren(...data.daily.map(day => {
    const bar = document.createElement('div');
    bar.className = 'bars';
    const date = formatDate.format(new Date(day.day + 'T00:00:00Z'));
    bar.title = date + ' · Visits ' + day.pageviews + ' · Plays ' + day.plays;
    for (const [name, value] of [['visits', day.pageviews], ['plays', day.plays]]) {
      const span = document.createElement('span');
      span.className = name;
      span.style.height = 100 * value / scale + '%';
      bar.append(span);
    }
    return bar;
  }));
  table('daily', data.daily.map(row => [formatDate.format(new Date(row.day + 'T00:00:00Z')), formatNumber.format(row.pageviews), formatNumber.format(row.plays)]), 3);
  table('pages', data.pages.map(row => [label[row.page] || row.page, formatNumber.format(row.visits)]), 2);
  table('series', data.series.map(row => [row.title || row.series_id, formatNumber.format(row.views), formatNumber.format(row.plays), formatNumber.format(row.completions)]), 4);
  table('ads', data.ads.map(row => [adNames[row.ad_id] || row.ad_id, formatNumber.format(row.impressions), formatNumber.format(row.clicks),
    row.impressions ? new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 }).format(row.clicks / row.impressions) : '—']), 4);
  byId('updated').textContent = 'Updated ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

async function loadReport(accessKey) {
  const base = window.DUANJU_CONFIG?.analyticsUrl;
  if (!base) return message('Analytics is unavailable.');
  pending?.abort();
  const request = new AbortController();
  pending = request;
  message('Loading stats…');
  try {
    const response = await fetch(base + '/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Coconut-Stats-Key': accessKey },
      body: JSON.stringify({ days: range }),
      cache: 'no-store',
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(10_000)]),
    });
    if (response.status === 401) {
      lockDashboard();
      message('The access key is incorrect.');
      return;
    }
    if (!response.ok) throw new Error('Report unavailable');
    const report = await response.json();
    if (request.signal.aborted) return;
    key = accessKey;
    input.value = '';
    render(report);
    byId('unlock').hidden = true;
    byId('lock').hidden = false;
    dashboard.hidden = false;
    message('');
  } catch {
    if (!request.signal.aborted) message('Stats are temporarily unavailable. Try again.');
  }
}

byId('access-form').addEventListener('submit', event => {
  event.preventDefault();
  loadReport(input.value.trim());
});
byId('refresh').addEventListener('click', () => { if (key) loadReport(key); });
for (const button of rangeButtons) {
  button.onclick = () => {
    range = Number(button.dataset.days);
    for (const choice of rangeButtons) choice.setAttribute('aria-pressed', String(choice === button));
    if (key) loadReport(key);
  };
}
function lockDashboard() {
  pending?.abort();
  key = '';
  dashboard.hidden = true;
  for (const id of ['totals','chart','daily','pages','series','ads']) byId(id).replaceChildren();
  byId('lock').hidden = true;
  byId('unlock').hidden = false;
  message('');
  input.focus();
}
byId('lock').addEventListener('click', lockDashboard);
