#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const notes = [];
const clean = (value) => value.replaceAll('\\', '/');

function walk(dir, output = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const full = join(dir, entry.name);
    entry.isDirectory() ? walk(full, output) : output.push(full);
  }
  return output;
}

function filesToCheck() {
  try {
    return execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8', windowsHide: true })
      .split('\0').filter(Boolean).map((file) => join(root, file));
  } catch {
    notes.push('Sem metadados Git locais; analisando todos os arquivos da pasta.');
    return walk(root);
  }
}

const files = filesToCheck();
const forbidden = [
  ['arquivo de ambiente', (p) => /(^|\/)\.env(?:\.|$)/i.test(p) && !p.endsWith('.env.example')],
  ['configuração local', (p) => /(^|\/)runtime-config\.local\.js$/i.test(p)],
  ['chave/certificado privado', (p) => /\.(?:pem|key|p12|pfx|secret)$/i.test(p)],
  ['dump/backup de banco', (p) => /\.(?:dump|backup|sql\.gz)$/i.test(p)],
  ['log/temporário', (p) => /\.(?:log|tmp|temp)$/i.test(p)],
  ['artefato gerado', (p) => /(^|\/)(?:node_modules|dist|build|coverage)(\/|$)/i.test(p)],
];

for (const file of files) {
  const path = clean(relative(root, file));
  for (const [label, test] of forbidden) if (test(path)) failures.push(`${path}: ${label} não pode ser versionado`);
}

let gitignore = '';
try { gitignore = readFileSync(join(root, '.gitignore'), 'utf8'); } catch { failures.push('.gitignore ausente'); }
for (const item of ['**/runtime-config.local.js', '.env', '*.pem', '*.key', 'secrets/', 'credentials/', 'node_modules/', '**/dist/', '*.dump', '*.backup', '*.log']) {
  if (!gitignore.includes(item)) failures.push(`.gitignore não cobre: ${item}`);
}

for (const file of files.filter((item) => item.toLowerCase().endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  const location = clean(relative(root, file));
  for (const tag of html.match(/<script\b[^>]*\bsrc\s*=\s*["'][^"']+["'][^>]*>/gi) || []) {
    const source = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1] || '';
    if (!source.startsWith('https://')) continue;
    const host = new URL(source).hostname;
    const isOfficialTurnstile = source === 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    if (!isOfficialTurnstile && !/\bintegrity\s*=\s*["']sha(?:256|384|512)-/i.test(tag)) failures.push(`${location}: script externo sem SRI (${host})`);
    if (!isOfficialTurnstile && !/\bcrossorigin\s*=\s*["']anonymous["']/i.test(tag)) failures.push(`${location}: script externo sem crossorigin=anonymous (${host})`);
    if (/@(?:latest|next|beta)(?:\/|$)/i.test(source) || /@\d+(?:\/|$)/.test(source)) failures.push(`${location}: versão flutuante (${host})`);
  }
}

const financeHtml = readFileSync(join(root, 'financeiro', 'index.html'), 'utf8');
const financeJs = readFileSync(join(root, 'financeiro', 'app.js'), 'utf8');
const legacyFinanceAuth = [
  ['campo de usuário legado', /id=["']lgUser["']/i, financeHtml],
  ['campo de token legado', /id=["']lgToken["']/i, financeHtml],
  ['handler de login legado', /\bdoLogin\b/, financeHtml + '\n' + financeJs],
  ['chave de sessão legada', /321fin_session/, financeJs],
  ['parâmetro público de identidade', /\bp_(?:username|token)\b/, financeJs],
  ['marcador central-session', /central-session/, financeJs],
];
for (const [label, pattern, source] of legacyFinanceAuth) {
  if (pattern.test(source)) failures.push(`financeiro: ${label} voltou ao código ativo`);
}

const financeXssRegressions = [
  ['cliente/modelo de obra sem escape', '${obra?obra.cliente'],
  ['rótulo dinâmico da DRE sem escape', '${bold?`<strong>${lbl}</strong>`:lbl}'],
];
for (const [label, fragment] of financeXssRegressions) {
  if (financeJs.includes(fragment)) failures.push(`financeiro: ${label}`);
}
const plantaJs = readFileSync(join(root, 'planta', 'app.js'), 'utf8');
const legacyPlantaAuth = [
  ['parâmetro p_token', /\bp_token\b/, plantaJs],
  ['storage de token legado', /321modular_token/, plantaJs],
  ['autenticação por token legado', /autenticarECarregarToken/, plantaJs],
];
for (const [label, pattern, source] of legacyPlantaAuth) {
  if (pattern.test(source)) failures.push(`planta: ${label} voltou ao código ativo`);
}
let headers = '';
try { headers = readFileSync(join(root, '_headers'), 'utf8').toLowerCase(); } catch { failures.push('_headers ausente'); }
for (const name of ['content-security-policy:', 'x-frame-options:', 'x-content-type-options:', 'referrer-policy:', 'permissions-policy:', 'strict-transport-security:']) {
  if (!headers.includes(name)) failures.push(`_headers não define ${name.slice(0, -1)}`);
}

const landingHtml = readFileSync(join(root, 'index.html'), 'utf8');
const landingJs = readFileSync(join(root, 'shared', 'landing.js'), 'utf8');
const authJs = readFileSync(join(root, 'shared', 'auth.js'), 'utf8');
const runtimeConfig = readFileSync(join(root, 'shared', 'runtime-config.js'), 'utf8');
if (!landingHtml.includes('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit')) failures.push('landing: script oficial do Turnstile ausente');
if (!landingHtml.includes('id="turnstile-widget"')) failures.push('landing: contêiner do Turnstile ausente');
if (!/"turnstileSiteKey"\s*:\s*"0x/i.test(runtimeConfig)) failures.push('landing: site key pública do Turnstile ausente');
if (!/captchaToken/.test(authJs) || !/turnstileToken/.test(landingJs)) failures.push('landing: token Turnstile não está ligado ao Supabase Auth');
if (/turnstileSecret|captchaSecret|secretTurnstile/i.test(landingHtml + landingJs + authJs + runtimeConfig)) failures.push('landing: referência a segredo Turnstile no frontend');
if (!headers.includes('script-src') || !headers.includes('https://challenges.cloudflare.com')) failures.push('_headers não permite o script oficial do Turnstile');
if (!/frame-src[^;\r\n]*https:\/\/challenges\.cloudflare\.com/i.test(headers)) failures.push('_headers não permite o iframe oficial do Turnstile');

console.log(JSON.stringify({ passed: failures.length === 0, checkedFiles: files.length, failures, notes }, null, 2));
process.exitCode = failures.length ? 1 : 0;
