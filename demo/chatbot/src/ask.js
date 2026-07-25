// One-off question from the terminal — handy when tuning a client's knowledge
// base. Run: npm run ask -- "what are your opening hours?"

import { answerQuestion, CONFIG } from './answer.js';

const question = process.argv.slice(2).join(' ').trim();

if (!question) {
  console.error('usage: npm run ask -- "your question here"');
  process.exit(1);
}

const result = await answerQuestion(question);

console.log(`\nQ: ${question}`);
console.log(`A: ${result.answer}\n`);
console.log(`   mode:       ${result.mode}${result.mode === 'live' ? ` (${CONFIG.model})` : ''}`);
console.log(`   confidence: ${result.confidence.toFixed(2)}`);
console.log(`   escalated:  ${result.escalate}${result.reason ? ` — ${result.reason}` : ''}`);
if (result.sources.length) {
  console.log('   sources:');
  for (const source of result.sources) console.log(`     - ${source.source} → ${source.title}`);
}
if (result.usage) {
  console.log(`   tokens:     ${result.usage.input_tokens} in / ${result.usage.output_tokens} out`);
}
console.log();
