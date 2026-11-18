(() => {
  const url = window.DUANJU_CONFIG?.analyticsUrl;
  if (!url || navigator.globalPrivacyControl || navigator.doNotTrack === '1' || !crypto.randomUUID) return;

  const key = 'duanju.analyticsSession';
  let session = crypto.randomUUID();
  try {
    const stored = sessionStorage.getItem(key);
    if (stored && /^[0-9a-f-]{36}$/i.test(stored)) session = stored;
    else sessionStorage.setItem(key, session);
  } catch {}

  const pending = [];
  let timer;
  let inFlight = false;

  async function flush() {
    clearTimeout(timer);
    timer = undefined;
    if (!pending.length || inFlight) return;
    inFlight = true;
    const events = pending.splice(0, 20);
    try {
      const response = await fetch(url, {
        method: 'POST', body: JSON.stringify({ session, events }),
        keepalive: true, credentials: 'omit',
      });
      if (!response.ok && response.status >= 500) throw new Error('Analytics unavailable');
    } catch {
      // Retry once in a later batch. Event IDs make duplicate deliveries harmless.
      for (const event of events) {
        if (!event.retried && pending.length < 40) pending.push({ ...event, retried: true });
      }
    } finally {
      inFlight = false;
      if (pending.length && !timer) timer = setTimeout(flush, 3000);
    }
  }

  window.coconutAnalytics = {
    track(type, fields, immediate = false) {
      if (pending.length >= 40) pending.shift();
      pending.push({ ...fields, id: crypto.randomUUID(), type });
      if (immediate || pending.length >= 12) flush();
      else if (!timer) timer = setTimeout(flush, 650);
    },
    flushOnExit() {
      if (!pending.length || !navigator.sendBeacon) return;
      const events = pending.slice(0, 20);
      if (navigator.sendBeacon(url, JSON.stringify({ session, events }))) pending.splice(0, events.length);
    },
  };
})();
