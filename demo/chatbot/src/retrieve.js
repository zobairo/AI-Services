// Lexical retrieval (BM25) over knowledge-base chunks.
//
// Why not embeddings here: this demo must run with zero dependencies and zero
// setup so it can be shown to a prospect in under a minute. BM25 is strong for
// small, well-written knowledge bases (a few hundred chunks) which is exactly
// the SMB case. Swap in pgvector/embeddings when a client's knowledge base
// grows past a few hundred chunks or needs semantic paraphrase matching —
// the interface below (search()) is what the rest of the code depends on.

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'do', 'does',
  'for', 'from', 'has', 'have', 'how', 'i', 'if', 'in', 'is', 'it', 'its', 'me',
  'my', 'of', 'on', 'or', 'our', 'that', 'the', 'their', 'them', 'there',
  'they', 'this', 'to', 'was', 'we', 'what', 'when', 'where', 'which', 'who',
  'will', 'with', 'would', 'you', 'your',
]);

const K1 = 1.5;
const B = 0.75;

// Very light suffix stripping so "prices"/"price" and "booking"/"book" match.
// Not a real stemmer — deliberately conservative, since aggressive stemming
// creates false matches that are worse than misses in a support bot.
function stem(token) {
  if (token.length > 5 && token.endsWith('ing')) return token.slice(0, -3);
  if (token.length > 4 && token.endsWith('ed')) return token.slice(0, -2);
  if (token.length > 4 && token.endsWith('es')) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith('s')) return token.slice(0, -1);
  return token;
}

export function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^['-]+|['-]+$/g, ''))
    // Keep short numeric tokens (prices, times) but drop short noise words.
    .filter((t) => t && !STOPWORDS.has(t) && (t.length > 2 || /\d/.test(t)))
    .map(stem);
}

export function buildIndex(chunks) {
  const docs = chunks.map((chunk) => {
    // Titles carry a lot of signal in a structured knowledge base, so weight
    // them by repeating their terms.
    const terms = [
      ...tokenize(chunk.title),
      ...tokenize(chunk.title),
      ...tokenize(chunk.text),
    ];
    const freq = new Map();
    for (const term of terms) freq.set(term, (freq.get(term) || 0) + 1);
    return { chunk, freq, length: terms.length };
  });

  const docFreq = new Map();
  for (const doc of docs) {
    for (const term of doc.freq.keys()) {
      docFreq.set(term, (docFreq.get(term) || 0) + 1);
    }
  }

  const avgLength =
    docs.reduce((sum, doc) => sum + doc.length, 0) / (docs.length || 1);

  return { docs, docFreq, avgLength, size: docs.length };
}

function idf(index, term) {
  const df = index.docFreq.get(term) || 0;
  // BM25 idf, floored at a small positive value so common terms still rank.
  return Math.max(
    0.05,
    Math.log(1 + (index.size - df + 0.5) / (df + 0.5)),
  );
}

/**
 * Search the index.
 * Returns { results, confidence, queryTerms, matchedTerms }.
 *
 * `confidence` is term coverage: the share of meaningful query terms that
 * appear anywhere in the retrieved chunks. It is deliberately simple and
 * explainable — the confidence gate in answer.js uses it to decide whether to
 * answer at all, and you can show a client exactly why the bot escalated.
 */
export function search(index, query, topK = 4) {
  const queryTerms = [...new Set(tokenize(query))];
  if (queryTerms.length === 0) {
    return { results: [], confidence: 0, queryTerms, matchedTerms: [] };
  }

  const scored = index.docs.map((doc) => {
    let score = 0;
    const terms = [];
    for (const term of queryTerms) {
      const tf = doc.freq.get(term) || 0;
      if (tf === 0) continue;
      terms.push(term);
      const norm =
        tf * (K1 + 1) /
        (tf + K1 * (1 - B + B * (doc.length / (index.avgLength || 1))));
      score += idf(index, term) * norm;
    }
    return { chunk: doc.chunk, score, terms };
  });

  const results = scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  const matchedTerms = [...new Set(results.flatMap((r) => r.terms))];

  // Confidence = share of the query's *information* that the knowledge base
  // could account for, weighting each term by idf. Plain term coverage would
  // rate "what time does the football match start" highly just because "time"
  // and "start" appear somewhere; weighting by idf means the terms that carry
  // the actual meaning ("football", "match") dominate the score when they are
  // missing from the corpus entirely.
  const weight = (term) => idf(index, term);
  const totalWeight = queryTerms.reduce((sum, term) => sum + weight(term), 0);
  const matchedWeight = matchedTerms.reduce((sum, term) => sum + weight(term), 0);
  const confidence = totalWeight === 0 ? 0 : matchedWeight / totalWeight;

  return { results, confidence, queryTerms, matchedTerms };
}
