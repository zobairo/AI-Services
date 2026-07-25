# Operations, Legal & Client Management

Boring on purpose. This is what keeps retainers renewing and keeps you out of disputes. **Caveat: this is practical guidance, not legal advice — have a local professional check your contract template once; laws differ by country.**

## The contract (one reusable template)

Every project, even for friends, gets a short signed agreement covering:

- **Scope:** what the automation does, listed as concrete behaviors ("answers questions from the provided FAQ documents"; "extracts supplier, date, total, VAT from PDF invoices"). What's not listed is not included.
- **Deliverables & acceptance:** delivery = the automation passes the agreed **test cases on real client data** (10–20 examples defined at kickoff). Not "when the client feels done."
- **Revisions:** two rounds included; further changes billed at an hourly/day rate or under the retainer.
- **Payment:** 50% deposit to start, 50% on acceptance; retainers auto-charged monthly ([Pricing](01-business-model-and-pricing.md)).
- **IP:** the client owns their workflow configuration, prompts written specifically for them, and their data. You keep ownership of your generic templates, snippets, and know-how, and the right to reuse them. This clause is what makes the template library legal to resell.
- **AI disclaimer:** AI outputs can be wrong; the system includes review mechanisms; the client is responsible for reviewing outputs used in critical decisions (financial, legal, medical). You commit to diligence (test cases, confidence gates), not to perfection.
- **Liability cap:** limited to fees paid in the last 3–6 months. Standard, and vital in AI work.
- **Termination & offboarding:** 30-day notice on retainers; on exit the client gets their workflow exports, credentials handover, and data deletion confirmation.

E-sign with any simple tool; a signed PDF over email also works in most places.

## Data protection basics

- **Know what data you touch.** If EU customers' personal data flows through your automations, GDPR applies regardless of where you sit: have a simple **data processing agreement** (annex to your contract), process only for the client's purposes, delete on request/offboarding.
- **API policies matter and are a selling point:** major LLM API providers (Anthropic, OpenAI) do not train on business API data by default. Put this in your proposals — it answers the #1 objection ("will our data train the AI?").
- **Practical hygiene:** client data stays in that client's schema/instance ([architecture](03-tech-stack-and-architecture.md)); no client documents on your personal laptop long-term; mask PII in logs; use the minimum data the automation needs.
- **Never train or fine-tune on client data.** You don't need to, and promising you won't closes deals.

## Client onboarding checklist

- [ ] Kickoff call (45 min): confirm scope, define the 10–20 acceptance test cases, agree success metric (e.g. "80% of tickets answered without human help", "invoice entry time under 1 minute")
- [ ] Collect access: accounts, API keys, documents, channel access (WhatsApp/site/CRM) — into the credentials vault, never chat or email
- [ ] Confirm data handling: what data, where stored, who can see it, deletion policy
- [ ] Write the one-page scope doc; get a 👍 in writing
- [ ] Invoice deposit; start on payment

## Delivery process (small project, ~2 weeks)

| Stage | Time-box | Output |
|---|---|---|
| Discovery | 1–2 days | Scope doc + test cases + quote |
| Build | 3–7 days | Working automation on staging data |
| Test with real data | 2–3 days | Test-case results shared with client |
| Handover | 1 day | Live deployment, 30-min training call, runbook (1 page: what it does, how to check it, who to call) |
| Support | 2 weeks included | Bug fixes; then retainer takes over |

**Bug vs. new scope:** a bug is "doesn't do what the scope doc says." Everything else is a change request — priced, never resented. Saying this at kickoff prevents 90% of scope creep.

## Retainer SLA tiers (must match the pricing tiers)

| | Basic ($100–150) | Growth ($250–350) | Scale ($500–800) |
|---|---|---|---|
| Monitoring & uptime | ✔ | ✔ | ✔ |
| Bug-fix response | 2 business days | 1 business day | Same day |
| Included change hours | 0 | 2 h/mo | 5 h/mo |
| Monthly report | — | ✔ | ✔ + review call |
| LLM usage allowance | Agreed cap; overage at cost +20–30% | same | same |

The monthly report is 15 minutes of your time and the single best churn-prevention tool: automations run, items processed, hours saved estimate, issues fixed, one improvement idea.

## Tools for running it solo

- **Proposals/contracts:** one good template + e-signature tool
- **Project tracking:** one Kanban board (anything works); one board column per delivery stage
- **Secrets:** a proper password manager with per-client vaults; n8n credential store for runtime
- **Time tracking:** track delivery hours per client for 2 months — it exposes underpriced retainers ([Pricing](01-business-model-and-pricing.md))
- **Bookkeeping:** separate business bank account from day 1; a simple ledger or local accountant quarterly

## Common failure modes

| Failure | Prevention |
|---|---|
| Scope creep | Written scope + "bug vs change" rule + friendly firmness |
| Unclear success criteria | Acceptance test cases defined at kickoff, no exceptions |
| Client expects magic AGI | Demo real behavior early; state limits in the proposal; confidence gates + human review in every flow |
| Hallucination incident | Grounded RAG answers only, "I don't know" fallback, human approval on outbound content, liability clause |
| Churn after handover | Retainer pitch at delivery ("who maintains this?"), monthly report, improvement ideas every quarter |
| You become the bottleneck | Runbooks per client, template library, raise prices until demand matches your hours |
