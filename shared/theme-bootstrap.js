(() => {
  const root = document.documentElement;
  if (!root.hasAttribute('data-app-code')) root.classList.add('superapp-session-pending');
  try {
    const saved = localStorage.getItem('321modular_theme')
      || localStorage.getItem('321-superapp-theme')
      || localStorage.getItem('321pb_theme')
      || localStorage.getItem('321fin_theme')
      || localStorage.getItem('321chk_theme');
    root.dataset.theme = saved === 'dark' ? 'dark' : 'light';
  } catch (_) {
    root.dataset.theme = 'light';
  }
})();