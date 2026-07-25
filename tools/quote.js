#!/usr/bin/env node
// Quote calculator — turns the services catalog into a real number.
//
//   node tools/quote.js A1 D1                 quote two services, starting-out prices
//   node tools/quote.js --established A1 C1   after-reputation prices
//   node tools/quote.js --package E2          quote an industry package
//   node tools/quote.js --list                show the catalog
//   node tools/quote.js A1 --chats 4000       size the retainer against real volume
//
// Prices come from docs/02-services-catalog.md and docs/08-industry-packages.md.
// Margin math comes from docs/03 (cost of goods) and docs/09 (unit economics).

const SERVICES = {
  A1: { name: 'AI support chatbot', start: [500, 1500], est: [2000, 5000], monthly: [100, 350], days: 4 },
  A2: { name: 'AI voice receptionist', start: [1000, 2500], est: [3000, 8000], monthly: [200, 600], days: 7, voice: true },
  A3: { name: 'AI outbound voice', start: [750, 2000], est: [2500, 6000], monthly: [150, 500], days: 5, voice: true },
  A4: { name: 'AI sales assistant / product finder', start: [750, 2000], est: [2500, 6000], monthly: [150, 400], days: 5 },
  A5: { name: 'Appointment booking agent', start: [500, 1200], est: [1500, 4000], monthly: [100, 300], days: 3 },
  A7: { name: 'Review & reputation automation', start: [400, 1000], est: [1200, 3000], monthly: [100, 250], days: 3 },
  A8: { name: 'WhatsApp commerce assistant', start: [750, 2000], est: [2500, 6000], monthly: [150, 400], days: 5 },
  A9: { name: 'After-hours & overflow answering', start: [500, 1200], est: [1500, 3500], monthly: [150, 400], days: 3, voice: true },
  B1: { name: 'Lead generation & enrichment', start: [500, 1500], est: [2000, 5000], monthly: [150, 400], days: 4 },
  B2: { name: 'Personalized outreach drafting', start: [500, 1500], est: [2000, 4000], monthly: [150, 400], days: 4 },
  B3: { name: 'Speed-to-lead follow-up', start: [500, 1200], est: [1500, 4000], monthly: [100, 300], days: 3 },
  B4: { name: 'Content pipeline', start: [500, 1200], est: [1500, 4000], monthly: [150, 500], days: 3 },
  B5: { name: 'SEO content factory', start: [750, 2000], est: [2500, 6000], monthly: [250, 800], days: 5 },
  B8: { name: 'Video repurposing', start: [500, 1500], est: [1500, 4000], monthly: [150, 500], days: 4 },
  B10: { name: 'AI product visuals', start: [300, 800], est: [1000, 2500], monthly: [100, 400], days: 2 },
  C1: { name: 'Invoice/receipt processing', start: [750, 2000], est: [2500, 7000], monthly: [150, 400], days: 6 },
  C2: { name: 'Contract intake & summary', start: [1000, 2500], est: [3000, 8000], monthly: [200, 500], days: 7 },
  C3: { name: 'CV screening pipeline', start: [750, 2000], est: [2500, 6000], monthly: [150, 450], days: 6 },
  C4: { name: 'Email/form intake -> CRM', start: [400, 1000], est: [1200, 3000], monthly: [100, 250], days: 3 },
  C5: { name: 'Email triage & drafted replies', start: [500, 1200], est: [1500, 4000], monthly: [150, 400], days: 4 },
  C7: { name: 'Automated reporting', start: [500, 1500], est: [1500, 4000], monthly: [100, 300], days: 4 },
  C9: { name: 'Payment reminders & collections', start: [400, 900], est: [1000, 2500], monthly: [100, 250], days: 3 },
  C10: { name: 'Proposal & quote generation', start: [750, 1800], est: [2000, 5000], monthly: [150, 400], days: 5 },
  C11: { name: 'RFP / tender response drafting', start: [1000, 2500], est: [3000, 8000], monthly: [200, 500], days: 8 },
  D1: { name: 'Workflow automation with AI steps', start: [300, 1000], est: [1000, 3000], monthly: [100, 300], days: 2 },
  D2: { name: 'Internal knowledge assistant', start: [1000, 2500], est: [3000, 8000], monthly: [200, 500], days: 8 },
  D5: { name: 'Data analysis assistant', start: [1000, 2500], est: [3000, 7000], monthly: [200, 500], days: 7 },
  D6: { name: 'Custom AI agent', start: [1500, 3000], est: [4000, 12000], monthly: [250, 800], days: 12 },
  D7: { name: 'CRM sales copilot', start: [750, 2000], est: [2500, 6000], monthly: [150, 400], days: 5 },
  D8: { name: 'Managed AI SDR', start: [1000, 2500], est: [3000, 6000], monthly: [500, 1500], days: 7 },
  D10: { name: 'Website + built-in AI assistant', start: [750, 2000], est: [2500, 7000], monthly: [100, 300], days: 6 },
};

