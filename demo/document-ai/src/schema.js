// What we extract from every document, and what "valid" means.
//
// Keep this list short. Every extra field is another thing that can be wrong,
// another thing to review, and another argument at handover. Ask the client
// which fields actually get typed into their accounting system today — it is
// usually six or seven, not twenty.

export const FIELDS = [
  { key: 'document_type', label: 'Type', type: 'enum', values: ['invoice', 'receipt', 'other'], required: true },
  { key: 'supplier_name', label: 'Supplier', type: 'string', required: true },
  { key: 'invoice_number', label: 'Invoice no.', type: 'string', required: true },
  { key: 'invoice_date', label: 'Date', type: 'date', required: true },
  { key: 'due_date', label: 'Due date', type: 'date', required: false },
  { key: 'currency', label: 'Currency', type: 'enum', values: ['GBP', 'EUR', 'USD'], required: true },
  { key: 'subtotal', label: 'Subtotal', type: 'number', required: true },
  { key: 'tax', label: 'Tax', type: 'number', required: true },
  { key: 'total', label: 'Total', type: 'number', required: true },
];

export const EMPTY = () =>
  Object.fromEntries(FIELDS.map((f) => [f.key, null]));

/**
 * Validation is where confidence comes from.
 *
 * We deliberately do NOT ask the model "how confident are you" — language models
 * are poorly calibrated at self-reported confidence. Instead we check things
 * that are objectively checkable: does the arithmetic balance, did every
 * required field come back, do the dates parse, is the due date after the
 * invoice date. Those checks are what a bookkeeper would do, and they are what
 * we can defend to a client when we say "these 4 are safe to post, review this one".
 */
export function validate(fields) {
  const issues = [];

  for (const field of FIELDS) {
    const value = fields[field.key];
    if (field.required && (value === null || value === '' || value === undefined)) {
      issues.push({ field: field.key, severity: 'high', message: `${field.label} is missing` });
      continue;
    }
    if (value === null || value === undefined) continue;

    if (field.type === 'number' && !Number.isFinite(value)) {
      issues.push({ field: field.key, severity: 'high', message: `${field.label} is not a number` });
    }
    if (field.type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
      issues.push({ field: field.key, severity: 'medium', message: `${field.label} is not a valid date` });
    }
    if (field.type === 'enum' && !field.values.includes(value)) {
      issues.push({ field: field.key, severity: 'medium', message: `${field.label} "${value}" is not one of ${field.values.join('/')}` });
    }
  }

  // The check that catches real mistakes: the numbers must add up.
  const { subtotal, tax, total } = fields;
  if ([subtotal, tax, total].every(Number.isFinite)) {
    const drift = Math.abs(subtotal + tax - total);
    if (drift > 0.02) {
      issues.push({
        field: 'total',
        severity: 'high',
        message: `subtotal + tax = ${(subtotal + tax).toFixed(2)} but total is ${total.toFixed(2)} (off by ${drift.toFixed(2)})`,
      });
    }
  }

  if (fields.invoice_date && fields.due_date && /^\d{4}-\d{2}-\d{2}$/.test(fields.invoice_date) && /^\d{4}-\d{2}-\d{2}$/.test(fields.due_date)) {
    if (fields.due_date < fields.invoice_date) {
      issues.push({ field: 'due_date', severity: 'medium', message: 'due date is before the invoice date' });
    }
  }

  const high = issues.filter((i) => i.severity === 'high').length;
  const medium = issues.filter((i) => i.severity === 'medium').length;
  // Confidence starts perfect and is knocked down by what failed to check out.
  const confidence = Math.max(0, 1 - high * 0.34 - medium * 0.12);

  return { issues, confidence, needsReview: confidence < 0.8 };
}
