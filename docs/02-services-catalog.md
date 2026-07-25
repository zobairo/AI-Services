# Services Catalog

The concrete menu of what you sell. Every service below follows the same shape: a repetitive, expensive human task → an automation with an AI step → measurable saved hours. Prices reference the ranges in [Business Model & Pricing](01-business-model-and-pricing.md).

## 1. AI customer-support chatbot

**What it is:** A chat assistant on the client's website and WhatsApp/Telegram that answers customer questions using the client's own documents, prices, and policies (RAG), and hands off to a human when it is unsure.
**Who buys it:** E-commerce stores, clinics, service businesses — anyone drowning in the same 20 questions.
**Tools:** Claude API + vector store (Supabase pgvector) + n8n + WhatsApp Business API / Telegram Bot API + web chat widget.
**Delivery time:** 1–2 weeks. **Price:** $500–1,500 starting; $2,000–5,000 established. Retainer: almost always.

## 2. Document processing automation

**What it is:** Incoming invoices, contracts, forms, or CVs get read automatically, key data extracted into structured records (sheet, CRM, accounting tool), with a human review step for low-confidence cases.
**Who buys it:** Accounting firms, law firms, logistics companies, recruiters, property managers.
**Tools:** Claude API (vision + structured output), n8n, email/drive triggers, Google Sheets/Airtable/CRM APIs.
**Delivery time:** 1–3 weeks. **Price:** $750–2,000 starting; $2,500–7,000 established.

## 3. Lead generation & outreach automation

**What it is:** Automatically find target companies, enrich contact data, and draft personalized outreach emails for the client's team to review and send. (Draft-for-review, not mass auto-send — protects deliverability and reputation.)
**Who buys it:** Agencies, B2B services, recruiters, real-estate brokers.
**Tools:** n8n, enrichment APIs (e.g. Apollo-style tools), Claude API for research + personalization, CRM/email integration.
**Delivery time:** 1–2 weeks. **Price:** $500–1,500 starting; $2,000–5,000 established.

## 4. Content automation pipeline

**What it is:** A pipeline that turns the client's raw inputs (product data, past posts, a weekly voice note) into drafted social posts, product descriptions, or blog outlines in the client's voice, queued for approval.
**Who buys it:** E-commerce brands, marketing agencies (as white-label), real-estate agencies (listing descriptions).
**Tools:** n8n, Claude API with a tuned style prompt library, CMS/social scheduling APIs.
**Delivery time:** 1 week. **Price:** $500–1,200 starting; $1,500–4,000 established.

## 5. Internal AI assistant / knowledge base

**What it is:** "ChatGPT, but it knows our company." Staff ask questions and get answers grounded in internal docs, SOPs, and policies — with sources cited, access-controlled.
**Who buys it:** Companies with 20+ employees and messy shared drives.
**Tools:** Claude API + pgvector RAG + Slack/Teams bot or simple web UI (Supabase auth).
**Delivery time:** 2–3 weeks. **Price:** $1,000–2,500 starting; $3,000–8,000 established.

## 6. Workflow automation with AI steps

**What it is:** The glue work: email triage and drafting, CRM hygiene (log calls, update deals), weekly report generation, meeting-notes-to-tasks. Classic automation where the AI step (classify, summarize, draft) makes previously impossible automations possible.
**Who buys it:** Any office team. Often the second sale to an existing client.
**Tools:** n8n (or the client's existing Make/Zapier), Claude API, whatever the client already uses.
**Delivery time:** days to 2 weeks. **Price:** $300–1,000 per workflow starting; bundles later.

## 7. Custom AI agents

**What it is:** Multi-step autonomous flows: generate a quote from a request email, book and confirm appointments, screen CVs against a job spec and schedule interviews. Higher risk, higher price — always with human checkpoints on important actions.
**Who buys it:** Clients you already work with, after trust exists.
**Tools:** Claude API (agentic tool use), n8n or custom TypeScript/Python, client system APIs.
**Delivery time:** 2–6 weeks. **Price:** $1,500–3,000 starting; $4,000–12,000 established.

## What to lead with as a beginner

Lead with **#1 (support chatbot)** and **#6 (workflow automation with AI steps)**:

- **Fastest to demo.** You can build a working demo on a prospect's real website content in under an hour — the demo-first sales motion in [Go-To-Market](04-go-to-market.md) depends on this.
- **Obvious ROI.** "Answers customers at 3am" and "saves 10 hours a week" need no explanation.
- **Naturally recurring.** Both need hosting, monitoring, and content updates → retainer conversion is easy.
- **Template-friendly.** By project #3 you are reusing 70% of previous work while charging the same or more.

Add **#2 (document processing)** as your third service once you have one niche with document-heavy pain (accounting, legal, recruitment).

## What we do NOT do (say this early and often)

- **No custom model training / fine-tuning projects.** Prompt + RAG solves 95% of small-business cases at 5% of the cost.
- **No "build me an AI startup" product development.** You sell automations for operating businesses, not venture engineering.
- **No fully autonomous actions on money, legal, or medical decisions.** AI drafts, humans approve. This is a safety line and a liability line — see [Operations & Legal](05-operations-legal.md).
- **No scraping or outreach that violates platform terms or spam laws.** Draft-for-review outreach only, opt-out honored.
- **No unlimited free changes.** Scope is written; changes are welcome and billed.