const PACKAGES = {
  E1: { name: 'Real-Estate Agency', includes: ['B3', 'A5', 'A1', 'B4', 'C7'], setup: [2000, 5000], monthly: [350, 700] },
  E2: { name: 'Clinic & Dental', includes: ['A2', 'A1', 'A3', 'A5', 'A7'], setup: [2500, 6000], monthly: [400, 800] },
  E3: { name: 'E-commerce', includes: ['A1', 'A4', 'B4', 'A7'], setup: [2000, 5000], monthly: [400, 800] },
  E4: { name: 'Restaurant & Hospitality', includes: ['A2', 'A1', 'A5', 'A7', 'B4'], setup: [1500, 3500], monthly: [300, 600] },
  E5: { name: 'Law Firm', includes: ['A1', 'C4', 'C2', 'C5', 'C7'], setup: [3000, 8000], monthly: [500, 900] },
  E7: { name: 'Gym & Fitness Studio', includes: ['B3', 'A5', 'A1', 'A3', 'A7'], setup: [1500, 3500], monthly: [300, 600] },
  E8: { name: 'Hotel & Travel', includes: ['A1', 'A9', 'D1', 'A7'], setup: [2500, 6000], monthly: [400, 800] },
  E9: { name: 'Car Dealership', includes: ['B3', 'A5', 'A1', 'C4', 'A3', 'A7'], setup: [2500, 6000], monthly: [400, 800] },
  E10: { name: 'Accounting Firm', includes: ['C1', 'C9', 'A1', 'C7'], setup: [3000, 7000], monthly: [500, 900] },
  E11: { name: 'Education & Course Creator', includes: ['A1', 'D2', 'B3', 'C9', 'B8', 'A7'], setup: [1500, 4000], monthly: [300, 600] },
  E12: { name: 'Home Services & Trades', includes: ['A9', 'A5', 'A3', 'C10', 'B3', 'A7'], setup: [1500, 3500], monthly: [300, 600] },
};

// Infra + token assumptions from docs/03. Deliberately conservative.
const COST = {
  vpsSharePerClient: 5,
  dbSharePerClient: 5,
  tokensPerChat: 4300,      // ~4k input with cached context + ~300 output
  costPerMillionTokens: 4,  // blended mid-tier rate, cache-friendly prompts
  voiceCostPerMinute: 0.11,
  minutesPerCall: 3.5,
};

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const range = ([lo, hi]) => `${money(lo)} – ${money(hi)}`;

function retainerTier(monthlyLo, monthlyHi) {
  const mid = (monthlyLo + monthlyHi) / 2;
  if (mid >= 450) return 'Scale ($500–800)';
  if (mid >= 200) return 'Growth ($250–350)';
  return 'Basic ($100–150)';
}

function usageCost({ chats, calls }) {
  const tokenCost = (chats * COST.tokensPerChat / 1_000_000) * COST.costPerMillionTokens;
  const voiceCost = calls * COST.minutesPerCall * COST.voiceCostPerMinute;
  return { tokenCost, voiceCost };
}

