import { test, expect } from '@playwright/test';

// CHALLENGE 3 (Day 3): Async Polling on API status (expect.poll)
// Sandbox target: http://127.0.0.1:4173/batch-jobs and GET /api/jobs/:id
test('Background batch job completes successfully', async ({ page, request }) => {
  await page.goto('/batch-jobs');
  await page.getByRole('button', { name: 'Start process' }).click();

  const jobIdLocator = page.getByTestId('job-id');
  await expect(jobIdLocator).not.toBeEmpty();
  const jobId = (await jobIdLocator.innerText()).trim();

  // TODO: Use await expect.poll(async () => ..., { intervals: [250], timeout: 15_000 }).toBe('COMPLETED')
  expect(jobId).toBeTruthy();
  expect(request).toBeDefined();
});
