// Turns a folder of markdown files into retrievable chunks.
// One chunk per "## " section, which matches how a well-written client FAQ or
// policy document is already structured. Run: npm run ingest

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const KNOWLEDGE_DIR = path.join(here, '..', 'knowledge');
export const CHUNKS_FILE = path.join(here, '..', 'data', 'chunks.json');

function splitIntoSections(markdown, source) {
  const lines = markdown.split('\n');
  const sections = [];
  let title = null;
  let buffer = [];

  const flush = () => {
    const text = buffer.join('\n').trim();
    if (title && text) sections.push({ title, text });
    buffer = [];
  };

  for (const line of lines) {
    const heading = /^##\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      title = heading[1].trim();
      continue;
    }
    // A leading "# Title" becomes the fallback section title for any preamble.
    const h1 = /^#\s+(.*)$/.exec(line);
    if (h1 && !title) {
      title = h1[1].trim();
      continue;
    }
    buffer.push(line);
  }
  flush();

  return sections.map((section, i) => ({
    id: `${source}#${i}`,
    source,
    title: section.title,
    text: section.text,
  }));
}

export async function loadChunks() {
  const files = (await readdir(KNOWLEDGE_DIR)).filter((f) => f.endsWith('.md')).sort();
  const chunks = [];
  for (const file of files) {
    const markdown = await readFile(path.join(KNOWLEDGE_DIR, file), 'utf8');
    chunks.push(...splitIntoSections(markdown, file));
  }
  return chunks;
}

export async function ingest({ quiet = false } = {}) {
  const chunks = await loadChunks();
  const dir = path.dirname(CHUNKS_FILE);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  await writeFile(CHUNKS_FILE, JSON.stringify(chunks, null, 2));
  if (!quiet) {
    const sources = new Set(chunks.map((c) => c.source));
    console.log(`Ingested ${chunks.length} chunks from ${sources.size} file(s):`);
    for (const source of sources) {
      const count = chunks.filter((c) => c.source === source).length;
      console.log(`  ${source.padEnd(28)} ${count} sections`);
    }
    console.log(`\nWrote ${path.relative(process.cwd(), CHUNKS_FILE)}`);
  }
  return chunks;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  ingest().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
