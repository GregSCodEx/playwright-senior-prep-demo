import { test, expect } from '@playwright/test';

test('Background batch job completes successfully', async ({ page, request }) => {
  await page.goto('/batch-jobs');
  await page.getByRole('button', { name: 'Start process' }).click();

  const jobIdLocator = page.getByTestId('job-id');
  await expect(jobIdLocator).not.toBeEmpty();
  const jobId = (await jobIdLocator.innerText()).trim();

  await expect.poll(
    async () => {
      const response = await request.get(`/api/jobs/${jobId}`);
      const body = await response.json();
      return body.status;
    },
    {
      message: `Job ${jobId} did not reach COMPLETED status within timeout`,
      intervals: [250],
      timeout: 15_000,
    }
  ).toBe('COMPLETED');
});
