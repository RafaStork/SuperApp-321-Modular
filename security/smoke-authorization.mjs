#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const baseValue = process.env.SUPERAPP_HOMOLOG_URL || '';
const publishableKey = process.env.SUPERAPP_HOMOLOG_PUBLISHABLE_KEY || '';
const usersValue = process.env.SUPERAPP_HOMOLOG_TEST_USERS_JSON || '';
const failures = [];
const results = [];
const sessions = new Map();
process.on('uncaughtException', (error) => {
  console.error(JSON.stringify({ passed: false, error: String(error?.message || 'Falha de configuração.').replace(/[\r\n]/g, ' ').slice(0, 240) }));
  process.exit(1);
});
process.on('unhandledRejection', (error) => {
  console.error(JSON.stringify({ passed: false, error: String(error?.message || 'Falha assíncrona.').replace(/[\r\n]/g, ' ').slice(0, 240) }));
  process.exit(1);
});
const safe = (value) => String(value || '').replace(/[^A-Za-z0-9_. -]/g, '').slice(0, 100);
const fail = (message) => failures.push(message);
function required(value, name) { if (!value) throw new Error(`${name} não configurado.`); return value; }

const base = new URL(required(baseValue, 'SUPERAPP_HOMOLOG_URL'));
if (base.protocol !== 'https:') throw new Error('A homologação deve usar HTTPS.');
required(publishableKey, 'SUPERAPP_HOMOLOG_PUBLISHABLE_KEY');
const runtime = readFileSync(resolve(root, 'shared/runtime-config.js'), 'utf8');
const productionUrl = runtime.match(/"supabaseUrl"\s*:\s*"([^"]+)"/)?.[1];
if (productionUrl && new URL(productionUrl).host === base.host) {
  throw new Error('Execução recusada: a URL de teste coincide com a base oficial publicada.');
}

let config;
try { config = JSON.parse(required(usersValue, 'SUPERAPP_HOMOLOG_TEST_USERS_JSON')); }
catch { throw new Error('SUPERAPP_HOMOLOG_TEST_USERS_JSON não contém JSON válido.'); }
const users = Array.isArray(config) ? config : config.users;
const probes = Array.isArray(config?.isolationProbes) ? config.isolationProbes : [];
if (!Array.isArray(users) || users.length < 2) throw new Error('Configure pelo menos dois usuários de homologação.');
const labels = new Set();
for (const user of users) {
  required(user.label, 'label do usuário de teste');
  required(user.email, `e-mail de ${safe(user.label)}`);
  required(user.password, `senha de ${safe(user.label)}`);
  required(user.expectedRole, `expectedRole de ${safe(user.label)}`);
  if (labels.has(user.label)) throw new Error(`Label duplicado: ${safe(user.label)}`);
  labels.add(user.label);
}

async function request(path, { method = 'GET', token, body, schema } = {}) {
  const headers = { apikey: publishableKey };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (schema) { headers['Accept-Profile'] = schema; headers['Content-Profile'] = schema; }
  return fetch(new URL(path, base), {
    method, headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(12_000),
  });
}
async function rpc(name, token) {
  const response = await request(`/rest/v1/rpc/${name}`, { method: 'POST', token, body: {}, schema: 'core' });
  if (!response.ok) throw new Error(`${name} retornou HTTP ${response.status}`);
  return response.json();
}
const one = (value) => Array.isArray(value) ? value[0] : value;
const asList = (value) => Array.isArray(value) ? value : (value === null || value === undefined ? [] : [value]);

async function validateNoSession() {
  const missing = await request('/rest/v1/rpc/get_my_profile', { method: 'POST', body: {}, schema: 'core' });
  const invalid = await request('/rest/v1/rpc/get_my_profile', { method: 'POST', token: 'invalid-test-token', body: {}, schema: 'core' });
  if (missing.ok) fail('RPC de perfil aceitou requisição sem sessão.');
  if (invalid.ok) fail('RPC de perfil aceitou bearer inválido.');
  results.push({ test: 'sessão ausente/inválida', passed: !missing.ok && !invalid.ok });
}

