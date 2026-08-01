#!/usr/bin/env node
/**
 * Smoke test público, sem login e sem escrita no banco.
 *
 * Uso:
 *   node security/smoke-public.mjs
 *   $env:SUPERAPP_BASE_URL = "https://superapp.321modular.com.br/"
 *   node security/smoke-public.mjs
 *
 * O teste aceita o servidor local simples (rotas /app/index.html) e o
 * GitHub Pages/Cloudflare (rotas /app/). Nenhuma credencial é lida.
 */
const base = new URL(process.env.SUPERAPP_BASE_URL || 'http://127.0.0.1:4173/');
const routes = [
  '/',
  '/gestao/index.html',
  '/planta/index.html',
  '/financeiro/index.html',
  '/playbook/index.html',
  '/simulacao/index.html',
  'https://checklist.321modular.com.br/',
  '/shared/runtime-config.js',
];
const failures = [];
const results = [];

for (const route of routes) {
  const url = new URL(route, base);
  try {
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(8_000) });
    const body = await response.text();
    const ok = response.status >= 200 && response.status < 400;
    const configured = route.endsWith('index.html') ? !body.includes('Homologação não configurada.') : true;
    results.push({ route, status: response.status, bytes: body.length, configured });
    if (!ok) failures.push(route + ': HTTP ' + response.status);
    if (!configured) failures.push(route + ': runtime de homologação não configurado');
  } catch (error) {
    failures.push(route + ': ' + error.message);
    results.push({ route, status: 'network-error', bytes: 0 });
  }
}

const summary = {
  base: base.origin,
  passed: failures.length === 0,
  checked: results.length,
  failures,
  results,
};
console.log(JSON.stringify(summary, null, 2));
process.exitCode = failures.length ? 1 : 0;