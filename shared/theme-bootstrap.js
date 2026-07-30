
    (() => {
      try {
        const saved = localStorage.getItem('321modular_theme') || localStorage.getItem('321-superapp-theme');
        document.documentElement.dataset.theme = saved === 'dark' ? 'dark' : 'light';
      } catch (_) { document.documentElement.dataset.theme = 'light'; }
    })();
  