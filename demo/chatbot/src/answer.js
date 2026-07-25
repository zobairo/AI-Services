// The answer pipeline: retrieve → confidence gate → Claude → structured reply.
//
// Every rule the business plan calls "non-negotiable" lives here:
//  - answers come only from retrieved client documents (no invention)
//  - a confidence gate escalates instead of guessing
//  - the assistant never gives medical/legal/financial advice
//  - every answer carries its sources, so a client can audit any reply

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { buildIndex, search } from './retrieve.js';
import { ingest, CHUNKS_FILE } from './ingest.js';

export const CONFIG = {
  model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5',
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  maxTokens: 400,
  topK: 4,
  // Below this share of query terms found in the knowledge base, we do not
  // call the model at all — we escalate. Cheap, deterministic, explainable.
  confidenceFloor: 0.34,
  businessName: process.env.BUSINESS_NAME || 'Northside Dental Clinic',
  handoffMessage:
    process.env.HANDOFF_MESSAGE ||
    'I do not want to guess on this one. I am passing you to a team member who will reply here shortly — or you can call us on +1 555 0134 during opening hours.',
};

let cachedIndex = null;

export async function getIndex({ reload = false } = {}) {
  if (cachedIndex && !reload) return cachedIndex;
  let chunks;
  if (existsSync(CHUNKS_FILE)) {
    chunks = JSON.parse(await readFile(CHUNKS_FILE, 'utf8'));
  } else {
    chunks = await ingest({ quiet: true });
  }
  cachedIndex = buildIndex(chunks);
  cachedIndex.chunks = chunks;
  return cachedIndex;
}

function systemPrompt() {
  return `You are the customer assistant for ${CONFIG.businessName}. You answer on the website and on WhatsApp.

RULES — follow all of them, always:
1. Answer ONLY using the CONTEXT provided in the user message. The context is the business's own documents.
2. If the context does not contain the answer, do not guess and do not use general knowledge. Set "escalate" to true instead.
3. Never give medical, dental, legal, or financial advice, or anything that could be read as a diagnosis or treatment recommendation — even if the context mentions a treatment. You may state facts from the context (prices, durations, what a service includes) and then offer to book a consultation. Any question about symptoms, pain, medication, or what treatment someone needs must set "escalate" to true.
4. Be brief and warm: 1-3 short sentences, the tone of a helpful receptionist. No bullet lists unless listing prices or opening hours.
5. Never invent prices, phone numbers, dates, or availability.
6. Reply in the same language the customer wrote in.

Respond with ONLY a JSON object, no markdown fence, in this exact shape:
{"answer": "<your reply to the customer>", "escalate": <true|false>, "reason": "<short internal note on why you escalated, or empty>"}`;
}

function userPrompt(question, results, history) {
  const context = results
    .map((r, i) => `[${i + 1}] (${r.chunk.source} — ${r.chunk.title})\n${r.chunk.text}`)
    .join('\n\n');

  const conversation = history.length
    ? `\nRECENT CONVERSATION (oldest first):\n${history
        .slice(-4)
        .map((m) => `${m.role === 'user' ? 'Customer' : 'Assistant'}: ${m.content}`)
        .join('\n')}\n`
    : '';

  return `CONTEXT:\n${context}\n${conversation}\nCUSTOMER QUESTION: ${question}`;
}

function parseModelJson(raw) {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
  try {
    return JSON.parse(trimmed);
  } catch {
    // Defensive: if the model ever returns prose, treat it as an escalation
    // rather than shipping malformed output to a customer.
    const match = /\{[\s\S]*\}/.exec(trimmed);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        /* fall through */
      }
    }
    return { answer: '', escalate: true, reason: 'unparseable model output' };
  }
}

async function callClaude(question, results, history) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': CONFIG.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CONFIG.model,
      max_tokens: CONFIG.maxTokens,
      system: systemPrompt(),
      messages: [{ role: 'user', content: userPrompt(question, results, history) }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Anthropic API ${response.status}: ${detail.slice(0, 300)}`);
  }

  const data = await response.json();
  const text = (data.content || [])
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');

  return {
    parsed: parseModelJson(text),
    usage: data.usage || null,
  };
}

// Mock mode keeps the whole pipeline runnable (and the eval suite meaningful)
// with no API key: retrieval, gating, sources and escalation all behave the
// same, only the wording of the final sentence is templated instead of written.
function mockAnswer(results) {
  const top = results[0];
  const firstLine = top.chunk.text
    .split('\n')
    .map((l) => l.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)[0];
  return {
    parsed: {
      answer: `(mock) ${top.chunk.title}: ${firstLine}`,
      escalate: false,
      reason: '',
    },
    usage: null,
  };
}

/**
 * Answer one customer question.
 * @returns {{answer:string, escalate:boolean, reason:string, confidence:number,
 *            sources:Array<{source:string,title:string}>, mode:'live'|'mock', usage:object|null}}
 */
export async function answerQuestion(question, { history = [] } = {}) {
  const index = await getIndex();
  const { results, confidence } = search(index, question, CONFIG.topK);

  if (results.length === 0 || confidence < CONFIG.confidenceFloor) {
    return {
      answer: CONFIG.handoffMessage,
      escalate: true,
      reason: `low retrieval confidence (${confidence.toFixed(2)} < ${CONFIG.confidenceFloor})`,
      confidence,
      sources: results.map((r) => ({ source: r.chunk.source, title: r.chunk.title })),
      mode: CONFIG.apiKey ? 'live' : 'mock',
      usage: null,
    };
  }

  const mode = CONFIG.apiKey ? 'live' : 'mock';
  const { parsed, usage } = mode === 'live'
    ? await callClaude(question, results, history)
    : mockAnswer(results);

  const escalate = Boolean(parsed.escalate) || !parsed.answer;

  return {
    answer: escalate ? CONFIG.handoffMessage : String(parsed.answer),
    escalate,
    reason: String(parsed.reason || ''),
    confidence,
    sources: results.map((r) => ({ source: r.chunk.source, title: r.chunk.title })),
    mode,
    usage,
  };
}
