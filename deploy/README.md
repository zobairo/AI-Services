# Deployment

Gets the stack from [docs/03](../docs/03-tech-stack-and-architecture.md) onto a real server: n8n, the chatbot service, and automatic HTTPS. Budget **$10–30/month** for the VPS; this runs your first 5–10 clients.

## Before you start

- A VPS with 2 vCPU / 4 GB RAM (Hetzner, DigitalOcean, Vultr — any of them)
- A domain, with two A records pointing at the server: `n8n.yourdomain.com` and `chat.yourdomain.com`
- Docker and the compose plugin installed
- Ports 80 and 443 open; **port 5678 closed** — n8n must only be reachable through the proxy

## First deploy

```bash
git clone <your repo> && cd AI-Services/deploy
cp .env.example .env
nano .env                      # fill in every value — compose refuses to start without them
docker compose up -d --build
docker compose logs -f caddy   # watch the certificates being issued
```

Then open `https://n8n.yourdomain.com`, log in with the basic-auth credentials from `.env`, and create your n8n owner account immediately.

Verify the chatbot is alive:

```bash
curl -s https://chat.yourdomain.com/api/health
```

## Serving a second client

Each client gets their own container, their own hostname, and their own knowledge folder — the isolation model from [docs/03](../docs/03-tech-stack-and-architecture.md).

1. Scaffold them: `node scripts/new-client.js acme-dental "Acme Dental" --industry clinic`
2. Fill `clients/acme-dental/knowledge/` with their content and write their `test-cases.json`
3. Copy the `chatbot` service block in `docker-compose.yml`, rename it (`chatbot-acme`), and set `CLIENT_DIR=/app/clients/acme-dental`
4. Add a matching site block to the `Caddyfile` with their hostname
5. `docker compose up -d --build chatbot-acme`

At around five clients this file gets long — that is the moment to generate it from a script, not the moment to put everyone in one container.

## Updating a client's knowledge base

No rebuild needed; the `clients/` folder is mounted from the host.

```bash
nano ../clients/acme-dental/knowledge/02-services-and-prices.md
CLIENT_DIR=clients/acme-dental npm --prefix ../demo/chatbot run ingest
CLIENT_DIR=clients/acme-dental npm --prefix ../demo/chatbot test   # never skip this
docker compose restart chatbot-acme
```

Running the tests before restarting is what stops a "quick price update" from becoming an outage.

## Backups — do this on day one, not after the first incident

What must survive the server dying:

| What | Why | How |
|---|---|---|
| `N8N_ENCRYPTION_KEY` | Without it, every stored client credential is unrecoverable | Password manager, today |
| n8n data volume | Your workflows and credentials | Nightly `docker run --rm -v n8n_data:/data -v $(pwd):/backup alpine tar czf /backup/n8n-$(date +%F).tar.gz /data` |
| `clients/` | Every client's knowledge base and tests | It is in git — commit after every change |
| `.env` | All your secrets | Password manager. **Never** commit it |

Restoring is only real if you have tried it. Do one restore test in your first month.

## Security checklist before any client goes live

- [ ] n8n reachable only through HTTPS, with authentication on
- [ ] Port 5678 not exposed to the internet (`ss -tlnp` to confirm)
- [ ] A firewall allowing only 22, 80, 443
- [ ] SSH by key only, password login disabled
- [ ] `.env` is `chmod 600` and not in git
- [ ] Rate limiting on the public chat endpoint (plugin or Cloudflare — see the Caddyfile)
- [ ] CORS restricted to the client's own website origin
- [ ] Separate API credentials per client, stored in n8n's credential vault
- [ ] Unattended security upgrades enabled
- [ ] You know how to restore from backup

## Monitoring

The chatbot writes one JSON line per conversation — question, confidence, sources, whether it escalated. That is the raw material for the [monthly client report](../templates/monthly-report.md):

```bash
docker compose logs chatbot-acme | grep '^{' > /tmp/month.jsonl
```

Add an n8n workflow with a schedule trigger that hits `/api/health` every 15 minutes and messages you on Telegram when it fails. You want to know before the client does — that is what the retainer is paying for.

## Costs at this size

| Item | Monthly |
|---|---|
| VPS (2 vCPU / 4 GB) | $10–20 |
| Domain | ~$1 |
| Backups (object storage) | $1–5 |
| LLM tokens | usage-based — [`node tools/quote.js`](../tools/quote.js) sizes this per client |
| **Fixed total** | **~$15–30 for all clients** |

That is the whole infrastructure cost of the business at this stage, which is why the margins in [docs/09](../docs/09-financial-projections.md) hold up.
