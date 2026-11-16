import { test, expect } from '@playwright/test';

// CHALLENGE 2 (Day 2): Dynamic Table, Shadow DOM, and nested <iframe>
// Sandbox target: http://127.0.0.1:4173/invoices
test('Pay invoice across dynamic table, Shadow DOM, and iframe', async ({ page }) => {
  await page.goto('/invoices');

  // 1. Locate the row containing "Invoice #INV-2026" without .nth() or XPath:
  // TODO: const invoiceRow = ...

  // 2. Click the "Details" button inside the filtered row:
  // TODO: ...

  // 3. Fill "VIP-2026" into the Shadow DOM input (label "Discount code"):
  // TODO: ...

  // 4. Switch into iframe "Payment Gateway" via page.frameLocator(...) and click "Confirm transaction":
  // TODO: const paymentFrame = ...

  // 5. Verify with a web-first assertion that the invoice row status becomes "PAID":
  // TODO: ...
});
