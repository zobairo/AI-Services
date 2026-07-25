# Financial Projections

Scenario math for the first 24 months. All numbers are **planning estimates, not promises** — solo-founder service businesses swing on sales skill, niche, and market. The model is deliberately simple: `revenue = clients × average deal + MRR base`, checked against delivery capacity.

## Core unit economics (recap)

| Unit | Revenue | Direct cost | Margin |
|---|---|---|---|
| Small build (A1, D1, C4…) | $500–1,500 (→ $2–5k later) | your time (2–6 days) + ~$0 infra | ~90%+ cash margin solo |
| Retainer client (Growth tier) | $250–350/mo | $35–50 infra + LLM ([03](03-tech-stack-and-architecture.md)) + ~1–2 h/mo | 60–75% |
| Voice client (A2) | $200–600/mo + minutes | platform + telephony + tokens ≈ $0.06–0.15/min, billed at cost +30–50% | 55–70% |
| Package client (E1–E5) | $1.5–8k setup + $300–900/mo | shared templates → falling per-client cost | 60–75% at scale |
| Workshop day (F3) | $300–3,000/day | your day + reused materials | ~90% |
| Blueprint (F6) | $50–500 | ~$0 marginal | ~100% |
| White-label deal (F5) | 60–70% of list | same delivery cost | thinner but zero acquisition cost |

**Capacity reality (solo):** ~2 small builds + retainer care + selling per month sustainably, or 1 mid-size package. This caps Phase 1–2 revenue and is exactly why contractors appear in Phase 3.

## Year 1 (Phases 1–2)

Assumptions: base case = the [90-day roadmap](06-roadmap-90-days.md) hits its gates, second price raise in month 4–5, VA at month 6–7, voice + packages live by month 9. Retainer churn assumed ~3%/mo (good monthly reports keep it low).

| | Conservative | Base | Ambitious |
|---|---|---|---|
| New clients/month (avg) | 1 | 1.5–2 | 3 |
| Avg build fee (blended, year avg) | $900 | $1,400 | $2,200 |
| Retainer clients at month 12 | 6 | 10–12 | 18 |
| MRR at month 12 | $1,200 | $2,800–3,600 | $6,500 |
| Month-12 run rate | ~$6k/mo | ~$10k/mo | ~$18k/mo |
| **Year-1 total revenue** | **$30–40k** | **$60–90k** | **$120k+** |

Year-1 costs (base): infra $50–150/mo growing with clients · tools/subscriptions $50–100/mo · VA from month 6–7 $400–800/mo · ads/none. **Costs stay under 15% of revenue** — year 1 profitability is about selling, not spending.

## Year 2 (Phases 3–4)

Assumptions: 1–2 contractor builders (cost ≈ 30–40% of the project prices they deliver), packages lead, 2–3 agency partners, blueprints launch late in the year.

| | Conservative | Base | Ambitious |
|---|---|---|---|
| Retainer clients at month 24 | 12 | 20–25 | 40 |
| MRR at month 24 | $3.5k | $8–12k | $20k |
| Builds+packages/month (team) | 2 | 3–4 | 6+ |
| Products+training share | 5% | 10–20% | 25% |
| **Year-2 total revenue** | **$80–120k** | **$150–250k** | **$350k+** |
| Net margin after contractors/VA/infra | ~60% | ~55% | ~50% |

The margin *decreases* as revenue grows — that's normal (you're buying leverage). The MRR share must *increase*: **target ≥55% of revenue recurring by month 24** (base case). Recurring share, not top line, is what makes the business durable and sellable.

## Sensitivity — what actually moves the numbers

1. **Close rate × outreach volume.** The whole model sits on ~100 touches → 1 client cold, better warm ([04](04-go-to-market.md)). Half the volume = half the clients. Nothing downstream fixes an empty pipeline.
2. **Retainer conversion.** Base assumes ~60–70% of build clients take a retainer. At 30%, month-12 MRR roughly halves → fix the handover pitch, not the price.
3. **Churn.** 3%/mo vs 8%/mo is the difference between compounding and a leaky bucket. The monthly report ([05](05-operations-legal.md)) is the cheapest churn insurance that exists.
4. **Pricing discipline.** Skipping the scheduled raises ([07](07-scaling-roadmap.md)) quietly costs ~30% of year-2 revenue.
5. **Usage margins.** Unmetered LLM/voice usage can silently eat retainer margin — allowances + overage billing are mandatory, not optional ([01](01-business-model-and-pricing.md)).

## Break-even and safety

- **Break-even is nearly immediate** (month 1–2 in every scenario): costs start near zero and the deposit policy means builds are cash-positive before work starts.
- **Personal runway rule:** if you need $X/month to live, keep 3–6 months of X saved before going full-time; until then, run Phase 1 alongside other income — the roadmap's daily rhythm fits ~4–5 focused hours/day.
- **Warning line:** if month-6 run rate is below the conservative column despite hitting outreach volume targets, the problem is offer/niche — go back to [04](04-go-to-market.md) and change the niche or the outcome sentence before changing anything else.

## Review cadence

- **Weekly:** the 5 KPIs from the [90-day roadmap](06-roadmap-90-days.md) (touches, calls, proposals, revenue, MRR).
- **Monthly:** margin per client, delivery hours per client, LLM/voice cost per client, churn.
- **Quarterly:** scenario check against this doc — move the plan to the column reality supports, and update these tables rather than letting them rot.
