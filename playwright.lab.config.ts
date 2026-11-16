import { defineConfig, devices } from '@playwright/test';

const isExercisesMode = process.env.LAB_MODE === 'exercises';
const testFolder = isExercisesMode ? 'tests/exercises' : 'tests/solutions';

export default defineConfig({
  testDir: `./${testFolder}`,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-lab-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx tsx lab/server.ts',
    url: 'http://127.0.0.1:4173/health',
    reuseExistingServer: !process.env.CI,
    timeout: 30 * 1000,
  },
});
