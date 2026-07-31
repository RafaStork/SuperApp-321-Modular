(function () {
  'use strict';
  var code = document.documentElement.getAttribute('data-app-code');
  if (!code) return;
  document.documentElement.classList.add('superapp-route-pending');
  function releaseAppGuard() {
    document.documentElement.classList.remove('superapp-route-pending');
  }
  window.SuperAppAuth = window.SuperAppAuth || {};
  window.SuperAppAuth.releaseAppGuard = releaseAppGuard;
  function deny(message) {
    document.documentElement.classList.remove('superapp-route-pending');
    var safe = String(message || 'Acesso negado.').replace(/[&<>"']/g, function (c) { return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]; });
    var home = window.SuperAppAuth && SuperAppAuth.getPortalUrl ? SuperAppAuth.getPortalUrl() : '../';
    document.body.innerHTML = '<main style="min-height:100vh;display:grid;place-items:center;background:#f4f6f2;color:#1f331b;font-family:system-ui;padding:24px;text-align:center"><p>' + safe + '<br><a href="' + home + '" style="color:#ed6b1d">Voltar ao SuperApp</a></p></main>';
  }
  window.addEventListener('load', async function () {
    try {
      if (!window.SuperAppAuth || !SuperAppAuth.isConfigured()) return deny('Homologação não configurada.');
      var session = await SuperAppAuth.getSession();
      if (!session) return deny('Sessão ausente. Retorne ao SuperApp para entrar.');
      var apps = await SuperAppAuth.getEntitlements();
      if (!apps.some(function (item) { return item.app_code === code; })) return deny('Acesso negado para este módulo.');

      window.dispatchEvent(new CustomEvent('superapp:authorized', { detail: { appCode: code, session: session } }));
      if (code === 'checklist') releaseAppGuard();
    } catch (error) { window.SuperAppAuth?.logAuthFailure?.(error, 'route-guard'); deny(window.SuperAppAuth?.getSafeAuthMessage?.(error, 'Não foi possível validar o acesso.') || 'Não foi possível validar o acesso.'); }
  }, { once: true });
}());
