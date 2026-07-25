# Business Model & Pricing

This plan assumes a solo, technical founder starting from zero, selling AI automation services to small and mid-size businesses. Goal: reach recurring monthly revenue, not just one-off gigs. This doc covers the core service model and prices; the full six-stream revenue map is in the [Masterplan](00-masterplan.md), and the complete service menu with per-service prices is in the [Services Catalog](02-services-catalog.md).

## The three core revenue models

| Model | What it is | Pros | Cons |
|---|---|---|---|
| One-off projects | Build an automation, hand it over, get paid once | Fast cash, easy to sell | Income resets to zero every month |
| Monthly retainer | You build it AND run it: hosting, monitoring, fixes, improvements | Predictable income, compounding | Needs trust; you carry support duty |
| Productized service | Fixed scope, fixed price, repeatable package (e.g. "Support chatbot in 10 days — $1,500") | Easy to market, easy to deliver, templates reused | Less room for custom work |

**Recommended mix:** sell a **productized entry offer** to get in the door, charge a **build fee** for the project, then convert every client to a **monthly retainer**. The retainer is the real business. A client who pays $200/month for 2 years is worth more than most one-off projects — and automations genuinely need maintenance (APIs change, prompts drift, volumes grow), so the retainer is honest value, not a trick.

## Price ranges (USD)

These are realistic ranges for freelance/small-agency AI automation work. Local markets differ; treat them as anchors, not rules. The lead services:

| Service | Starting out (first ~3 months) | After reputation (6+ months) |
|---|---|---|
| AI support chatbot (site + WhatsApp, RAG on client docs) | $500 – $1,500 | $2,000 – $5,000 |
| AI voice receptionist (inbound calls, booking) | $1,000 – $2,500 | $3,000 – $8,000 |
| Document processing automation (invoices, forms → data) | $750 – $2,000 | $2,500 – $7,000 |
| Lead-gen / outreach automation | $500 – $1,500 | $2,000 – $5,000 |
| Internal AI assistant (company knowledge base) | $1,000 – $2,500 | $3,000 – $8,000 |
| Custom AI agent workflow (multi-step, e.g. quoting, booking) | $1,500 – $3,000 | $4,000 – $12,000 |
| AI audit / discovery (paid entry offer) | $150 – $500 | $500 – $1,500 |

The **full menu — 30+ chargeable services** with per-service prices — is the master table in the [Services Catalog](02-services-catalog.md). Niche bundles with package pricing (setup $1,500–8,000 + monthly $300–900) are in [Industry Packages](08-industry-packages.md).

**Monthly retainer tiers** (also used in [Operations — SLA tiers](05-operations-legal.md)):

| Tier | Price | Included |
|---|---|---|
| Basic | $100 – $150/mo | Hosting, monitoring, bug fixes, LLM usage up to an agreed allowance |
| Growth | $250 – $350/mo | Basic + 2 hrs/mo of changes, monthly report, priority response |
| Scale | $500 – $800/mo | Growth + 5 hrs/mo improvements, new small automations, same-day response |

LLM/API usage above the allowance is passed through **at cost + 20–30% margin** — never absorb unlimited token costs on a fixed fee. Voice minutes (calls handled by AI receptionists) are usage too: billed at cost + 30–50%.

## Beyond services: the other revenue streams

Services and retainers carry Phase 1. From Phase 2 onward, these streams stack on top (details per service in [Catalog category F](02-services-catalog.md), timing in the [Scaling Roadmap](07-scaling-roadmap.md)):

| Stream | Pricing | Why it's good money |
|---|---|---|
| Paid AI audits (F1) | $150–1,500 one-off, credited against the build | You get paid to do sales discovery |
| Corporate training workshops (F3) | $300–3,000/day | ~90% margin, reused materials, generates build leads |
| AI strategy retainers (F2) | $300–1,500/mo | Advisor seat; no delivery cost |
| Automation rescue (F4) | Diagnosis fee + repair quote | Endless demand, instant trust, converts to retainers |
| White-label for agencies (F5) | 60–70% of list price | Zero acquisition cost; recurring deal flow |
| Automation blueprints (F6) | $50–500 per product | ~100% margin on work already done (Phase 4) |

## How to price

- **Price the outcome, not your hours.** If a chatbot saves a clinic one receptionist's afternoon every day, that is worth hundreds of dollars a month to them. What it costs you to build is irrelevant to the client.
- **Hourly is a trap.** You get faster with every project (templates!), so hourly pricing punishes your own improvement. Quote fixed prices per scope.
- **Estimate scope simply:** Small = one workflow, one integration, known pattern. Medium = 2–3 integrations or RAG. Large = multi-step agent, human-in-the-loop, custom UI. Multiply your expected days by a day rate you never say out loud (start ~$150–250/day equivalent, raise it every 2–3 projects).
- **Anchor against the human cost.** "This replaces ~15 hours/week of manual work. At $10/hour that's $600/month. The automation costs $1,200 once plus $200/month." Easy yes.

## Financial targets (solo founder)

The math: **clients × average deal**. Keep targets honest.

| Period | Target | How |
|---|---|---|
| Months 1–3 | $1,000 – $3,000 total | 2–4 small paid projects (cheap-but-not-free), first testimonials |
| Months 4–6 | $2,000 – $4,000/month | 1–2 projects/month at better prices + first 3–5 retainers |
| Months 7–12 | $5,000 – $10,000/month | ~$1.5–3k MRR from 8–12 retainers + 1–2 mid-size builds/month |
| Year 2 | $150k – $250k total (base case) | Contractors + packages + training + white-label — full scenarios in [Financial Projections](09-financial-projections.md) |

If month 3 ends with zero paying clients, the problem is almost always the niche or the outreach volume, not the technology — see [Go-To-Market](04-go-to-market.md) and the go/no-go checkpoints in the [Roadmap](06-roadmap-90-days.md).

## Getting paid

- **50% deposit before work starts, always.** Remainder on delivery (defined as: automation passes the agreed test cases on real data — see [Operations](05-operations-legal.md)). No deposit, no calendar slot.
- **Tools:** Stripe for cards and retainer subscriptions (if available in your country), **Wise** and **Payoneer** as fallbacks for international transfers, PayPal only if the client insists (fees + dispute risk).
- **Retainers as subscriptions.** Put every retainer on an auto-charging Stripe subscription or standing invoice. Chasing manual payments every month kills solo founders.
- **Currency:** quote in USD or EUR for international clients; local currency for local clients.
- **Late payments:** pause the automation's support (not the automation itself, at first) after 14 days overdue; say this in the contract so it is policy, not drama.

## Common pricing mistakes

1. **Underpricing forever.** Raise prices every 2–3 successful projects. If nobody ever says "too expensive," you are too cheap.
2. **Free pilots.** Do discounted pilots for testimonials, never free ones. Free clients are the most demanding and never convert.
3. **Unlimited revisions.** Two revision rounds included; more is billed. Put it in writing.
4. **Absorbing API costs.** Always meter LLM usage per client and pass overages through.
5. **One giant client.** If one client is >40% of revenue, treat finding the next client as urgent even when busy.
