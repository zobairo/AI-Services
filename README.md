# AI-Services — AI Automation Service Provider

A complete plan for building an **AI automation company** from zero — **plus the working software and paperwork to run it**: two live service demos, per-client scaffolding, a deployable stack, n8n workflow templates, the sales site, and every client document you will need.

**Read the plan → [docs/00-masterplan.md](docs/00-masterplan.md)** · **Run it → below**

```bash
npm test                                         # every check in the repo
cd demo/chatbot && npm run ingest && npm start   # a working AI assistant, no API key needed
cd demo/document-ai && npm start                 # invoices in, accounting data out
node tools/quote.js --package E2                 # price a real deal
```

## The business in one paragraph

Small and mid-size businesses drown in repetitive communication and document work. You sell them **AI employees** — systems that answer, write, process, and follow up 24/7 — as outcomes: "every call answered", "every lead contacted in 60 seconds", "invoices enter accounting by themselves". Delivery runs on a boring, reusable stack (Claude API + self-hosted n8n + Supabase + a voice platform). Get in the door with a paid AI audit or a flagship service, charge a fixed build fee, then convert every client to a **monthly retainer or a flat-fee AI-Employee subscription**. Grow in five phases: solo provider → full catalog → boutique agency with contractors → productized packages and blueprints → scale, spin off a product, or hold a lean profitable boutique. The recurring base is the business; the template library is the asset.

## What's for sale

**52 chargeable services in 6 categories + 12 industry packages** ([full catalog](docs/02-services-catalog.md)):

| Category | Examples | Build fees |
|---|---|---|
| A — Customer-facing AI (9) | Support chatbots, **voice receptionists**, WhatsApp commerce, missed-call rescue, booking agents, review automation | $400 – $8,000 |
| B — Marketing & growth (12) | Lead-gen, speed-to-lead, content/SEO factories, product visuals, podcast & video pipelines, translation | $300 – $6,000 |
| C — Back office & documents (12) | Invoice processing, contract intake, CV screening, collections, proposals & tenders, compliance Q&A | $400 – $8,000 |
| D — Internal AI & sales ops (10) | Knowledge assistants, CRM copilots, **managed AI SDR**, forecasting alerts, site+assistant bundles, custom agents | $300 – $12,000 |
| E — Industry packages (12) | Real-estate · clinic · e-commerce · restaurant · law firm · gym · hotel · dealership · accounting · education · trades · agency white-label | $1,500 – $8,000 setup + $300–900/mo |
| F — Consulting, subscriptions & products (9) | Paid audits, training days, **AI-Employee plans ($390–990/mo)**, rescue projects, blueprints, course & community, affiliate income | $150 – $3,000/day · $50–500/product |

Plus recurring: **retainers $100–800/mo**, subscription plans, usage margins on tokens and voice minutes, 10–30% affiliate commissions.

## Headline targets

| Milestone | Base case |
|---|---|
| Day 90 | $2–5k/mo run rate, 3–5 retainers |
| Month 12 | ~$10k/mo run rate, $2.8–3.6k MRR · year-1 revenue $60–90k |
| Month 24 | $150–250k year-2 revenue, $8–12k MRR, ≥55% recurring |
| Month 36 | $300–450k year-3 revenue via the chosen Phase-5 path |

Conservative and ambitious scenarios, unit economics, and every assumption: [Financial Projections](docs/09-financial-projections.md).

---

# The plan

| Doc | What's inside |
|---|---|
| [00 — Masterplan](docs/00-masterplan.md) | Vision, 8 revenue streams, 5 phases, operating principles |
| [01 — Business Model & Pricing](docs/01-business-model-and-pricing.md) | Price lists, retainer tiers, subscriptions, all revenue streams, getting paid |
| [02 — Services Catalog](docs/02-services-catalog.md) | The full menu: 52 services with prices + rollout order |
| [03 — Tech Stack & Architecture](docs/03-tech-stack-and-architecture.md) | The stack, reference architecture, per-client cost math, isolation & safety |
| [04 — Go-To-Market & Sales](docs/04-go-to-market.md) | Niches, demo-first selling, channels, pipeline math, first-3-clients playbook |
| [05 — Operations, Legal & Clients](docs/05-operations-legal.md) | Contracts, data protection, onboarding, delivery, SLAs, failure modes |
| [06 — 90-Day Roadmap (Phase 1)](docs/06-roadmap-90-days.md) | Week-by-week checklists to first revenue |
| [07 — Scaling Roadmap (Phases 2–5)](docs/07-scaling-roadmap.md) | Months 4–36: team, packages, products, the year-3 decision |
| [08 — Industry Packages](docs/08-industry-packages.md) | Twelve niche bundles with package pricing |
| [09 — Financial Projections](docs/09-financial-projections.md) | 36-month scenarios, unit economics, sensitivities |

