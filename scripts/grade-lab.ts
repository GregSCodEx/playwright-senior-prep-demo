import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { CODING_CHALLENGES } from '../src/data/codingChallenges';

const args = process.argv.slice(2);
const useSolutions = args.includes('--solutions');
const runPlaywright = args.includes('--run');
const targetDir = path.resolve(process.cwd(), useSolutions ? 'tests/solutions' : 'tests/exercises');

const challengeFileMap: Record<string, string> = {
  'challenge-resilient-locators': '01-resilient-locators.spec.ts',
  'challenge-table-shadow-iframe': '02-table-shadow-iframe.spec.ts',
  'challenge-expect-poll': '03-expect-poll.spec.ts',
};

console.log(`\n=== Playwright Senior Lab Grader — Demo (${useSolutions ? 'SOLUTIONS' : 'EXERCISES'}) ===\n`);

let totalRules = 0;
let passedRules = 0;

for (const challenge of CODING_CHALLENGES) {
  const fileName = challengeFileMap[challenge.id];
  const filePath = path.join(targetDir, fileName);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ [MISSING FILE] ${fileName}`);
    totalRules += challenge.validationRules.length;
    continue;
  }

  const code = fs.readFileSync(filePath, 'utf-8');
  const results = challenge.validationRules.map((rule) => {
    totalRules += 1;
    const outcome = rule.check(code);
    if (outcome.passed) passedRules += 1;
    return { ...outcome, label: rule.label };
  });

  const allPassed = results.every((r) => r.passed);
  console.log(`${allPassed ? '✅' : '⚠️ '} ${challenge.title} (${fileName})`);
  for (const r of results) {
    console.log(`   ${r.passed ? '✓' : '✕'} ${r.label}${r.passed ? '' : ` -> ${r.feedback}`}`);
  }
}

console.log(`\nStatic analysis score: ${passedRules}/${totalRules} rules passed.`);

if (runPlaywright) {
  console.log('\nRunning Playwright against the Training Sandbox App...\n');
  const mode = useSolutions ? 'solutions' : 'exercises';
  const playwrightCli = path.resolve(process.cwd(), 'node_modules/@playwright/test/cli.js');
  const configFile = fs.existsSync(path.resolve(process.cwd(), 'playwright.lab.config.ts'))
    ? 'playwright.lab.config.ts'
    : 'playwright.config.ts';

  const result = fs.existsSync(playwrightCli)
    ? spawnSync(process.execPath, [playwrightCli, 'test', '-c', configFile], {
        stdio: 'inherit',
        env: { ...process.env, LAB_MODE: mode },
      })
    : spawnSync('npx', ['playwright', 'test', '-c', configFile], {
        stdio: 'inherit',
        shell: process.platform === 'win32',
        env: { ...process.env, LAB_MODE: mode },
      });

  process.exitCode = result.status ?? 1;
} else if (passedRules < totalRules) {
  process.exitCode = 1;
}
