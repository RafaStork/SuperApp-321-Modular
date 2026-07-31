#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checkHistory = process.argv.includes('--history');
const findings = [];
const patterns = [
  ['Supabase personal access token', new RegExp('sb' + 'p_[A-Za-z0-9]{20,}', 'g')],
  ['GitHub classic token', new RegExp('gh' + '[pousr]_[A-Za-z0-9]{20,}', 'g')],
  ['GitHub fine-grained token', new RegExp('github_' + 'pat_[A-Za-z0-9_]{20,}', 'g')],
  ['AWS access key', new RegExp('AK' + 'IA[0-9A-Z]{16}', 'g')],
  ['Private key', new RegExp('-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----', 'g')],
  ['Credential in database URL', new RegExp('postgres(?:ql)?://[^\\s/:]+:[^\\s/@]+@', 'gi')],
];
const jwtPattern = /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g;

function record(label, location, line) {
  findings.push({ category: label, location, ...(line ? { line } : {}) });
}

function scan(text, location) {
  for (const [label, regex] of patterns) {
    regex.lastIndex = 0;
    for (const match of text.matchAll(regex)) {
      const line = text.slice(0, match.index).split('\n').length;
      record(label, location, line);
    }
  }
  jwtPattern.lastIndex = 0;
  for (const match of text.matchAll(jwtPattern)) {
    try {
      const payload = JSON.parse(Buffer.from(match[0].split('.')[1], 'base64url').toString('utf8'));
      if (payload.role === 'service_role') {
        const line = text.slice(0, match.index).split('\n').length;
        record('Supabase service-role JWT', location, line);
      }
    } catch {}
  }
}

function walk(dir, output = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const full = join(dir, entry.name);
    entry.isDirectory() ? walk(full, output) : output.push(full);
  }
  return output;
}

let files;
try {
  files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8', windowsHide: true })
    .split('\0').filter(Boolean).map((file) => join(root, file));
} catch {
  files = walk(root);
}

for (const file of files) {
  if (statSync(file).size > 5_000_000) continue;
  const data = readFileSync(file);
  if (data.includes(0)) continue;
  scan(data.toString('utf8'), relative(root, file).replaceAll('\\', '/'));
}

let historyChecked = false;
if (checkHistory) {
  try {
    const history = execFileSync('git', ['log', '--all', '--format=', '--patch', '--no-ext-diff', '--unified=0'], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
      windowsHide: true,
    });
    scan(history, 'histórico Git');
    historyChecked = true;
  } catch (error) {
    console.error('Não foi possível analisar o histórico Git:', error.message);
    process.exit(2);
  }
}

const unique = [...new Map(findings.map((item) => [JSON.stringify(item), item])).values()];
console.log(JSON.stringify({
  passed: unique.length === 0,
  historyChecked,
  findings: unique,
  note: 'Valores detectados são intencionalmente mascarados e nunca são impressos.',
}, null, 2));
process.exitCode = unique.length ? 1 : 0;
