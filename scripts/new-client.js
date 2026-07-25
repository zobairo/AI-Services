#!/usr/bin/env node
// Scaffold a new client from the template library.
//
//   node scripts/new-client.js northside-dental "Northside Dental Clinic" --industry clinic
//
// This is the asset the plan calls "build once, resell many times"
// (docs/03, docs/07): a client becomes a folder, never a code change.
// Project #10 should take a fraction of the time of project #1 — this is how.

import { mkdir, writeFile, readdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(here, '..');
const CLIENTS = path.join(ROOT, 'clients');

// Industry presets: the guardrails and tone that differ per vertical.
// Add a preset the first time you sell into a new industry — by the third
// client in that vertical, onboarding is minutes.
const INDUSTRIES = {
  clinic: {
    tone: 'Be brief and warm: 1-3 short sentences, the tone of a helpful receptionist.',
    guardrails: [
      'Never give medical or dental advice, or anything that reads as a diagnosis or treatment recommendation — even if the context mentions a treatment. You may state facts from the context (prices, durations, what a service includes) and then offer to book a consultation. Any question about symptoms, pain, medication, or what treatment someone needs must set "escalate" to true.',
    ],
    starterTopics: ['opening hours and location', 'services and prices', 'appointments and cancellations', 'payment and insurance'],
  },
  legal: {
    tone: 'Be precise and professional: 1-3 short sentences, no informality.',
    guardrails: [
      'Never give legal advice or an opinion on the merits of anyone\'s situation. You may describe the firm\'s services, fees and process from the context, then offer to arrange a consultation. Any question about what someone should do, their rights, deadlines, or the strength of a case must set "escalate" to true.',
    ],
    starterTopics: ['practice areas', 'fees and how billing works', 'first consultation and what to bring', 'contact and office hours'],
  },
  ecommerce: {
    tone: 'Be friendly and efficient: 1-3 short sentences, helpful and sales-aware.',
    guardrails: [
      'Never promise a delivery date, refund, or discount that is not stated in the context. Order-specific questions (where is my order, can I change it) must set "escalate" to true unless the context contains that customer\'s actual order information.',
    ],
    starterTopics: ['shipping and delivery', 'returns and refunds', 'product and sizing information', 'payment options'],
  },
  trades: {
    tone: 'Be plain and practical: 1-3 short sentences, the tone of a busy but friendly office.',
    guardrails: [
      'Never quote a final price for a job, diagnose a fault remotely, or give safety instructions for gas, electrical or structural work. Give the callout fee and hourly rate from the context if present, then offer to book a visit. Anything urgent involving gas, water leaks, or electrical danger must set "escalate" to true and tell the customer to call the emergency number.',
    ],
    starterTopics: ['services and coverage area', 'callout fees and rates', 'booking a job', 'emergencies and out of hours'],
  },
  hospitality: {
    tone: 'Be warm and welcoming: 1-3 short sentences.',
    guardrails: [
      'Never confirm a booking that is not in the context, and never guarantee availability. You may state opening hours, menus, facilities and prices from the context, then offer to take booking details for the team to confirm. Allergy and dietary questions must set "escalate" to true unless the context states the answer explicitly.',
    ],
    starterTopics: ['opening hours and location', 'menu or rooms and prices', 'bookings and cancellations', 'facilities and accessibility'],
  },
  general: {
    tone: 'Be brief and warm: 1-3 short sentences.',
    guardrails: [
      'Never give professional advice (medical, legal, financial). State facts from the context, then offer to connect the customer with the team. Anything requiring a judgement about the customer\'s specific situation must set "escalate" to true.',
    ],
    starterTopics: ['about the business and hours', 'services and prices', 'how to get in touch or book', 'payment and policies'],
  },
};

function usage() {
  console.log(`
  Scaffold a new client project.

    node scripts/new-client.js <slug> "<Business Name>" [--industry <name>]

  Industries: ${Object.keys(INDUSTRIES).join(', ')}   (default: general)

  Example:
    node scripts/new-client.js acme-dental "Acme Dental" --industry clinic
    CLIENT_DIR=clients/acme-dental npm --prefix demo/chatbot start
`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2 || args.includes('--help') || args.includes('-h')) {
    usage();
    process.exit(args.length < 2 ? 1 : 0);
  }

  const slug = args[0].toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const businessName = args[1];
  const industryIndex = args.indexOf('--industry');
  const industryKey = industryIndex !== -1 ? (args[industryIndex + 1] || 'general') : 'general';
  const industry = INDUSTRIES[industryKey];

  if (!industry) {
    console.error(`Unknown industry "${industryKey}". Known: ${Object.keys(INDUSTRIES).join(', ')}`);
    process.exit(1);
  }

  const dir = path.join(CLIENTS, slug);
  if (existsSync(dir)) {
    console.error(`clients/${slug} already exists — pick another slug or delete it first.`);
    process.exit(1);
  }

  await mkdir(path.join(dir, 'knowledge'), { recursive: true });

  const config = {
    businessName,
    industry: industryKey,
    tone: industry.tone,
    guardrails: industry.guardrails,
    confidenceFloor: 0.34,
    handoffMessage: `I do not want to guess on this one — I am passing you to someone from the ${businessName} team who will reply here shortly.`,
    model: 'claude-sonnet-5',
  };
  await writeFile(path.join(dir, 'client.json'), JSON.stringify(config, null, 2) + '\n');

  // One starter knowledge file per topic the industry always needs.
  for (const [i, topic] of industry.starterTopics.entries()) {
    const filename = `${String(i + 1).padStart(2, '0')}-${topic.replace(/[^a-z]+/gi, '-').toLowerCase()}.md`;
    await writeFile(
      path.join(dir, 'knowledge', filename),
      `# ${businessName} — ${topic.replace(/^./, (c) => c.toUpperCase())}\n\n` +
        `## ${topic.replace(/^./, (c) => c.toUpperCase())}\n\n` +
        `REPLACE THIS with the client's real content on ${topic}.\n\n` +
        `Keep one "## " heading per distinct topic — each becomes a retrievable chunk.\n` +
        `Write it the way the business would answer a customer, in full sentences,\n` +
        `and include the exact words customers use (prices, names, times).\n`,
    );
  }

  await writeFile(
    path.join(dir, 'test-cases.json'),
    JSON.stringify(
      [
        {
          question: 'REPLACE: a real question this business gets every week',
          expect_source: '01-*.md',
          expect_escalate: false,
          expect_contains: ['a fact that must appear in the answer'],
        },
        {
          question: 'What is the capital of France?',
          expect_escalate: true,
          note: 'off-topic guardrail — keep this case in every client project',
        },
      ],
      null,
      2,
    ) + '\n',
  );

  await writeFile(
    path.join(dir, 'RUNBOOK.md'),
    `# ${businessName} — Runbook\n\n` +
      `The one page the client gets at handover, and the page you read at 8am when something breaks.\n\n` +
      `## What this automation does\n\nREPLACE: two sentences in plain language.\n\n` +
      `## Who to contact\n\n- Client contact: NAME, PHONE, EMAIL\n- Decision maker: NAME\n- Plan tier: TIER (response time: X)\n\n` +
      `## How to check it is working\n\n` +
      `\`\`\`bash\ncurl -s https://HOST/api/health\nCLIENT_DIR=clients/${slug} npm --prefix demo/chatbot test\n\`\`\`\n\n` +
      `## Common problems\n\n` +
      `| Symptom | Cause | Fix |\n|---|---|---|\n` +
      `| Answers "I'll pass you to a colleague" too often | knowledge gap | add the missing topic to knowledge/, re-run ingest |\n` +
      `| Wrong prices | knowledge out of date | update the price file, re-run ingest and tests |\n` +
      `| No replies at all | service down or API key | check health endpoint, check provider status, check billing |\n\n` +
      `## Change history\n\n| Date | Change | By |\n|---|---|---|\n| ${'YYYY-MM-DD'} | Initial delivery | |\n`,
  );

  console.log(`
  Created clients/${slug}  (${businessName}, ${industryKey})

    clients/${slug}/client.json        tone + guardrails for this industry
    clients/${slug}/knowledge/         ${industry.starterTopics.length} starter files — replace with real content
    clients/${slug}/test-cases.json    acceptance criteria — write these at kick-off
    clients/${slug}/RUNBOOK.md         handover page

  Next:
    1. Fill knowledge/ with the client's real content
    2. Write test-cases.json from questions their customers actually ask
    3. CLIENT_DIR=clients/${slug} npm --prefix demo/chatbot run ingest
    4. CLIENT_DIR=clients/${slug} npm --prefix demo/chatbot test
    5. CLIENT_DIR=clients/${slug} npm --prefix demo/chatbot start
`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
