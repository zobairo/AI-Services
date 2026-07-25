// Zero-dependency demo server: serves the chat widget and the /api/chat endpoint.
// Run: npm start   →   http://localhost:3000
//
// For a real client deployment this endpoint is what you put behind n8n or a
// Cloudflare Worker; the widget is what you drop into the client's website.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { answerQuestion, CONFIG, getIndex } from './answer.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(here, '..', 'public');
const PORT = Number(process.env.PORT || 3000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

async function readBody(req, limitBytes = 64 * 1024) {
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
      const index = await getIndex();
      return sendJson(res, 200, {
        status: 'ok',
        mode: CONFIG.apiKey ? 'live' : 'mock',
        model: CONFIG.model,
        chunks: index.size,
        business: CONFIG.businessName,
      });
    }

    if (req.method === 'POST' && url.pathname === '/api/chat') {
      const raw = await readBody(req);
      let payload;
      try {
        payload = JSON.parse(raw || '{}');
      } catch {
        return sendJson(res, 400, { error: 'invalid JSON body' });
      }

      const question = String(payload.message || '').trim();
      if (!question) return sendJson(res, 400, { error: 'message is required' });
      if (question.length > 2000) return sendJson(res, 400, { error: 'message too long' });

      const history = Array.isArray(payload.history)
        ? payload.history
            .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && m.content)
            .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }))
        : [];

      const started = Date.now();
      const result = await answerQuestion(question, { history });
      // Every conversation line is logged: this is what becomes the client's
      // monthly report (questions asked, escalation rate, gaps to fill).
      console.log(
        JSON.stringify({
          at: new Date().toISOString(),
          ms: Date.now() - started,
          question,
          escalate: result.escalate,
          confidence: Number(result.confidence.toFixed(2)),
          sources: result.sources.map((s) => s.source),
        }),
      );
      return sendJson(res, 200, result);
    }

    if (req.method === 'GET') {
      const rel = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\/+/, '');
      const filePath = path.join(PUBLIC_DIR, rel);
      if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403).end('forbidden');
        return;
      }
      try {
        const file = await readFile(filePath);
        res.writeHead(200, { 'content-type': MIME[path.extname(filePath)] || 'application/octet-stream' });
        res.end(file);
        return;
      } catch {
        res.writeHead(404).end('not found');
        return;
      }
    }

    res.writeHead(405).end('method not allowed');
  } catch (error) {
    console.error('request failed:', error.message);
    sendJson(res, 500, { error: 'internal error' });
  }
});

server.listen(PORT, async () => {
  const index = await getIndex();
  const mode = CONFIG.apiKey ? `live (${CONFIG.model})` : 'MOCK — set ANTHROPIC_API_KEY for real answers';
  console.log(`\n  ${CONFIG.businessName} assistant`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  knowledge: ${index.size} chunks | mode: ${mode}\n`);
});
