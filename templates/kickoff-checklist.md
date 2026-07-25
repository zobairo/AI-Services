# Client Kick-off Checklist

Run this on a 45-minute call the day the deposit lands. Everything here prevents a specific problem later — the failure modes in [docs/05](../docs/05-operations-legal.md) almost all trace back to a skipped item.

## Before the call

- [ ] Deposit received (never start without it)
- [ ] Signed agreement filed
- [ ] Shared folder created for their documents
- [ ] Project board column created

## On the call

### 1. Confirm the scope out loud (5 min)
- [ ] Read the behaviours from the proposal back to them, one by one
- [ ] Read the "will not do" list — this is the single best scope-creep vaccine
- [ ] Name the one person who approves decisions: `____________________`

### 2. Agree the acceptance test cases (15 min)
- [ ] Collect 10–20 **real** questions/documents from their actual customers
- [ ] Best source: "Can you forward me the last 20 customer messages you answered?"
- [ ] Write each one down with the expected outcome
- [ ] Get explicit agreement: "If it handles these correctly, it's delivered — agreed?"

### 3. Define the success metric (5 min)
One number you will show in the monthly report:
- [ ] e.g. "% of customer questions handled without a human", "hours/week saved", "leads answered under 5 minutes"
- [ ] Ask what it is worth to them in money — you will need this for the case study and the price rise

### 4. Collect access (10 min)
Do this live on the call. "I'll send it later" becomes a two-week delay.

- [ ] Documents: price list, FAQ, policies, opening hours, service descriptions
- [ ] Channel access: website (or their developer's contact), WhatsApp Business, social accounts
- [ ] System access: calendar, CRM, email, accounting tool — as required by scope
- [ ] API keys needed: `____________________`
- [ ] Whose API account pays for usage — theirs or yours? `____________________`
- [ ] Everything goes into your password manager's client vault, never chat or email

### 5. Data handling agreement (5 min)
- [ ] What personal data will flow through the automation?
- [ ] Where will it be stored, and for how long?
- [ ] Confirm out loud: not used for training, deleted on request, separated from other clients
- [ ] Do they need a signed data processing agreement? If yes, send it this week

### 6. Set expectations (5 min)
- [ ] Delivery date and what happens on it
- [ ] How they contact you (one channel — pick it now: `____________`)
- [ ] Response times per their plan tier
- [ ] "It will sometimes be unsure. When it is, it hands off to your team rather than guessing — that's by design."
- [ ] Book the handover/training call **now**, while the calendar is open

## After the call (same day)

- [ ] Send a written summary: scope, test cases, success metric, dates, who provides what by when
- [ ] Ask for a one-line confirmation reply — this is your paper trail
- [ ] File the test cases as `test-cases.json` in the project folder
- [ ] Add all their documents to the knowledge folder
- [ ] Calendar reminder: chase missing access items in 3 days

## Red flags to watch for on this call

| Signal | What to do |
|---|---|
| Cannot name a decision-maker | Stop. Get one before building. |
| Cannot produce 10 real customer questions | Their volume may be too low for this to pay off — say so honestly. |
| "Can it also just…" three times in one call | Scope creep before day one. Re-read the "will not do" list, quote the extras. |
| Expects it to be perfect / never wrong | Reset expectations now, in writing, or refund the deposit and walk away. |
| Wants it live "by Friday" | Explain the test-case step. Rushing past it is how you get a public failure. |
