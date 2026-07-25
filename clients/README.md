# Clients

One folder per client. Created by `node scripts/new-client.js <slug> "<Business Name>" --industry <preset>`.

```
clients/acme-dental/
  client.json        business name, tone, guardrails, confidence floor
  knowledge/         their real content, one "## " heading per topic
  test-cases.json    the acceptance criteria they approved
  RUNBOOK.md         the handover page, and what you read when it breaks
  data/              generated chunks (gitignored)
```

Run any client through the shared codebase:

```bash
CLIENT_DIR=clients/acme-dental npm --prefix demo/chatbot run ingest
CLIENT_DIR=clients/acme-dental npm --prefix demo/chatbot test
CLIENT_DIR=clients/acme-dental npm --prefix demo/chatbot start
```

## Rules

1. **Never edit the demo to serve a client.** If something needs changing in the code for one client, it belongs in `client.json` or the industry presets in `scripts/new-client.js` — otherwise the next client inherits their quirks.
2. **Commit client folders, never their secrets.** Knowledge bases and test cases belong in git; API keys and credentials live in n8n's credential store or your password manager. `.env` files are gitignored — keep it that way.
3. **Tests before deploy, every time.** A price change is a code change. `npm test` with their `CLIENT_DIR` before restarting anything.
4. **Delete on offboarding.** The [service agreement](../templates/service-agreement.md) promises data deletion within 30 days of the contract ending. Remove the folder, purge the container, confirm in writing.

## Real client data and this repository

If this repo is public or shared, do not put real customer data, real price lists you do not own, or anything personal into `clients/`. Keep client folders in a private repository, or add `clients/*/` to `.gitignore` and back them up separately.
