(() => {
  'use strict';

  const APP_CODE = 'corte';
  const $ = id => document.getElementById(id);
  const tabTitles = {
    pieces: ['Peças', 'Cadastre peças e marque os cortes com precisão.'],
    plans: ['Plano de corte', 'Otimize o aproveitamento das barras por perfil.']
  };
  let initialized = false;

  function applyTheme(theme, persist = true) {
    const normalized = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = normalized;
    const toggle = $('themeBtn');
    const knob = toggle?.querySelector('.knob');
    if (knob) knob.textContent = normalized === 'dark' ? '🌙' : '☀️';
    if (toggle) {
      toggle.setAttribute('aria-pressed', normalized === 'dark' ? 'true' : 'false');
      toggle.setAttribute('aria-label', normalized === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', normalized === 'dark' ? '#15171b' : '#eef0f2');
    if (persist) {
      try { localStorage.setItem('321modular_theme', normalized); } catch (_) {}
    }
  }

  function closeMobileMenu() {
    $('side')?.classList.remove('open');
    $('asideBackdrop')?.classList.remove('active');
    document.body.classList.remove('menu-open');
    $('menuBtn')?.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileMenu() {
    const open = !$('side')?.classList.contains('open');
    $('side')?.classList.toggle('open', open);
    $('asideBackdrop')?.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
    $('menuBtn')?.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function setCurrentTab(tabName) {
    const [title, subtitle] = tabTitles[tabName] || tabTitles.pieces;
    $('pageTitle').textContent = title;
    const status = $('workspaceStatus');
    if (status && !status.dataset.workspaceText) status.dataset.workspaceText = status.textContent;
    document.title = `321 Modular | Plano de Corte — ${title}`;
    closeMobileMenu();
  }

  function setupInterface() {
    if (initialized) return;
    initialized = true;
    $('menuBtn')?.addEventListener('click', toggleMobileMenu);
    $('asideBackdrop')?.addEventListener('click', closeMobileMenu);
    $('themeBtn')?.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
    $('logoutBtn')?.addEventListener('click', () => { location.href = window.SuperAppAuth.getPortalUrl(); });
    document.querySelectorAll('.tab[data-tab]').forEach(tab => tab.addEventListener('click', () => setCurrentTab(tab.dataset.tab)));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMobileMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMobileMenu(); });
    applyTheme(document.documentElement.dataset.theme || 'light', false);
    setCurrentTab(document.querySelector('.tab.active')?.dataset.tab || 'pieces');
  }

  async function boot(event) {
    try {
      const session = event?.detail?.session || await window.SuperAppAuth.getSession();
      const profile = await window.SuperAppAuth.getProfile();
      $('sideUserName').textContent = profile?.display_name || session?.user?.email || 'Usuário';
      const role = profile?.role_name || profile?.role_code || 'Acesso operacional';
      const scope = profile?.franchise_name
        ? `Franquia · ${profile.franchise_name}`
        : profile?.unit_name
          ? `Matriz · ${profile.unit_name}`
          : 'Matriz · acesso global';
      $('sideUserRole').textContent = `${role} · ${scope}`;
      setupInterface();
    } catch (error) {
      console.error('Falha ao iniciar o Plano de Corte:', error);
      window.SuperAppAuth?.logAuthFailure?.(error, `${APP_CODE}-load`);
    } finally {
      window.SuperAppAuth?.releaseAppGuard?.();
    }
  }

  window.addEventListener('storage', event => {
    if (event.key === '321modular_theme') applyTheme(event.newValue || 'light', false);
  });
  window.addEventListener('superapp:authorized', boot, { once: true });
})();