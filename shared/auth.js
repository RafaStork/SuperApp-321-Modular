(function () {
  'use strict';
  const config = window.SUPERAPP_CONFIG || {};
  const clients = new Map();
  function isConfigured() { return Boolean(config.supabaseUrl && config.supabasePublishableKey && window.supabase?.createClient); }
  function getScopedClient(schema) {
    if (!isConfigured()) return null;
    const selectedSchema = schema || config.authSchema || 'core';
    if (!clients.has(selectedSchema)) clients.set(selectedSchema, window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storage: window.sessionStorage, storageKey: config.sessionStorageKey },
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
  async function adminAssignAccess(userId, roleCode, scopeKind, unitId, franchiseId) {
    return rpc('admin_assign_access', { p_user_id: userId, p_role_code: roleCode, p_scope_kind: scopeKind, p_unit_id: unitId || null, p_franchise_id: franchiseId || null });
  }
  async function adminAssignRole(userId, roleCode, unitId, franchiseId) {
    return rpc('admin_assign_role', { p_user_id: userId, p_role_code: roleCode, p_unit_id: unitId || null, p_franchise_id: franchiseId || null });
  }
  async function adminDeactivateUser(userId) { return rpc('admin_deactivate_user', { p_user_id: userId }); }
  async function signOut() { const supabase = getClient(); if (supabase) await supabase.auth.signOut(); }
  function getPortalUrl() { return new URL(config.portalBasePath || '../', document.baseURI).href; }
  window.SuperAppAuth = { isConfigured, getClient, getScopedClient, signIn, getSession, getProfile, getEntitlements, adminListUsers, adminListRoles, adminListFranchises, adminListUnits, adminAssignAccess, adminAssignRole, adminDeactivateUser, signOut, getPortalUrl };
}());
