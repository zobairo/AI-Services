# n8n Workflow Templates

The start of the template library that [docs/03](../docs/03-tech-stack-and-architecture.md) calls the core asset of the business. Import, connect credentials, change the environment variables — do not rebuild these from scratch for each client.

| Workflow | Service | What it does |
|---|---|---|
| [01 — WhatsApp support assistant](01-whatsapp-support-assistant.json) | A1 | Customer messages on WhatsApp, the assistant answers from the client's documents, unsure questions go to a human and alert the owner |
| [02 — Invoice inbox to accounting](02-invoice-inbox-to-accounting.json) | C1 | Invoices arrive by email, get extracted and checked, then posted to a sheet or a review queue |
| [03 — Speed to lead](03-speed-to-lead.json) | B3 | New enquiry gets a personal reply within a minute, logged to the CRM, owner nudged to follow up |
| [04 — Uptime monitor](04-uptime-monitor.json) | internal | Checks every client service every 15 minutes and messages you when one dies |

## Importing

In n8n: **Workflows → Import from File**, pick the JSON, then before activating:

1. **Connect credentials** on every node that needs them (WhatsApp, Anthropic, Google Sheets, Telegram, IMAP). Credentials are deliberately not in these files — they belong in n8n's encrypted credential store, one set per client ([docs/03](../docs/03-tech-stack-and-architecture.md)).
2. **Set the environment variables** listed below in your n8n container.
3. **Run it once manually** with real data before activating. Every one of these can send something to a customer.

## Environment variables

| Variable | Used by | Example |
|---|---|---|
| `CHATBOT_URL` | 01, 04 | `http://chatbot:3000` |
| `DOCAI_URL` | 02, 04 | `http://document-ai:3100` |
| `OWNER_TELEGRAM_CHAT_ID` | 01, 03, 04 | your Telegram chat id |
| `BOOKKEEPER_TELEGRAM_CHAT_ID` | 02 | the client's bookkeeper |
| `ACCOUNTING_SHEET_ID` | 02 | Google Sheet id |
| `LEADS_SHEET_ID` | 03 | Google Sheet id |
| `BUSINESS_NAME` | 03 | `Acme Dental` |
| `BUSINESS_BLURB` | 03 | a paragraph of services, hours and prices the reply may use |
| `BOOKING_LINK` | 03 | `https://cal.com/acme/20min` |
| `FROM_EMAIL` | 03 | `hello@acmedental.com` |
| `ANTHROPIC_MODEL` | 03 | `claude-sonnet-5` |

## What these deliberately do NOT do

Each of these choices is a guardrail from [docs/05](../docs/05-operations-legal.md), not an oversight:

- **Nothing auto-sends to a customer without a grounded source.** Workflow 01 replies only with what the assistant produced from the client's own documents, and hands off when unsure.
- **No invoice is posted on a guess.** Workflow 02 routes anything failing validation to a human queue, and never posts a document that is not a payable invoice.
- **No lead reply invents anything.** Workflow 03 answers only from the business blurb you configure, and always tells the owner to follow up personally.
- **No silent failures.** Workflow 04 exists because a client discovering the outage before you is how retainers get cancelled.

## Adapting one for a client

1. Duplicate the workflow, rename it `<Client> — <purpose>`.
2. Point it at that client's chatbot instance (`CLIENT_DIR` per container, see [deploy](../deploy/README.md)).
3. Swap sheet ids, phone numbers and chat ids for theirs.
4. Test with their real data before activating.
5. **Export the finished workflow back into this folder** if it taught you something reusable. That habit is what makes the tenth project take a fraction of the first.

## A note on versions

These were written against a recent n8n release. Node `typeVersion` numbers move over time; if a node shows a version warning on import, open it, re-select the operation, and re-save. Everything else — the structure, the branching, the guardrails — carries across versions.
