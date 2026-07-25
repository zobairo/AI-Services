#!/usr/bin/env node
// Runs every check in the repo. This is what CI runs, and what you run before
// touching a client's live automation. Run: npm test

import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const results = [];

function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`}  ${name}${detail ? `  ${DIM}${detail}${RESET}` : ''}`);
}

function runSuite(name, cwd) {
  const result = spawnSync('npm', ['test', '--silent'], {
    cwd: path.join(ROOT, cwd),
    encoding: 'utf8',
    env: process.env,
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  const summary = output
    .split('\n')
    .reverse()
    .find((line) => /passed|accuracy/.test(line) && !/mode:/.test(line));
  const ok = result.status === 0;
  record(name, ok, (summary || '').replace(/\x1b\[[0-9;]*m/g, '').trim());
  if (!ok) console.log(output.split('\n').slice(-25).join('\n'));
  return ok;
}

console.log(`\n  AI-Services — full check\n`);

// 1. The two service demos, each with its own acceptance suite.
runSuite('chatbot acceptance tests', 'demo/chatbot');
runSuite('document extraction accuracy', 'demo/document-ai');

// 2. The quote calculator must run and produce a build fee.
{
  const result = spawnSync('node', ['tools/quote.js', 'A1', 'D1'], { cwd: ROOT, encoding: 'utf8' });
  record(
    'quote calculator',
    result.status === 0 && /BUILD FEE/.test(result.stdout),
    'services + package pricing',
  );
}

// 3. Every n8n workflow must be valid JSON with no dangling connections —
//    a broken export is worse than no export, because you find out at a client.
{
  const dir = path.join(ROOT, 'n8n-templates');
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  const problems = [];
  for (const file of files) {
    try {
      const workflow = JSON.parse(readFileSync(path.join(dir, file), 'utf8'));
      const names = new Set(workflow.nodes.map((n) => n.name));
      if (names.size !== workflow.nodes.length) problems.push(`${file}: duplicate node names`);
      for (const [source, connection] of Object.entries(workflow.connections || {})) {
        if (!names.has(source)) problems.push(`${file}: connection from unknown node "${source}"`);
        for (const branch of connection.main || []) {
          for (const target of branch || []) {
            if (!names.has(target.node)) problems.push(`${file}: connection to unknown node "${target.node}"`);
          }
        }
      }
      for (const node of workflow.nodes) {
        if (!node.type || !node.typeVersion || !node.position) problems.push(`${file}: incomplete node "${node.name}"`);
      }
    } catch (error) {
      problems.push(`${file}: ${error.message}`);
    }
  }
  record('n8n workflow templates', problems.length === 0, `${files.length} workflows`);
  for (const problem of problems) console.log(`      ${RED}→${RESET} ${problem}`);
}

// 4. Client scaffolding must produce a working client folder.
{
  const slug = 'ci-scaffold-check';
  const dir = path.join(ROOT, 'clients', slug);
  spawnSync('rm', ['-rf', dir]);
  const create = spawnSync('node', ['scripts/new-client.js', slug, 'CI Check', '--industry', 'clinic'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  const ingest = spawnSync('npm', ['--prefix', 'demo/chatbot', 'run', 'ingest', '--silent'], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, CLIENT_DIR: `clients/${slug}` },
  });
  const ok =
    create.status === 0 &&
    ingest.status === 0 &&
    existsSync(path.join(dir, 'client.json')) &&
    existsSync(path.join(dir, 'RUNBOOK.md'));
  record('client scaffolding', ok, 'new-client.js + ingest');
  spawnSync('rm', ['-rf', dir]);
}

// 5. Docs and templates must not contain unfilled markers that would embarrass
//    you in front of a client. Placeholders inside templates are expected —
//    they are the point — so only the plan documents are checked.
{
  const dir = path.join(ROOT, 'docs');
  const offenders = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const text = readFileSync(path.join(dir, file), 'utf8');
    if (/\bTODO\b|\bTBD\b|\[your name\]|lorem ipsum/i.test(text)) offenders.push(file);
  }
  record('plan documents complete', offenders.length === 0, `${readdirSync(dir).length} docs`);
  for (const file of offenders) console.log(`      ${RED}→${RESET} ${file} contains an unfilled marker`);
}

const failed = results.filter((r) => !r.ok);
console.log(
  `\n  ${results.length - failed.length}/${results.length} checks passed` +
    (failed.length ? ` — ${RED}${failed.length} failing${RESET}\n` : ` ${GREEN}✓${RESET}\n`),
);
process.exit(failed.length ? 1 : 0);
