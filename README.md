# AI-Services — AI Automation Service Provider

The complete plan for building an **AI automation company** — starting solo, from zero — **plus the working starter kit to run it**: a live chatbot demo, the sales site, client paperwork, outreach scripts, and a quoting tool.

**Read the plan → [docs/00-masterplan.md](docs/00-masterplan.md)** · **Run the demo → [demo/chatbot](demo/chatbot)**

```bash
cd demo/chatbot && npm run ingest && npm start   # working AI assistant, no API key needed
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

Plus recurring: **retainers $100–800/mo**, subscription plans, usage margins on LLM tokens and voice minutes, 10–30% affiliate commissions.

## Headline targets

| Milestone | Base case |
|---|---|
| Day 90 | $2–5k/mo run rate, 3–5 retainers |
| Month 12 | ~$10k/mo run rate, $2.8–3.6k MRR · year-1 revenue $60–90k |
| Month 24 | $150–250k year-2 revenue, $8–12k MRR, ≥55% recurring |
| Month 36 | $300–450k year-3 revenue via the chosen Phase-5 path |

Conservative and ambitious scenarios, unit economics, and the assumptions behind every number: [Financial Projections](docs/09-financial-projections.md).

## The plan

| Doc | What's inside |
|---|---|
| [00 — Masterplan](docs/00-masterplan.md) | Vision, 8 revenue streams, 5 phases, operating principles |
| [01 — Business Model & Pricing](docs/01-business-model-and-pricing.md) | Price lists, retainer tiers, subscriptions, all revenue streams, getting paid |
| [02 — Services Catalog](docs/02-services-catalog.md) | The full menu: 52 services with prices + rollout order |
| [03 — Tech Stack & Architecture](docs/03-tech-stack-and-architecture.md) | Claude + n8n + Supabase core, voice/commerce/content extensions, cost math, isolation & safety |
| [04 — Go-To-Market & Sales](docs/04-go-to-market.md) | Niches, demo-first selling, channels, pipeline math, first-3-clients playbook |
| [05 — Operations, Legal & Clients](docs/05-operations-legal.md) | Contracts, data protection, onboarding, delivery, SLAs, failure modes |
| [06 — 90-Day Roadmap (Phase 1)](docs/06-roadmap-90-days.md) | Week-by-week checklists to first revenue |
| [07 — Scaling Roadmap (Phases 2–5)](docs/07-scaling-roadmap.md) | Months 4–36: full catalog, team, packages, products, the year-3 decision |
| [08 — Industry Packages](docs/08-industry-packages.md) | Twelve niche bundles with package pricing |
| [09 — Financial Projections](docs/09-financial-projections.md) | 36-month scenarios, unit economics, sensitivities |

## The starter kit — what's already built

The plan's Days 1–14 deliverables, ready to use:

| What | Where | Use it for |
|---|---|---|
| **Working AI chatbot** (service A1) | [`demo/chatbot/`](demo/chatbot) | Your demo #1 and the codebase for real client builds. Runs with zero dependencies; no API key needed for mock mode. Includes an acceptance-test suite. |
| **Sales website** | [`site/index.html`](site/index.html) | Your one-page site. Edit the CONFIG block at the bottom, then deploy — no build step. |
| **Quote calculator** | [`tools/quote.js`](tools/quote.js) | Price any service or package with margin and cost-of-goods math built in. |
| **Proposal template** | [`templates/proposal.md`](templates/proposal.md) | Send within 24h of every call. |
| **Service agreement** | [`templates/service-agreement.md`](templates/service-agreement.md) | Scope, IP, AI disclaimers, liability — review once with a local professional, reuse forever. |
| **Kick-off checklist** | [`templates/kickoff-checklist.md`](templates/kickoff-checklist.md) | The 45-minute call that prevents most project failures. |
| **Monthly report** | [`templates/monthly-report.md`](templates/monthly-report.md) | Your churn-prevention and upsell engine. |
| **Outreach scripts** | [`sales/outreach-scripts.md`](sales/outreach-scripts.md) | Cold email, follow-ups, discovery call, objection handling. |
| **Trackers** | [`trackers/`](trackers) | Weekly KPIs and the sales pipeline. |

```bash
# See the demo working (mock mode — no API key required)
cd demo/chatbot
npm run ingest && npm start          # http://localhost:3000
npm test                             # acceptance tests
npm run ask -- "do you take Delta Dental?"

# Real answers from Claude
export ANTHROPIC_API_KEY=sk-ant-...

# Price a deal
node tools/quote.js A1 --chats 3000
node tools/quote.js --package E12
node tools/quote.js --list
```

## How to use this repo

1. Read [00 — Masterplan](docs/00-masterplan.md), then pick your niche with [04 — Go-To-Market](docs/04-go-to-market.md) — every other decision depends on it.
2. Run the [chatbot demo](demo/chatbot), then swap `knowledge/` for a real prospect's website content. That is your first demo asset, and the demo-first motion is what actually closes deals.
3. Execute [06 — the 90-Day Roadmap](docs/06-roadmap-90-days.md) checklist by checklist. **Sell only the 2 lead services in Phase 1** — the big catalog switches on gradually via the [rollout order](docs/02-services-catalog.md).
4. At each phase gate in [07 — Scaling Roadmap](docs/07-scaling-roadmap.md), check the numbers against [09 — Projections](docs/09-financial-projections.md) and move forward on data, not feelings.
5. Update the docs and templates as reality teaches you — this is an operating manual, not a museum piece.

> All prices and targets are planning estimates for SMB markets in 2026; adjust to your local market. The legal/ops content is practical guidance, not legal advice.