# The starter kit

Everything below is built, tested, and runs today. `npm test` checks all of it.

### Software

| What | Where | Notes |
|---|---|---|
| **Demo #1 — AI chatbot** (service A1) | [`demo/chatbot/`](demo/chatbot) | RAG over the client's documents, confidence gate, source citations, 14 acceptance tests. Zero dependencies; runs without an API key. |
| **Demo #2 — document processing** (service C1) | [`demo/document-ai/`](demo/document-ai) | Invoices → validated accounting data, human review queue, field-accuracy eval, HTTP API. |
| **New-client scaffolding** | [`scripts/new-client.js`](scripts/new-client.js) | A client is a folder, not a code change. Six industry presets with their own guardrails. |
| **n8n workflow templates** | [`n8n-templates/`](n8n-templates) | WhatsApp assistant · invoice inbox → accounting · speed-to-lead · uptime monitor. |
| **Deployment stack** | [`deploy/`](deploy) | Docker Compose: Caddy (auto-HTTPS) + n8n + services, per-client isolation, backup & security checklists. |
| **Quote calculator** | [`tools/quote.js`](tools/quote.js) | Prices any service or package with cost-of-goods and margin math. |

### Selling

| What | Where |
|---|---|
| **Sales website** | [`site/index.html`](site/index.html) — one page, self-contained, edit the CONFIG block and deploy |
| **Outreach scripts** | [`sales/outreach-scripts.md`](sales/outreach-scripts.md) — cold email, follow-ups, discovery call, objection handling |
| **Profile & demo videos** | [`sales/profile-and-portfolio.md`](sales/profile-and-portfolio.md) — Upwork copy and shot-by-shot demo scripts |

### Client paperwork

| What | Where |
|---|---|
| **Discovery questionnaire** | [`templates/discovery-questionnaire.md`](templates/discovery-questionnaire.md) — find the expensive process, qualify the buyer |
| **Proposal** | [`templates/proposal.md`](templates/proposal.md) — one page, sent within 24h |
| **Service agreement** | [`templates/service-agreement.md`](templates/service-agreement.md) — scope, IP, AI disclaimers, liability |
| **Kick-off checklist** | [`templates/kickoff-checklist.md`](templates/kickoff-checklist.md) — the call that prevents most project failures |
| **Monthly report** | [`templates/monthly-report.md`](templates/monthly-report.md) — churn prevention and upsell engine |
| **Case study** | [`templates/case-study.md`](templates/case-study.md) — what you trade the first discount for |
| **Trackers** | [`trackers/`](trackers) — weekly KPIs and sales pipeline |

---

## Your first week, concretely

```bash
# 1. See both demos working, then read the plan
npm test
cd demo/chatbot && npm run ingest && npm start

# 2. Pick a niche — docs/04 has six with their painful process named
#    Everything else depends on this decision.

# 3. Build a demo on a real prospect's content (an hour's work)
node scripts/new-client.js prospect-name "Their Business" --industry clinic
#    fill clients/prospect-name/knowledge/ from their website, then:
CLIENT_DIR=clients/prospect-name npm --prefix demo/chatbot run ingest
CLIENT_DIR=clients/prospect-name npm --prefix demo/chatbot start

# 4. Record it (sales/profile-and-portfolio.md has the shot list),
#    send it to them, and start the daily outreach rhythm in docs/06.
```

Then work the [90-day roadmap](docs/06-roadmap-90-days.md) checklist by checklist. **Sell only the two lead services in Phase 1** — the full catalog switches on gradually via the [rollout order](docs/02-services-catalog.md).

## Honest limits

- **The demos are reference builds, not products.** Retrieval is lexical (BM25), not embedding-based; document input is text, not PDFs. Both READMEs document exactly when to upgrade and to what.
- **Deployment is untested on real hardware.** The compose stack is structurally validated but has not been booted on a live VPS — expect the usual first-deploy shakeout, and follow the security checklist before any client traffic.
- **Sample data is fictional.** Northside Dental, the suppliers, all of it. Real prices and policies come from your client.
- **The legal templates are a starting point, not legal advice.** One review by a professional in your country covers every future client.
- **Prices and projections are planning estimates** for SMB markets in 2026. Adjust to your market, and update the docs as reality teaches you.
