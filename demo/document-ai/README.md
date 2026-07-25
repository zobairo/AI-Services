# Demo #2 — Document Processing (service C1)

The second demo the [90-day roadmap](../../docs/06-roadmap-90-days.md) requires, and the reference build for [service C1](../../docs/02-services-catalog.md). Invoices and receipts in, clean accounting data out, with the doubtful ones sent to a human instead of guessed at.

```bash
cd demo/document-ai
npm start      # process samples/, write output/
npm test       # field-level accuracy against expected.json
```

Runs with no API key (rule-based mock extraction). Set `ANTHROPIC_API_KEY` and the extraction is done by Claude, which handles layouts and languages the rules cannot.

## What a prospect sees

```
✓ 01-northwind.txt             NORTHWIND SUPPLIES LTD   GBP 795.60
✓ 02-lumiere-eur.txt           Lumière Éclairage SARL   EUR 902.40
✓ 03-quickmart-receipt.txt     QUICKMART TRADE          GBP 100.32
✓ 04-brightwave-discount.txt   BRIGHTWAVE MARKETING     GBP 1776.60
? 05-messy-scan.txt            review · conf 0
    → Invoice no. is missing
    → Total is missing
— 06-delivery-note.txt         skipped: not an invoice (other)

4 ready to post · 1 need review · 1 not invoices
67% went through without a human touching them
```

That last line is the sale. "Two thirds of your invoices never need a person, and the other third arrives on a list with the reason attached."

## The three things that make it trustworthy

**1. Confidence comes from checks, not from the model's opinion.**
Language models are unreliable judges of their own certainty. So the pipeline verifies things that are objectively verifiable: does `subtotal + tax` equal `total`, do the dates parse, is the due date after the invoice date, is every required field present. Those are the checks a bookkeeper does, and they are defensible to a client.

**2. A document that isn't a bill never reaches the accounts.**
`06-delivery-note.txt` lists the same supplier and the same goods as a real invoice — and is rejected. This is enforced in the eval as a **guardrail failure**, which fails the build in every mode. Posting a delivery note as payable is the kind of error that ends a bookkeeping contract.

**3. Damaged documents fail loudly.**
`05-messy-scan.txt` is deliberately OCR-mangled. It is not silently half-extracted: it lands in `output/review-queue.json` with each problem named.

## Output

| File | What it is |
|---|---|
| `output/for-accounting.csv` | The import file — only documents that passed every check |
| `output/review-queue.json` | What a person must look at, with the reason for each |
| `output/extracted.json` | Everything including rejects, for audit |

## Accuracy today

`npm test` scores every field against `expected.json`:

- **Mock (rules):** ~92% of fields, all failures on the damaged scan, 0 guardrail failures.
- **Live (Claude):** the target is ≥95%, enforced — the eval exits non-zero below it.

Mock mode is intentionally not clever. It succeeds on tidy documents and fails on messy ones, which is an accurate picture of what rule-based extraction does — and the reason clients pay for the model-based version.

## Turning this into a paid client build

1. **Collect 20–30 of their real documents** at kick-off. This is the single most valuable thing you can ask for, and it doubles as discovery.
2. **Write `expected.json` from them.** That file becomes the acceptance criteria in the [proposal](../../templates/proposal.md) — the client approves it before you build.
3. **Trim `src/schema.js`** to the fields they actually type today. Every extra field is another thing to review and argue about.
4. **Point `DOCS_DIR`** at their folder, or wire the input to an email inbox or cloud-drive trigger in n8n.
5. **Wire the output** to their accounting tool's import, and the review queue to wherever they will actually look — usually a shared sheet or a Slack message.
6. `npm test` until it clears their agreed threshold. That run is your delivery acceptance.

## Known limits (say these out loud in sales calls)

- **Text in, not PDFs.** Real deployments need a PDF/image text layer first (a PDF text extractor, or OCR for scans). That is a well-solved step, but it is a step — budget for it.
- **Currency and date conventions** are assumed (day-first dates). Pin these to the client's locale during onboarding; getting it wrong silently is worse than failing.
- **No duplicate detection.** Production systems must catch the same invoice arriving twice — usually supplier + invoice number + total. Add it before going live.
- **Sample data is fictional.** All six documents and every company in them are invented.
