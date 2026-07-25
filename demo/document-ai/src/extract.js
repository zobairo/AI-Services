// Extraction: document text in, structured fields out.
//
// Live mode  : Claude reads the document. Handles any layout, any language.
// Mock mode  : regex heuristics, so the pipeline (validation, review queue,
//              accounting export, eval) is fully runnable with no API key.
//              Mock is deliberately not clever — it succeeds on tidy documents
//              and flags messy ones, which is an honest picture of what
//              rule-based extraction actually does and why clients buy the
//              model-based version.

import { EMPTY, FIELDS, validate } from './schema.js';

export const CONFIG = {
  model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5',
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  maxTokens: 700,
};

const MONTHS = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function toIso(day, month, year) {
  if (!day || !month || !year) return null;
  if (year < 100) year += 2000;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Handles "14 March 2026", "02/03/2026", "2026-03-14". Day-first for the
// slash format, since that is the convention in the markets this demo targets —
// a real client build pins this to their locale during onboarding.
function parseDate(raw) {
  if (!raw) return null;
  const text = String(raw).trim();

  const iso = /(\d{4})-(\d{2})-(\d{2})/.exec(text);
  if (iso) return toIso(Number(iso[3]), Number(iso[2]), Number(iso[1]));

  const named = /(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})/.exec(text);
  if (named) {
    const month = MONTHS[named[2].slice(0, 3).toLowerCase()];
    return toIso(Number(named[1]), month, Number(named[3]));
  }

  const slash = /(\d{1,2})[/.](\d{1,2})[/.](\d{2,4})/.exec(text);
  if (slash) return toIso(Number(slash[1]), Number(slash[2]), Number(slash[3]));

  return null;
}

function parseAmount(raw) {
  if (raw === null || raw === undefined) return null;
  let text = String(raw).trim().replace(/[^\d.,-]/g, '');
  if (!text) return null;
  // European "1.234,56" vs UK/US "1,234.56"
  const lastComma = text.lastIndexOf(',');
  const lastDot = text.lastIndexOf('.');
  if (lastComma > lastDot) {
    text = text.replace(/\./g, '').replace(',', '.');
  } else {
    text = text.replace(/,/g, '');
  }
  const value = Number(text);
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : null;
}

// ── Mock extractor ──────────────────────────────────────────────────────────

// Lines that mention tax or a reference but are identity numbers, not money.
// "VAT Reg: GB 442 8871 03" is the classic trap — it sits near the top of most
// invoices and naive extraction reads 442 as the tax amount.
const IDENTITY_LINE = /\b(reg|registration|vat\s*(no|reg)|tva\s*:|company\s*no|iban|sort|acct|account|tel|vat\s*no)\b/i;

/**
 * Find a labelled amount by scanning the totals block from the bottom up.
 * Returns the LAST number on the matching line, after stripping percentages,
 * which is where the money sits on virtually every invoice layout:
 *   "VAT @ 20%        132.60"  ->  132.60
 */
function findLabelledAmount(lines, label, { exclude } = {}) {
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i];
    if (!label.test(line)) continue;
    if (exclude && exclude.test(line)) continue;
    if (IDENTITY_LINE.test(line)) continue;

    const cleaned = line.replace(/\d+([.,]\d+)?\s*%/g, ' ');
    const numbers = [...cleaned.matchAll(/\d[\d.,\s]*\d|\d/g)]
      .map((m) => parseAmount(m[0]))
      .filter((v) => v !== null);
    if (numbers.length) return numbers[numbers.length - 1];
  }
  return null;
}

function classify(text) {
  // Explicit non-payable documents. These must never reach the accounts.
  if (/delivery\s*note|packing\s*(slip|list)|this is not an invoice|quotation|purchase\s*order|statement of account/i.test(text)) {
    return 'other';
  }
  if (/receipt/i.test(text)) return 'receipt';
  if (/invoice|facture|tax invoice/i.test(text)) return 'invoice';
  // OCR damage can destroy the word "invoice" itself (l/1 instead of I). If the
  // document still has a total and amounts, treat it as an invoice so it lands
  // in the review queue rather than being silently dropped.
  if (/t\s*o\s*t\s*a\s*l|amount due/i.test(text)) return 'invoice';
  return 'other';
}

