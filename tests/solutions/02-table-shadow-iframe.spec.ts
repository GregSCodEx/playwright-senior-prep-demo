import { test, expect } from '@playwright/test';

test('Pay invoice across dynamic table, Shadow DOM, and iframe', async ({ page }) => {
  await page.goto('/invoices');

  const invoiceRow = page
    .getByRole('row')
    .filter({ hasText: 'Invoice #INV-2026' });

  await invoiceRow.getByRole('button', { name: 'Details' }).click();

  await page.getByLabel('Discount code').fill('VIP-2026');

  const paymentFrame = page.frameLocator('iframe[title="Payment Gateway"]');
  await paymentFrame.getByRole('button', { name: 'Confirm transaction' }).click();

  await expect(invoiceRow).toContainText('PAID');
});
