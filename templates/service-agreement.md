# Service Agreement Template

> **Not legal advice.** This is a plain-language starting point built from the essentials in [docs/05](../docs/05-operations-legal.md). Have a qualified professional in your country review it once before you use it for real — one review covers every future client.

---

# Service Agreement

**Between:** <Your Name / Company>, "the Provider"
**And:** <Client Legal Name>, "the Client"
**Date:** <date>

## 1. What the Provider will build

The Provider will build and deliver the automation described in the Proposal dated <date>, attached as Appendix A, which forms part of this agreement.

The specific behaviours listed in the Proposal define the scope. Anything not listed there is not included in this agreement.

## 2. Acceptance

The work is complete when it correctly handles the acceptance test cases listed in the Proposal, using the Client's real data.

The Provider will demonstrate the results to the Client. The Client has **5 business days** to confirm acceptance or report a failed test case in writing. If the Client does not respond within 5 business days, the work is considered accepted.

## 3. Price and payment

- Build fee: **$<amount>**, paid 50% before work begins and 50% within 7 days of acceptance.
- Monthly plan: **$<amount>/month**, starting the month after go-live, charged monthly in advance.
- Usage above the agreed allowance (<state allowance>) is billed at the Provider's cost plus <20-50>%, itemised on the invoice.
- Invoices unpaid after 14 days: the Provider may pause support (not the running automation) until payment is received. After 30 days, the Provider may suspend the automation itself with 5 days written notice.

## 4. Changes

Anything outside the behaviours listed in the Proposal is a change request. The Provider will quote it separately; work starts once the Client approves in writing.

Two rounds of revisions to the agreed scope are included. Further revisions are billed at $<rate>/hour or under the monthly plan's included hours.

Fixing behaviour that does not match the Proposal is a bug, not a change, and is always fixed at no cost.

## 5. What the Client provides

The Client will provide, within <5> business days of the kick-off: documents and content the automation needs, access to relevant accounts and systems, and a named person who can answer questions and approve decisions.

Delays in providing these move the delivery dates by the same amount.

## 6. Ownership

- The **Client owns**: their data, their content, the configuration and prompts written specifically for them, and the right to keep using everything delivered.
- The **Provider owns**: their generic templates, code libraries, methods and know-how, including anything reused across clients, and may continue to reuse them.
- On final payment, the Client receives an export of their configuration and may take it elsewhere.

## 7. Data protection

- The Provider processes the Client's data only to provide the services described here.
- The Provider uses AI providers whose business terms do not permit training on customer data, and will not use Client data to train any model.
- The Provider stores the minimum data needed to operate the automation, keeps each client's data separated, and will delete Client data within 30 days of the agreement ending, on request.
- Where the Client's data includes personal data of individuals, both parties will follow applicable data protection law, and will sign a data processing agreement if the Client requires one.

## 8. How AI systems behave — important

The Client understands that AI systems produce outputs based on probability and **can be wrong**, even when correctly built.

The Provider will reduce this risk by grounding answers in the Client's own documents, testing against the agreed acceptance cases, building in escalation to a human where confidence is low, and monitoring after launch.

The Client remains responsible for reviewing outputs used in important decisions. Neither party will configure the automation to take final decisions on medical, legal, financial or safety matters without a human reviewing them.

## 9. Availability and support

The monthly plan includes: monitoring, hosting, and bug fixes with a first response within <1-2> business days (<same day> for the Scale tier), plus <N> hours of changes per month. Unused hours do not roll over.

The Provider does not guarantee uninterrupted service, since the automation depends on third-party providers (AI APIs, messaging platforms, the Client's own systems). The Provider will inform the Client promptly of significant outages and work to restore service.

## 10. Liability

Neither party is liable for indirect or consequential losses, including lost profit or lost business.

The Provider's total liability under this agreement is limited to the fees paid by the Client in the **<3-6> months** before the event giving rise to the claim.

Nothing in this agreement limits liability that cannot legally be limited.

## 11. Confidentiality

Each party will keep the other's non-public business information confidential and use it only for this project. This continues for 2 years after the agreement ends.

## 12. Ending the agreement

- The monthly plan may be ended by either party with **30 days written notice**.
- Either party may end this agreement immediately if the other seriously breaches it and does not fix the breach within 14 days of written notice.
- On ending: the Client pays for work completed, receives an export of their configuration and credentials, and may request deletion of their data.

## 13. General

This agreement, with the Proposal, is the whole agreement between the parties. Changes must be in writing. It is governed by the law of <your country/state>.

---

**Provider:** ______________________  Date: __________

**Client:** ________________________  Date: __________

*Appendix A: Proposal dated <date>, including scope and acceptance test cases.*
