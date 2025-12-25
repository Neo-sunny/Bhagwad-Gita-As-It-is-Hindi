(() => {
  const body = document.body;
  const root = document.documentElement;
  const controls = document.querySelector('.reading-controls');

  if (!body || !controls) return;

  const STORAGE_KEY = 'reader-prefs';
  const DEFAULTS = { fontSize: 18, lineWidth: 'normal', theme: 'light' };
  const MIN_FONT = 14;
  const MAX_FONT = 26;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const loadPrefs = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : { ...DEFAULTS };
    } catch (_) {
      return { ...DEFAULTS };
    }
  };

  const savePrefs = (prefs) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (_) {
      /* ignore persistence errors */
    }
  };

  const applyPrefs = (prefs) => {
    root.style.setProperty('--reader-font-size', `${prefs.fontSize}px`);
    body.classList.toggle('lines-narrow', prefs.lineWidth === 'narrow');
    body.classList.toggle('lines-wide', prefs.lineWidth === 'wide');
    body.dataset.theme = prefs.theme;
  };

  const prefs = loadPrefs();
  applyPrefs(prefs);

  const adjustFont = (delta) => {
    prefs.fontSize = clamp(prefs.fontSize + delta, MIN_FONT, MAX_FONT);
    applyPrefs(prefs);
    savePrefs(prefs);
  };

  const setLineWidth = (mode) => {
    prefs.lineWidth = mode;
    applyPrefs(prefs);
    savePrefs(prefs);
  };

  const toggleTheme = () => {
    prefs.theme = prefs.theme === 'dark' ? 'light' : 'dark';
    applyPrefs(prefs);
    savePrefs(prefs);
  };

  controls.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;

    switch (btn.dataset.action) {
      case 'font-plus':
        adjustFont(1);
        break;
      case 'font-minus':
        adjustFont(-1);
        break;
      case 'line-narrow':
        setLineWidth('narrow');
        break;
      case 'line-wide':
        setLineWidth('wide');
        break;
      case 'theme-toggle':
        toggleTheme();
        break;
      default:
        break;
    }
  });
})();