async function loginAndValidate(user) {
  const label = safe(user.label);
  const login = await request('/auth/v1/token?grant_type=password', { method: 'POST', body: { email: user.email, password: user.password } });
  if (!login.ok) throw new Error(`${label}: login retornou HTTP ${login.status}`);
  const session = await login.json();
  if (!session.access_token || !session.refresh_token) throw new Error(`${label}: sessão incompleta.`);
  sessions.set(user.label, { ...session, user });
  const profile = one(await rpc('get_my_profile', session.access_token));
  const entitlements = await rpc('get_my_app_entitlements', session.access_token);
  const role = profile?.role_code;
  const apps = new Set((Array.isArray(entitlements) ? entitlements : []).map((item) => item.app_code));
  if (role !== user.expectedRole) fail(`${label}: papel divergente; esperado ${safe(user.expectedRole)}, recebido ${safe(role)}.`);
  for (const app of asList(user.expectedApps)) if (!apps.has(app)) fail(`${label}: entitlement obrigatório ausente (${safe(app)}).`);
  for (const app of asList(user.deniedApps)) if (apps.has(app)) fail(`${label}: entitlement proibido presente (${safe(app)}).`);
  const admin = await request('/rest/v1/rpc/admin_list_users', { method: 'POST', token: session.access_token, body: {}, schema: 'core' });
  const shouldAdmin = user.expectedAdmin === true || user.expectedRole === 'ADM';
  if (shouldAdmin && !admin.ok) fail(`${label}: RPC administrativo negado para ADM (HTTP ${admin.status}).`);
  if (!shouldAdmin && admin.ok) fail(`${label}: RPC administrativo permitido para usuário não ADM.`);
  results.push({ test: label, role: safe(role), entitlementCount: apps.size, adminBoundary: shouldAdmin ? admin.ok : !admin.ok });
}

const validIdentifier = (value) => typeof value === 'string' && /^[A-Za-z_][A-Za-z0-9_]*$/.test(value);
async function validateIsolation() {
  for (const probe of probes) {
    const label = safe(probe.label || probe.table);
    const idField = probe.idField || 'id';
    if (![probe.schema, probe.table, idField].every(validIdentifier)) { fail(`${label}: identificador inválido.`); continue; }
    const participants = probe.participants || [];
    if (participants.length < 2 || participants.some((item) => !sessions.has(item))) {
      fail(`${label}: configure dois participantes autenticados.`); continue;
    }
    const observed = [];
    for (const participant of participants) {
      const query = new URLSearchParams({ select: idField, limit: String(probe.limit || 1000) });
      const response = await request(`/rest/v1/${probe.table}?${query}`, { token: sessions.get(participant).access_token, schema: probe.schema });
      if (!response.ok) { fail(`${label}: leitura negada para ${safe(participant)} (HTTP ${response.status}).`); observed.push(new Set()); continue; }
      const ids = new Set((await response.json()).map((row) => String(row[idField])).filter(Boolean));
      if (probe.requireRows !== false && ids.size === 0) fail(`${label}: ${safe(participant)} não possui massa para provar isolamento.`);
      observed.push(ids);
    }
    for (let a = 0; a < observed.length; a += 1) for (let b = a + 1; b < observed.length; b += 1) {
      if ([...observed[a]].some((id) => observed[b].has(id))) fail(`${label}: escopos distintos receberam o mesmo registro.`);
    }
    results.push({ test: `isolamento: ${label}`, participants: participants.map(safe) });
  }
}

async function logout(label, session) {
  const response = await request('/auth/v1/logout?scope=global', { method: 'POST', token: session.access_token });
  if (!response.ok) { fail(`${safe(label)}: logout retornou HTTP ${response.status}.`); return; }
  const refresh = await request('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: session.refresh_token } });
  if (refresh.ok) fail(`${safe(label)}: refresh token reutilizável após logout global.`);
}

try {
  await validateNoSession();
  for (const user of users) {
    try { await loginAndValidate(user); } catch (error) { fail(error.message); }
  }
  await validateIsolation();
} finally {
  for (const [label, session] of sessions) {
    try { await logout(label, session); }
    catch (error) { fail(`${safe(label)}: falha de rede durante logout (${safe(error.name)}).`); }
  }
}
console.log(JSON.stringify({
  environment: 'homologacao', host: base.host, passed: failures.length === 0,
  failures, results,
  note: 'Credenciais, e-mails, JWTs e refresh tokens nunca são impressos.',
}, null, 2));
process.exitCode = failures.length ? 1 : 0;
