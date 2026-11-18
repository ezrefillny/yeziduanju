window.DUANJU_CONFIG = {
  apiOrigin: '',
  analyticsUrl: 'https://hakzxjubzetljrnokcbf.supabase.co/functions/v1/coconut-analytics',
  ...window.DUANJU_CONFIG,
};

(() => {
  try {
    const theme = JSON.parse(localStorage.getItem('duanju.theme'));
    if (theme === 'light' || (theme === 'system' && matchMedia('(prefers-color-scheme: light)').matches)) {
      document.documentElement.dataset.theme = 'light';
      document.querySelector('meta[name="theme-color"]').content = '#f4f5f3';
    }
  } catch {
    // Storage may be blocked or contain an older value. Keep the default theme.
  }
})();
