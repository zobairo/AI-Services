// Process every document in samples/ and produce what a bookkeeper actually
// wants: a clean file to import, and a short review queue of the rest.
// Run: npm start

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractDocument, CONFIG } from './extract.js';
import { FIELDS } from './schema.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const SAMPLES = process.env.DOCS_DIR || path.join(here, '..', 'samples');
const OUT = path.join(here, '..', 'output');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const csvCell = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

async function main() {
  const files = (await readdir(SAMPLES)).filter((f) => /\.(txt|md)$/i.test(f)).sort();
  if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

  console.log(`\n  Processing ${files.length} documents  ${DIM}(${CONFIG.apiKey ? `live · ${CONFIG.model}` : 'mock mode — no API key'})${RESET}\n`);

  const posted = [];
  const review = [];
  const rejected = [];
  let tokensIn = 0;
  let tokensOut = 0;

  for (const file of files) {
    const text = await readFile(path.join(SAMPLES, file), 'utf8');
    let result;
    try {
      result = await extractDocument(text);
    } catch (error) {
      rejected.push({ file, reason: `extraction failed: ${error.message}` });
      console.log(`  ${RED}✗${RESET} ${file.padEnd(28)} ${DIM}${error.message}${RESET}`);
      continue;
    }

    const { fields, validation, usage } = result;
    if (usage) {
      tokensIn += usage.input_tokens || 0;
      tokensOut += usage.output_tokens || 0;
    }

    const record = { file, ...fields, confidence: Number(validation.confidence.toFixed(2)) };

    // A document that is not a payable invoice never reaches the accounts.
    if (fields.document_type === 'other') {
      rejected.push({ file, reason: 'not an invoice or receipt', fields });
      console.log(`  ${YELLOW}—${RESET} ${file.padEnd(28)} ${DIM}skipped: not an invoice (${fields.document_type})${RESET}`);
      continue;
    }

    if (validation.needsReview) {
      review.push({ ...record, issues: validation.issues });
      console.log(`  ${YELLOW}?${RESET} ${file.padEnd(28)} ${DIM}review · conf ${record.confidence}${RESET}`);
      for (const issue of validation.issues) {
        console.log(`      ${YELLOW}→${RESET} ${issue.message}`);
      }
    } else {
      posted.push(record);
      const total = fields.total === null ? '—' : `${fields.currency} ${fields.total.toFixed(2)}`;
      console.log(
        `  ${GREEN}✓${RESET} ${file.padEnd(28)} ${DIM}${(fields.supplier_name || '').slice(0, 22).padEnd(24)} ${total}${RESET}`,
      );
    }
  }

  // Accounting import file — the actual deliverable the client uses.
  const columns = ['file', ...FIELDS.map((f) => f.key), 'confidence'];
  const csv = [
    columns.join(','),
    ...posted.map((row) => columns.map((c) => csvCell(row[c])).join(',')),
  ].join('\n');

  await writeFile(path.join(OUT, 'for-accounting.csv'), csv + '\n');
  await writeFile(path.join(OUT, 'review-queue.json'), JSON.stringify(review, null, 2));
  await writeFile(
    path.join(OUT, 'extracted.json'),
    JSON.stringify({ posted, review, rejected }, null, 2),
  );

  const handled = posted.length + review.length + rejected.length;
  const autoRate = handled ? Math.round((posted.length / handled) * 100) : 0;

  console.log(`\n  ${GREEN}${posted.length} ready to post${RESET} · ${YELLOW}${review.length} need review${RESET} · ${rejected.length} not invoices`);
  console.log(`  ${autoRate}% went through without a human touching them\n`);
  console.log(`  ${DIM}output/for-accounting.csv   import file`);
  console.log(`  output/review-queue.json    what a person must look at`);
  console.log(`  output/extracted.json       everything, for audit${RESET}`);

  if (tokensIn) {
    const cost = (tokensIn / 1e6) * 3 + (tokensOut / 1e6) * 15;
    console.log(`\n  ${DIM}tokens: ${tokensIn} in / ${tokensOut} out ≈ $${cost.toFixed(3)} for ${files.length} documents`);
    console.log(`  at 500 invoices/month that is about $${((cost / files.length) * 500).toFixed(2)}/month in API cost${RESET}`);
  }
  console.log();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
