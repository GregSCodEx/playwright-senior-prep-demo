import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const rawArgs = process.argv.slice(2);
const firstArg = rawArgs[0];
const hasExplicitMode = firstArg === 'exercises' || firstArg === 'solutions';
const mode = hasExplicitMode ? firstArg : 'exercises';
const extraArgs = hasExplicitMode ? rawArgs.slice(1) : rawArgs;

const configFile = fs.existsSync(path.resolve(process.cwd(), 'playwright.lab.config.ts'))
  ? 'playwright.lab.config.ts'
  : 'playwright.config.ts';

const playwrightCli = path.resolve(process.cwd(), 'node_modules/@playwright/test/cli.js');

const result = fs.existsSync(playwrightCli)
  ? spawnSync(process.execPath, [playwrightCli, 'test', '-c', configFile, ...extraArgs], {
      stdio: 'inherit',
      env: { ...process.env, LAB_MODE: mode },
    })
  : spawnSync('npx', ['playwright', 'test', '-c', configFile, ...extraArgs], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: { ...process.env, LAB_MODE: mode },
    });

process.exit(result.status ?? 1);
