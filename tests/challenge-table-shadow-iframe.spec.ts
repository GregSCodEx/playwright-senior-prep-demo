import { test, expect } from '@playwright/test';

/**
 * Challenge 2 (Day 2): Dynamic Table, Shadow DOM & iframe (challenge-table-shadow-iframe)
 */
test.describe('Challenge 2: Dynamic Table, Shadow DOM & iframe', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Invoices Panel</title>
        </head>
        <body style="font-family: sans-serif; padding: 20px;">
          <h1>Invoices</h1>
          <table border="1" cellpadding="8">
            <thead>
              <tr>
                <th>Number</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr data-invoice="INV-2025">
                <td>Invoice #INV-2025</td>
                <td>$190</td>
                <td class="status">PAID</td>
                <td><button type="button">Details</button></td>
              </tr>
              <tr data-invoice="INV-2026">
                <td>Invoice #INV-2026</td>
                <td>$490</td>
                <td class="status">PENDING</td>
                <td><button type="button" id="open-inv-2026">Details</button></td>
              </tr>
            </tbody>
          </table>

          <section id="details-panel" hidden style="margin-top: 20px;">
            <promo-coupon-box></promo-coupon-box>
            <div style="margin-top: 12px;">
              <iframe
                title="Payment Gateway"
                width="360"
                height="120"
                srcdoc="
                  <!DOCTYPE html>
                  <html lang='en'>
                    <body style='font-family: sans-serif; padding: 12px;'>
                      <button type='button' onclick='window.parent.postMessage(\"PAYMENT_CONFIRMED\", \"*\")'>
                        Confirm transaction
                      </button>
                    </body>
                  </html>
                "
              ></iframe>
            </div>
          </section>

          <script>
            class PromoCouponBox extends HTMLElement {
              constructor() {
                super();
                const shadow = this.attachShadow({ mode: 'open' });
                shadow.innerHTML = \`
                  <div>
                    <label for="coupon-code">Discount code</label>
                    <input id="coupon-code" type="text" placeholder="Enter promo code..." />
                  </div>
                \`;
              }
            }
            customElements.define('promo-coupon-box', PromoCouponBox);

            document.getElementById('open-inv-2026').addEventListener('click', () => {
              document.getElementById('details-panel').hidden = false;
            });

            window.addEventListener('message', (event) => {
              if (event.data === 'PAYMENT_CONFIRMED') {
                setTimeout(() => {
                  const row = document.querySelector('tr[data-invoice="INV-2026"] .status');
                  if (row) row.textContent = 'PAID';
                }, 80);
              }
            });
          </script>
        </body>
      </html>
    `);
  });

  test('Pay invoice across dynamic table, Shadow DOM, and iframe', async ({ page }) => {
    const invoiceRow = page
      .getByRole('row')
      .filter({ hasText: 'Invoice #INV-2026' });

    await invoiceRow.getByRole('button', { name: 'Details' }).click();

    await page.getByLabel('Discount code').fill('VIP-2026');

    const paymentFrame = page.frameLocator('iframe[title="Payment Gateway"]');
    await paymentFrame.getByRole('button', { name: 'Confirm transaction' }).click();

    await expect(invoiceRow).toContainText('PAID');
  });
});