function printQuote({ codes, established, chats, calls, pkg }) {
  const label = established ? 'established' : 'starting out';
  let buildLo = 0, buildHi = 0, monthlyLo = 0, monthlyHi = 0, days = 0, hasVoice = false;

  console.log();
  if (pkg) {
    const p = PACKAGES[pkg];
    console.log(`  ${pkg} — ${p.name} Package`);
    console.log(`  ${'─'.repeat(52)}`);
    for (const code of p.includes) {
      const s = SERVICES[code];
      console.log(`  · ${code.padEnd(4)} ${s.name}`);
      days += s.days;
      hasVoice = hasVoice || Boolean(s.voice);
    }
    [buildLo, buildHi] = p.setup;
    [monthlyLo, monthlyHi] = p.monthly;
  } else {
    console.log(`  Quote — ${codes.length} service(s), ${label} prices`);
    console.log(`  ${'─'.repeat(52)}`);
    for (const code of codes) {
      const s = SERVICES[code];
      const build = established ? s.est : s.start;
      console.log(`  · ${code.padEnd(4)} ${s.name.padEnd(34)} ${range(build)}`);
      buildLo += build[0];
      buildHi += build[1];
      monthlyLo += s.monthly[0];
      monthlyHi += s.monthly[1];
      days += s.days;
      hasVoice = hasVoice || Boolean(s.voice);
    }
    if (codes.length > 1) {
      // Bundle discount per the package rules in docs/08.
      const discount = 0.2;
      console.log(`\n  Bundle discount (20%, per docs/08 package rules)`);
      buildLo *= 1 - discount;
      buildHi *= 1 - discount;
      monthlyLo *= 1 - discount;
      monthlyHi *= 1 - discount;
    }
  }

  const { tokenCost, voiceCost } = usageCost({ chats, calls });
  const infra = COST.vpsSharePerClient + COST.dbSharePerClient;
  // Voice minutes are billed to the client on top of the retainer (docs/01),
  // so they are not a cost against retainer margin — they are their own line
  // with their own markup.
  const cogs = infra + tokenCost;
  const marginLo = ((monthlyLo - cogs) / monthlyLo) * 100;
  const marginHi = ((monthlyHi - cogs) / monthlyHi) * 100;

  console.log(`\n  BUILD FEE          ${range([buildLo, buildHi])}`);
  console.log(`  50% deposit        ${range([buildLo / 2, buildHi / 2])}`);
  console.log(`  Delivery estimate  ~${days} working days (${Math.ceil(days / 5)} week(s))`);
  console.log(`\n  RETAINER           ${range([monthlyLo, monthlyHi])} / month`);
  console.log(`  Suggested tier     ${retainerTier(monthlyLo, monthlyHi)}`);

  console.log(`\n  Monthly cost of goods at ${chats.toLocaleString()} chats:`);
  console.log(`    infra share      ${money(infra)}`);
  console.log(`    LLM tokens       ${money(tokenCost)}`);
  console.log(`    total COGS       ${money(cogs)}`);
  console.log(`    gross margin     ${marginLo.toFixed(0)}% – ${marginHi.toFixed(0)}%`);

  if (hasVoice) {
    const billed = voiceCost * 1.4;
    console.log(`\n  Voice usage, billed on top at cost +40% (${calls.toLocaleString()} calls):`);
    console.log(`    your cost        ${money(voiceCost)}`);
    console.log(`    bill the client  ${money(billed)}   (+${money(billed - voiceCost)} margin)`);
    console.log(`    Put a monthly minute allowance in the contract — never unmetered.`);
  }

  if (marginLo < 50) {
    console.log(`\n  ⚠ Margin below 50% at the low retainer price. Raise the retainer,`);
    console.log(`    set a usage allowance, or move to a cheaper model tier (docs/03).`);
  }

  const yearLo = buildLo + monthlyLo * 12 + (hasVoice ? voiceCost * 0.4 * 12 : 0);
  const yearHi = buildHi + monthlyHi * 12 + (hasVoice ? voiceCost * 0.4 * 12 : 0);
  console.log(`\n  First-year value   ${range([yearLo, yearHi])}`);
  console.log();
}

function list() {
  console.log('\n  SERVICES (docs/02-services-catalog.md)\n');
  for (const [code, s] of Object.entries(SERVICES)) {
    console.log(`  ${code.padEnd(4)} ${s.name.padEnd(36)} ${range(s.start).padEnd(18)} +${range(s.monthly)}/mo`);
  }
  console.log('\n  PACKAGES (docs/08-industry-packages.md)\n');
  for (const [code, p] of Object.entries(PACKAGES)) {
    console.log(`  ${code.padEnd(4)} ${(p.name + ' Package').padEnd(36)} ${range(p.setup).padEnd(18)} +${range(p.monthly)}/mo`);
  }
  console.log('\n  Usage: node tools/quote.js A1 D1 [--established] [--chats N] [--calls N]');
  console.log('         node tools/quote.js --package E2\n');
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h') || args.includes('--list')) {
    return list();
  }

  const established = args.includes('--established');
  const numberArg = (flag, fallback) => {
    const i = args.indexOf(flag);
    return i !== -1 && args[i + 1] ? Number(args[i + 1]) : fallback;
  };
  const chats = numberArg('--chats', 2000);
  const calls = numberArg('--calls', 400);

  const pkgIndex = args.indexOf('--package');
  if (pkgIndex !== -1) {
    const pkg = (args[pkgIndex + 1] || '').toUpperCase();
    if (!PACKAGES[pkg]) {
      console.error(`Unknown package "${pkg}". Known: ${Object.keys(PACKAGES).join(', ')}`);
      process.exit(1);
    }
    return printQuote({ codes: [], established, chats, calls, pkg });
  }

  const flagValues = new Set(['--chats', '--calls'].flatMap((f) => {
    const i = args.indexOf(f);
    return i !== -1 ? [args[i + 1]] : [];
  }));
  const codes = args
    .filter((a) => !a.startsWith('--') && !flagValues.has(a))
    .map((a) => a.toUpperCase());

  const unknown = codes.filter((c) => !SERVICES[c]);
  if (codes.length === 0 || unknown.length) {
    console.error(unknown.length ? `Unknown service code(s): ${unknown.join(', ')}` : 'No service codes given.');
    console.error('Run with --list to see the catalog.');
    process.exit(1);
  }

  printQuote({ codes, established, chats, calls, pkg: null });
}

main();
