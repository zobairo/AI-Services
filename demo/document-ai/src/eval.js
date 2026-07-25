// Field-level accuracy against expected.json. Run: npm test
//
// Two things are checked, and they mean different things to a client:
//   1. ACCURACY  — of the fields we extracted, how many were right?
//   2. GUARDRAIL — did anything reach the accounts that never should have?
//
// Accuracy is a quality number you quote in the monthly report. A guardrail
// failure is a defect: posting a delivery note as a payable invoice is the
// kind of mistake that ends a bookkeeping contract, so it fails the build in
// both live and mock mode.

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractDocument, CONFIG } from './extract.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const SAMPLES = path.join(here, '..', 'samples');
const EXPECTED = path.join(here, '..', 'expected.json');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

// Live extraction should be near-perfect on documents this simple; rule-based
// mock extraction should not be, and pretending otherwise would be dishonest.
const LIVE_ACCURACY_TARGET = 0.95;

const same = (expected, actual) => {
  if (typeof expected === 'number') {
    return Number.isFinite(actual) && Math.abs(expected - actual) < 0.005;
  }
  if (expected === null) return actual === null;
  return String(expected).trim().toLowerCase() === String(actual ?? '').trim().toLowerCase();
};

async function main() {
  const { documents } = JSON.parse(await readFile(EXPECTED, 'utf8'));
  const files = (await readdir(SAMPLES)).filter((f) => /\.(txt|md)$/i.test(f)).sort();
  const live = Boolean(CONFIG.apiKey);

  console.log(`\nExtraction accuracy — ${files.length} documents`);
  console.log(
    live
      ? `mode: live (${CONFIG.model})\n`
      : `mode: ${YELLOW}mock${RESET} ${DIM}— rule-based extraction; guardrails are still enforced,\n      accuracy is reported but not failed. Set ANTHROPIC_API_KEY for the real thing.${RESET}\n`,
  );

  let correct = 0;
  let checked = 0;
  let guardrailFailures = 0;

  for (const file of files) {
    const expected = documents[file];
    if (!expected) {
      console.log(`${YELLOW}SKIP${RESET} ${file} — no ground truth`);
      continue;
    }

    const text = await readFile(path.join(SAMPLES, file), 'utf8');
    const { fields, validation } = await extractDocument(text);

    const fieldKeys = Object.keys(expected).filter((k) => !k.startsWith('_') && k !== 'must_reject');
    const wrong = [];
    for (const key of fieldKeys) {
      checked += 1;
      if (same(expected[key], fields[key])) correct += 1;
      else wrong.push(`${key}: got ${JSON.stringify(fields[key])}, expected ${JSON.stringify(expected[key])}`);
    }

    const routed =
      fields.document_type === 'other' ? 'rejected' : validation.needsReview ? 'review' : 'posted';

    // The guardrail: anything marked must_reject may never be routed to the accounts.
    let guardrailOk = true;
    if (expected.must_reject && routed !== 'rejected') {
      guardrailOk = false;
      guardrailFailures += 1;
    }

    const score = fieldKeys.length ? (fieldKeys.length - wrong.length) / fieldKeys.length : 1;
    const badge = !guardrailOk ? `${RED}GUARDRAIL${RESET}` : score === 1 ? `${GREEN}OK   ${RESET}` : `${YELLOW}PART ${RESET}`;

    console.log(
      `${badge} ${file.padEnd(28)} ${DIM}${Math.round(score * 100)}% of fields · routed: ${routed} · conf ${validation.confidence.toFixed(2)}${RESET}`,
    );
    for (const detail of wrong) console.log(`        ${DIM}· ${detail}${RESET}`);
    if (!guardrailOk) {
      console.log(`        ${RED}· must never be posted to the accounts, but was routed "${routed}"${RESET}`);
    }
  }

  const accuracy = checked ? correct / checked : 0;
  console.log(`\n  field accuracy: ${correct}/${checked} (${Math.round(accuracy * 100)}%)`);
  console.log(`  guardrail failures: ${guardrailFailures}`);

  let failed = guardrailFailures > 0;
  if (live && accuracy < LIVE_ACCURACY_TARGET) {
    console.log(`\n  ${RED}accuracy below the ${Math.round(LIVE_ACCURACY_TARGET * 100)}% target for live mode${RESET}`);
    failed = true;
  }

  console.log(failed ? `\n  ${RED}FAILED${RESET}\n` : `\n  ${GREEN}PASSED${RESET}\n`);
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
