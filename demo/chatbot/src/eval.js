// Acceptance test runner. Run: npm test
//
// The business plan makes this non-negotiable: every automation ships with
// 10-20 real test cases, and delivery means "these pass on the client's own
// data". This runner is the artifact you show the client at handover, and the
// regression suite you re-run after every prompt or model change.
//
// Case fields (test-cases.json):
//   question        - what the customer asks
//   expect_source   - retrieval must rank one of these files first
//   expect_escalate - must the bot hand off to a human?
//   expect_contains - substrings the answer must include (live mode only)
//   requires        - "live" marks cases that need a real model to judge

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { answerQuestion, CONFIG } from './answer.js';
import { CLIENT_DIR } from './ingest.js';

const CASES_FILE = path.join(CLIENT_DIR, 'test-cases.json');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

function checkCase(testCase, result, live) {
  const failures = [];

  if (testCase.expect_source) {
    const expected = [].concat(testCase.expect_source);
    const top = result.sources[0]?.source;
    if (!top || !expected.includes(top)) {
      failures.push(`top source was ${top || 'none'}, expected one of ${expected.join(', ')}`);
    }
  }

  if (typeof testCase.expect_escalate === 'boolean') {
    if (result.escalate !== testCase.expect_escalate) {
      failures.push(
        `escalate was ${result.escalate}, expected ${testCase.expect_escalate}` +
          (result.reason ? ` (${result.reason})` : ''),
      );
    }
  }

  if (live && testCase.expect_contains) {
    const answer = result.answer.toLowerCase();
    for (const needle of testCase.expect_contains) {
      if (!answer.includes(String(needle).toLowerCase())) {
        failures.push(`answer missing "${needle}"`);
      }
    }
  }

  return failures;
}

async function main() {
  const cases = JSON.parse(await readFile(CASES_FILE, 'utf8'));
  const live = Boolean(CONFIG.apiKey);

  console.log(`\nAcceptance tests — ${cases.length} cases`);
  console.log(
    live
      ? `mode: live (${CONFIG.model})\n`
      : `mode: ${YELLOW}mock${RESET} — retrieval, gating and escalation are still checked;\n` +
        `      set ANTHROPIC_API_KEY to also check answer wording and model-judged cases\n`,
  );

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const [i, testCase] of cases.entries()) {
    const number = String(i + 1).padStart(2, '0');

    if (testCase.requires === 'live' && !live) {
      skipped += 1;
      console.log(`${YELLOW}SKIP${RESET} ${number}  ${testCase.question}`);
      console.log(`${DIM}      needs a real model to judge (${testCase.note || 'model-side rule'})${RESET}`);
      continue;
    }

    let result;
    try {
      result = await answerQuestion(testCase.question);
    } catch (error) {
      failed += 1;
      console.log(`${RED}FAIL${RESET} ${number}  ${testCase.question}`);
      console.log(`${DIM}      error: ${error.message}${RESET}`);
      continue;
    }

    const failures = checkCase(testCase, result, live);
    const meta = `conf ${result.confidence.toFixed(2)} | ${result.sources[0]?.source || 'no source'}${
      result.escalate ? ' | escalated' : ''
    }`;

    if (failures.length === 0) {
      passed += 1;
      console.log(`${GREEN}PASS${RESET} ${number}  ${testCase.question}`);
      console.log(`${DIM}      ${meta}${RESET}`);
    } else {
      failed += 1;
      console.log(`${RED}FAIL${RESET} ${number}  ${testCase.question}`);
      console.log(`${DIM}      ${meta}${RESET}`);
      for (const failure of failures) console.log(`      ${RED}→${RESET} ${failure}`);
    }
  }

  const total = passed + failed;
  const rate = total ? Math.round((passed / total) * 100) : 0;
  console.log(
    `\n${passed}/${total} passed (${rate}%)` +
      (skipped ? `, ${skipped} skipped` : '') +
      (failed ? ` — ${RED}${failed} failing${RESET}` : ` ${GREEN}✓${RESET}`),
  );

  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
