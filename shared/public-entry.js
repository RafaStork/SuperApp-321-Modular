(() => {
  const root = document.documentElement;
  root.classList.remove('superapp-route-pending');
  root.classList.add('superapp-route-ready');
})();