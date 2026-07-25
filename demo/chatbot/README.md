# Demo #1 — AI Support Chatbot (service A1)

The reference build for the flagship service in the [catalog](../../docs/02-services-catalog.md). Runs with **zero dependencies and zero setup** — that matters, because the sales motion is "build a demo on the prospect's real content in under an hour" ([go-to-market](../../docs/04-go-to-market.md)).

```bash
cd demo/chatbot
npm run ingest     # knowledge/*.md  ->  data/chunks.json
npm start          # http://localhost:3000
npm test           # acceptance test suite
npm run ask -- "how much is a teeth cleaning?"
```

No API key needed to run it: without `ANTHROPIC_API_KEY` it runs in **mock mode**, where retrieval, confidence gating, sources and escalation all behave normally and only the final wording is templated. With a key set, answers are written by Claude.

```bash
export ANTHROPIC_API_KEY=sk-ant-...    # optional, for real answers
export ANTHROPIC_MODEL=claude-sonnet-5 # default; use a cheaper tier for high volume
```

## What it demonstrates to a client

1. **It only knows their business.** Answers come from `knowledge/` and nothing else — no invented prices, no general internet knowledge.
2. **It knows when it doesn't know.** An off-topic or unsupported question is handed to a human instead of guessed at. Try "What is the capital of France?" in the widget.
3. **Every answer is traceable.** The widget shows the source document behind each reply. This is what makes a nervous client say yes.
4. **It refuses what it must not answer.** Medical/diagnostic questions escalate even when related words appear in the knowledge base.
5. **Quality is measurable.** `npm test` is the acceptance suite you show at handover and re-run after every change.

## How it works

```
question
   ↓
retrieve.js   BM25 over knowledge chunks, idf-weighted confidence score
   ↓
answer.js     confidence gate → below floor, escalate without calling the model
   ↓          otherwise: Claude, grounded strictly in retrieved chunks
   ↓          returns {answer, escalate, reason}
server.js     JSON API + chat widget, one log line per conversation
```

| File | Role |
|---|---|
| `src/retrieve.js` | Lexical search + confidence scoring |
| `src/ingest.js` | Markdown → chunks (one per `##` section) |
| `src/answer.js` | Prompt, guardrails, confidence gate, Claude call |
| `src/server.js` | HTTP API + static widget |
| `src/eval.js` | Acceptance test runner |
| `src/ask.js` | One-off question from the terminal |
| `knowledge/` | The client's documents — **this is the only folder you swap per client** |
| `test-cases.json` | The acceptance criteria for this client |

## Turning this into a paid client build

1. **Replace `knowledge/`** with the client's real content: FAQ, price list, policies, opening hours. Markdown with `##` headings per topic. 30–60 minutes of copy-paste and cleanup for a typical small business.
2. **Rewrite `test-cases.json`** with 10–20 questions their real customers actually ask (get these from their inbox or WhatsApp history — asking for them is also a great discovery question).
3. **Edit the guardrails** in `systemPrompt()` in `src/answer.js`: business name, tone, and the "never answer" rules for that industry.
4. **Set `BUSINESS_NAME` and `HANDOFF_MESSAGE`** via environment variables.
5. `npm test` until green — that green run *is* your delivery acceptance ([operations](../../docs/05-operations-legal.md)).
6. Deploy: the VPS + Docker setup from the [stack doc](../../docs/03-tech-stack-and-architecture.md), then embed the widget or connect it to WhatsApp.

## Known limits (be honest about these in sales calls)

- **Lexical retrieval, not semantic.** Great for small, well-written knowledge bases; it can miss paraphrases that share no words with the source. Past a few hundred chunks, or for multilingual paraphrase matching, move to embeddings + pgvector.
- **No persistence.** Conversation history lives in the browser only. Real deployments log to the client's database.
- **No auth or rate limiting** on the demo endpoint. Both are required before anything goes public — see the security notes in the [stack doc](../../docs/03-tech-stack-and-architecture.md).
- **The demo knowledge base is fictional.** "Northside Dental Clinic" does not exist; all prices and numbers are invented.
