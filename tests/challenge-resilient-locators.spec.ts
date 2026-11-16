import { test, expect } from '@playwright/test';

/**
 * Challenge 1: Resilient Locators Refactoring (challenge-resilient-locators)
 */
test.describe('Challenge 1: Resilient Locators Refactoring', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Test Shop</title>
        </head>
        <body style="font-family: sans-serif; padding: 20px;">
          <header>
            <div id="cart">
              Cart: <span data-testid="cart-count-badge" id="cart-count-badge">0</span>
            </div>
          </header>
          <main>
            <article class="product-card" style="border: 1px solid #ccc; margin: 10px; padding: 10px;">
              <h3>Wireless Headphones</h3>
              <button type="submit">Add to cart</button>
            </article>
            <article class="product-card" style="border: 1px solid #ccc; margin: 10px; padding: 10px;">
              <h3>Smartwatch Pro</h3>
              <button type="submit" onclick="setTimeout(() => { document.getElementById('cart-count-badge').textContent = '1'; }, 100);">
                Add to cart
              </button>
            </article>
          </main>
        </body>
      </html>
    `);
  });

  test('add product to cart - modern Playwright', async ({ page }) => {
    const productCard = page
      .getByRole('article')
      .filter({ hasText: 'Smartwatch Pro' });

    await productCard
      .getByRole('button', { name: 'Add to cart' })
      .click();

    const cartBadge = page.getByTestId('cart-count-badge');
    await expect(cartBadge).toHaveText('1');
  });
});
