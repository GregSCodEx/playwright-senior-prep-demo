import { test, expect } from '@playwright/test';

test('add product to cart - modern Playwright', async ({ page }) => {
  await page.goto('/shop');

  const productCard = page
    .getByRole('article')
    .filter({ hasText: 'Smartwatch Pro' });

  await productCard
    .getByRole('button', { name: 'Add to cart' })
    .click();

  const cartBadge = page.getByTestId('cart-count-badge');
  await expect(cartBadge).toHaveText('1');
});
