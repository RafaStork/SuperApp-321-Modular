#!/usr/bin/env node

const base = new URL(process.env.SUPERAPP_BASE_URL || 'https://superapp.321modular.com.br/');
const routes = ['/', '/gestao/', '/planta/', '/financeiro/', '/playbook/', '/corte/'];
const failures = [];
const results = [];

for (const route of routes) {
  const url = new URL(route, base);
  url.searchParams.set('_security_check', Date.now().toString());
  try {
    const response = await fetch(url, { redirect: 'follow', cache: 'no-store', signal: AbortSignal.timeout(8_000) });
    const headers = response.headers;
    const checks = {
      csp: Boolean(headers.get('content-security-policy')),
      frame: headers.get('x-frame-options')?.toUpperCase() === 'DENY',
      nosniff: headers.get('x-content-type-options')?.toLowerCase() === 'nosniff',
      referrer: headers.get('referrer-policy')?.toLowerCase() === 'no-referrer',
      permissions: Boolean(headers.get('permissions-policy')),
      hsts: /max-age=\d+/i.test(headers.get('strict-transport-security') || ''),
    };
    const csp = headers.get('content-security-policy') || '';
    if (checks.csp) {
      checks.cspBaseRestricted = /(?:^|;)\s*base-uri\s+(?:'none'|'self')/i.test(csp);
      checks.cspFrames = /(?:^|;)\s*frame-ancestors\s+'none'/i.test(csp);
      checks.cspObjects = /(?:^|;)\s*object-src\s+'none'/i.test(csp);
    }
    const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
    if (!response.ok) failed.push(`http-${response.status}`);
    if (failed.length) failures.push({ route, failed });
    results.push({ route, status: response.status, checks });
  } catch (error) {
    failures.push({ route, failed: ['network'], message: error.message });
  }
}

console.log(JSON.stringify({ base: base.origin, passed: failures.length === 0, failures, results }, null, 2));
process.exitCode = failures.length ? 1 : 0;
