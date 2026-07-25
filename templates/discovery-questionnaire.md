# Discovery Questionnaire

Send before the call, or work through it live. The goal is not to gather requirements — it is to find **one process that costs them real money**, and to learn whether they can actually buy.

Most of these questions do double duty: the answers become the [proposal](proposal.md) and the acceptance test cases in the [kick-off](kickoff-checklist.md).

## About the business

1. What does the business do, and how many people work there?
2. Who normally answers customers — phone, email, WhatsApp, social?
3. Roughly how many customer messages or calls come in per week?
4. What are your busiest hours, and what happens to enquiries outside them?

## Finding the expensive process

5. **What job does your team do every week that feels like a waste of a human being?**
   *(The single most useful question in this document. Let them talk.)*
6. How long does that take, per week, and who does it?
7. What happens when that person is off sick or on holiday?
8. Walk me through it step by step — where does the information come from, where does it end up?
9. What goes wrong with it today? What is the most annoying failure?

## Sizing the money

10. If this took an hour a week instead of ten, what would that person do instead?
11. Have you lost customers because of slow replies or missed calls? Any idea how many?
12. What is a new customer worth to you, roughly?
13. Have you considered hiring someone for this? What would that cost?

*These four questions are how you price on value rather than on hours ([docs/01](../docs/01-business-model-and-pricing.md)).*

## The systems

14. What tools do you already use — calendar, CRM, accounting, inbox, website platform?
15. Where does customer information live today?
16. Is there anything you are locked into, or anything you are planning to change soon?
17. Who looks after your website?

## Data and rules

18. Does this process touch personal or sensitive data?
19. Is there anything an assistant must **never** say or do on your behalf?
    *(Their answer becomes the guardrails in `client.json`.)*
20. Who has to approve things before they go out to a customer?

## Buying signals

21. Who else needs to agree to this?
22. Is there a budget for it, or would this be new spending?
23. Is there a deadline or event driving this — busy season, a member of staff leaving, a system changing?
24. If we agreed today, when would you want it live?

## Their questions

25. What worries you about using AI for this?
    *(Answer honestly. The objection handling in [outreach-scripts.md](../sales/outreach-scripts.md) covers the four you will hear most.)*

---

## Before you leave the call, get this

- [ ] **10–20 real examples** — actual customer questions, or actual documents. Ask them to forward the last 20 messages they answered. This becomes `test-cases.json`.
- [ ] **The one number** that will define success.
- [ ] **The decision-maker's name**, if it is not the person you are talking to.
- [ ] **The next step, in the diary** — not "I'll send something over".

## Scoring the opportunity (fill in after the call, before you write a proposal)

| | Yes | No |
|---|---|---|
| Repetitive process, high volume | | |
| Costs them measurable money today | | |
| They can name a decision-maker | | |
| Budget exists or is easy to find | | |
| Systems have APIs or are common tools | | |
| No hard regulatory blocker | | |
| I can demo this on their content in under a day | | |

**5 or more yes:** write the proposal today.
**3–4:** worth a demo, quote carefully, expect a slow decision.
**2 or fewer:** say no kindly and stay in touch. Taking bad-fit work early is how the first year gets wasted — say what would need to be true for it to work, and move on.
