// HTTP endpoint for the extraction pipeline, so n8n (or anything else) can
// call it as a step in a workflow. Run: npm run serve
//
//   curl -X POST localhost:3100/api/extract \
//        -H 'content-type: application/json' \
//        -d '{"text":"INVOICE ...", "filename":"inv.txt"}'
//
// Returns the extracted fields, the validation result, and — the part a
// workflow actually branches on — a routing decision: post | review | reject.

import { createServer } from 'node:http';
import { extractDocument, CONFIG } from './extract.js';

const PORT = Number(process.env.PORT || 3100);

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

async function readBody(req, limitBytes = 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limitBytes) throw new Error('payload too large');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/api/health') {
      return sendJson(res, 200, {
        status: 'ok',
        mode: CONFIG.apiKey ? 'live' : 'mock',
        model: CONFIG.model,
      });
    }

    if (req.method === 'POST' && url.pathname === '/api/extract') {
      let payload;
      try {
        payload = JSON.parse((await readBody(req)) || '{}');
      } catch {
        return sendJson(res, 400, { error: 'invalid JSON body' });
      }

      const text = String(payload.text || '').trim();
      if (!text) return sendJson(res, 400, { error: 'text is required' });

      const started = Date.now();
      const { fields, validation, mode, usage } = await extractDocument(text);

      // One decision for the workflow to branch on.
      const routing =
        fields.document_type === 'other'
          ? 'reject'
          : validation.needsReview
            ? 'review'
            : 'post';

      const result = {
        filename: payload.filename || null,
        routing,
        fields,
        confidence: Number(validation.confidence.toFixed(2)),
        issues: validation.issues,
        mode,
        usage,
      };

      console.log(
        JSON.stringify({
          at: new Date().toISOString(),
          ms: Date.now() - started,
          filename: result.filename,
          routing,
          confidence: result.confidence,
          issues: validation.issues.length,
        }),
      );

      return sendJson(res, 200, result);
    }

    res.writeHead(404).end('not found');
  } catch (error) {
    console.error('request failed:', error.message);
    sendJson(res, 500, { error: 'internal error' });
  }
});

server.listen(PORT, () => {
  console.log(`\n  document extraction API on http://localhost:${PORT}`);
  console.log(`  mode: ${CONFIG.apiKey ? `live (${CONFIG.model})` : 'mock — set ANTHROPIC_API_KEY for real extraction'}\n`);
});