function mockExtract(text) {
  const fields = EMPTY();
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  fields.document_type = classify(text);
  fields.supplier_name = lines[0] || null;

  // The captured reference must contain a digit — without that, the pattern
  // happily matches the word "Invoice" in the document's own title.
  const REFERENCE = /([A-Z0-9][A-Z0-9/-]*\d[A-Z0-9/-]*)/.source;
  const number =
    new RegExp(`(?:invoice|inv|facture)\\s*(?:no|n°|number|#)?[:\\s.]*${REFERENCE}`, 'i').exec(text) ||
    new RegExp(`(?:^|\\n)\\s*(?:ref|receipt\\s*#)[:\\s.]*${REFERENCE}`, 'i').exec(text);
  fields.invoice_number = number ? number[1].trim() : null;

  const issued =
    /(?:invoice date|issue date|issued|date d'émission|^\s*date)\s*[:\s]\s*([^\n]+)/im.exec(text);
  fields.invoice_date = parseDate(issued ? issued[1] : null);

  const due = /(?:due date|payment due|due|échéance)\s*[:\/\s]*([^\n]+)/i.exec(text);
  fields.due_date = parseDate(due ? due[1] : null);

  if (/\bEUR\b|€/.test(text)) fields.currency = 'EUR';
  else if (/\bUSD\b|\$/.test(text)) fields.currency = 'USD';
  else fields.currency = 'GBP';

  fields.subtotal = findLabelledAmount(lines, /sub\s*total|total\s*ht|net after discount/i);
  fields.tax = findLabelledAmount(lines, /\b(vat|tva|tax)\b/i);
  fields.total = findLabelledAmount(lines, /\b(total|amount due)\b/i, {
    exclude: /sub\s*total|total\s*ht|gross/i,
  });

  return fields;
}

// ── Live extractor ──────────────────────────────────────────────────────────

function systemPrompt() {
  const fieldList = FIELDS.map((f) => {
    const type = f.type === 'enum' ? `one of ${f.values.join(' | ')}` : f.type;
    return `  "${f.key}": ${type}${f.required ? '' : ' (null if absent)'}`;
  }).join('\n');

  return `You extract structured data from supplier documents for a bookkeeping system.

Return ONLY a JSON object with exactly these keys:
{
${fieldList}
}

Rules:
- Copy values exactly as they appear. Never calculate, correct or invent a value. If the document's own arithmetic is wrong, return what is printed — a later validation step catches it.
- Dates must be YYYY-MM-DD. Where a date is ambiguous (e.g. 02/03/2026), assume day/month/year.
- Amounts must be plain numbers: 1234.56, no currency symbols or thousands separators.
- document_type is "invoice" for anything requesting payment, "receipt" for proof of a completed payment, and "other" for anything else — delivery notes, statements, quotes, letters. A delivery note is NOT an invoice even when it lists goods and a supplier.
- If a required value genuinely is not in the document, use null. Do not guess.
- Respond with the JSON only, no markdown fence and no commentary.`;
}

async function liveExtract(text) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': CONFIG.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CONFIG.model,
      max_tokens: CONFIG.maxTokens,
      system: systemPrompt(),
      messages: [{ role: 'user', content: `DOCUMENT:\n\n${text}` }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API ${response.status}: ${(await response.text()).slice(0, 200)}`);
  }

  const data = await response.json();
  const raw = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
    .replace(/^```(?:json)?\s*|\s*```$/g, '');

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = /\{[\s\S]*\}/.exec(raw);
    parsed = match ? JSON.parse(match[0]) : {};
  }

  // Normalise whatever came back into our schema's shape.
  const fields = EMPTY();
  for (const field of FIELDS) {
    const value = parsed[field.key];
    if (value === null || value === undefined || value === '') continue;
    if (field.type === 'number') fields[field.key] = parseAmount(value);
    else if (field.type === 'date') fields[field.key] = parseDate(value);
    else fields[field.key] = String(value).trim();
  }

  return { fields, usage: data.usage || null };
}

/**
 * Extract one document.
 * @returns {{fields:object, validation:object, mode:'live'|'mock', usage:object|null}}
 */
export async function extractDocument(text) {
  const mode = CONFIG.apiKey ? 'live' : 'mock';
  const { fields, usage } =
    mode === 'live' ? await liveExtract(text) : { fields: mockExtract(text), usage: null };

  return { fields, validation: validate(fields), mode, usage };
}
