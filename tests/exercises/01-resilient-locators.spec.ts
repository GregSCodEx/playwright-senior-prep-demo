import { test, expect } from '@playwright/test';

// CHALLENGE 1 (Day 2): Refactor the legacy test below following Senior Playwright standards.
// Requirements:
// 1. Replace XPath with semantic filtering `.filter({ hasText: 'Smartwatch Pro' })`.
// 2. Replace the synchronous text assertion on the cart badge with `await expect(cartBadge).toHaveText('1')`.
// 3. Remove all `page.waitForTimeout(...)` calls.
test('add product to cart - legacy code', async ({ page }) => {
  await page.goto('/shop');
  await page.waitForTimeout(3000); // ❌ Remove artificial wait

  // ❌ Replace brittle XPath:
  const legacyButton = page.locator('xpath=//article[contains(@class, "product-card")][2]//button[@type="submit"]');
  await legacyButton.click();

  await page.waitForTimeout(2000); // ❌ Remove artificial wait

  // ❌ Replace synchronous assertion:
  const badgeText = await page.locator('#cart-count-badge').textContent();
  expect(badgeText?.trim()).toBe('1');
});
