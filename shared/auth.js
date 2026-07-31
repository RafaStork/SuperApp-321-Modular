(function () {
  'use strict';
  const config = window.SUPERAPP_CONFIG || {};
  const clients = new Map();
  const rememberPreferenceKey = '321-superapp-remember-login';
  const authStorageKeys = new Set();
  function storageAvailable(storage) {
    try {
      const key = '__321_storage_test__';
      storage.setItem(key, '1');
      storage.removeItem(key);
      return true;
    } catch (_) {
      return false;
    }
  }
  const hasLocalStorage = storageAvailable(window.localStorage);
  const hasSessionStorage = storageAvailable(window.sessionStorage);
  function isRememberLoginEnabled() {
    if (!hasLocalStorage) return false;
    return window.localStorage.getItem(rememberPreferenceKey) === 'true';
  }
  function preferredStorage() {
    if (isRememberLoginEnabled() && hasLocalStorage) return window.localStorage;
    if (hasSessionStorage) return window.sessionStorage;
    return window.localStorage;
  }
  function secondaryStorage() {
    return preferredStorage() === window.localStorage ? window.sessionStorage : window.localStorage;
  }
  const adaptiveAuthStorage = {
    getItem(key) {
      authStorageKeys.add(key);
      try {
        const preferred = preferredStorage()?.getItem(key);
        if (preferred !== null && preferred !== undefined) return preferred;
        return secondaryStorage()?.getItem(key) ?? null;
      } catch (_) {
        return null;
      }
    },
    setItem(key, value) {
      authStorageKeys.add(key);
      const target = preferredStorage();
      const secondary = secondaryStorage();
      target?.setItem(key, value);
      try { secondary?.removeItem(key); } catch (_) {}
    },
    removeItem(key) {
      authStorageKeys.add(key);
      try { window.localStorage?.removeItem(key); } catch (_) {}
      try { window.sessionStorage?.removeItem(key); } catch (_) {}
    }
  };
  function setRememberLogin(remember) {
    if (!hasLocalStorage && remember) throw new Error('Este navegador não permite salvar a sessão.');
    const target = remember ? window.localStorage : window.sessionStorage;
    const source = remember ? window.sessionStorage : window.localStorage;
    if (hasLocalStorage) window.localStorage.setItem(rememberPreferenceKey, remember ? 'true' : 'false');
    for (const key of authStorageKeys) {
      const value = source?.getItem(key);
      if (value !== null && value !== undefined) target?.setItem(key, value);
      source?.removeItem(key);
    }
  }
  function isConfigured() { return Boolean(config.supabaseUrl && config.supabasePublishableKey && window.supabase?.createClient); }  function authErrorCode(error) { return String(error?.code || error?.error_code || error?.name || '').toLowerCase(); }
  function getSafeAuthMessage(error, fallback) {
    const code = authErrorCode(error);
    const status = Number(error?.status || error?.statusCode || 0);
    if (status === 429 || ['over_request_rate_limit', 'too_many_requests', 'rate_limit_exceeded'].includes(code)) return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
    if (['invalid_credentials', 'invalid_login_credentials', 'invalid_grant'].includes(code)) return 'E-mail ou senha inválidos.';
    if (code === 'email_not_confirmed') return 'Não foi possível concluir o acesso. Verifique o cadastro com o administrador.';
    if (code === 'user_banned') return 'Este acesso está indisponível. Procure o administrador.';
    if (['fetch_error', 'network_error', 'network'].includes(code) || status >= 500) return 'Não foi possível conectar ao serviço. Tente novamente.';
    if (['session_not_found', 'session_expired'].includes(code)) return 'Sua sessão expirou. Retorne ao SuperApp e entre novamente.';
    return fallback || 'Não foi possível concluir a autenticação.';
  }
  function logAuthFailure(error, context) {
    try { console.warn('[SuperAppAuth]', context || 'auth', { code: authErrorCode(error) || 'unknown', status: Number(error?.status || error?.statusCode || 0) || undefined }); } catch (_) {}
  }
  function getScopedClient(schema) {
    if (!isConfigured()) return null;
    const selectedSchema = schema || config.authSchema || 'core';
    if (!clients.has(selectedSchema)) clients.set(selectedSchema, window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storage: adaptiveAuthStorage, storageKey: config.sessionStorageKey },
      db: { schema: selectedSchema }
    }));
    return clients.get(selectedSchema);
  }
  function getClient() { return getScopedClient(config.authSchema || 'core'); }
  async function rpc(name, params) {
    const supabase = getClient();
    if (!supabase) throw new Error('Homologação ainda não configurada.');
    const { data, error } = await supabase.rpc(name, params);
    if (error) throw error;
    return data;
  }
  async function signIn(identifier, password) {
    const supabase = getClient();
    if (!supabase) throw new Error('Homologação ainda não configurada.');
    const { data, error } = await supabase.auth.signInWithPassword({ email: identifier, password });
    if (error) throw error;
    return data;
  }
  async function getSession() {
    const supabase = getClient();
    if (!supabase) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }
  async function getProfile() { const data = await rpc('get_my_profile'); return Array.isArray(data) ? (data[0] || null) : (data || null); }
  async function getEntitlements() { const data = await rpc('get_my_app_entitlements'); return Array.isArray(data) ? data : []; }
  async function adminListUsers() { const data = await rpc('admin_list_users'); return Array.isArray(data) ? data : []; }
  async function adminListRoles() { const data = await rpc('admin_list_roles'); return Array.isArray(data) ? data : []; }
  async function adminListFranchises() { const data = await rpc('admin_list_franchises'); return Array.isArray(data) ? data : []; }
  async function adminListUnits() { const data = await rpc('admin_list_units'); return Array.isArray(data) ? data : []; }
  async function adminListAppRolePermissions() { const data = await rpc('admin_list_app_role_permissions'); return Array.isArray(data) ? data : []; }
  async function adminSetAppRolePermission(appCode, roleCode, canView) {
    return rpc('admin_set_app_role_permission', { p_app_code: appCode, p_role_code: roleCode, p_can_view: Boolean(canView) });
  }
  async function adminAssignAccess(userId, roleCode, scopeKind, unitId, franchiseId) {
    return rpc('admin_assign_access', { p_user_id: userId, p_role_code: roleCode, p_scope_kind: scopeKind, p_unit_id: unitId || null, p_franchise_id: franchiseId || null });
  }
  async function adminAssignRole(userId, roleCode, unitId, franchiseId) {
    return rpc('admin_assign_role', { p_user_id: userId, p_role_code: roleCode, p_unit_id: unitId || null, p_franchise_id: franchiseId || null });
  }
  async function adminDeactivateUser(userId) { return rpc('admin_deactivate_user', { p_user_id: userId }); }
  async function signOut() { const supabase = getClient(); if (supabase) await supabase.auth.signOut(); }
  function getPortalUrl() { return new URL(config.portalBasePath || '../', document.baseURI).href; }
  window.SuperAppAuth = { isConfigured, getClient, getScopedClient, signIn, getSession, getProfile, getEntitlements, adminListUsers, adminListRoles, adminListFranchises, adminListUnits, adminListAppRolePermissions, adminSetAppRolePermission, adminAssignAccess, adminAssignRole, adminDeactivateUser, signOut, getPortalUrl, isRememberLoginEnabled, setRememberLogin, getSafeAuthMessage, logAuthFailure };
}());
