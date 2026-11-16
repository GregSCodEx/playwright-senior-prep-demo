import { test, expect } from '@playwright/test';

test.describe('Playwright Senior Prep Demo - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('home page loads properly with Demo header and stats', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright Senior Prep/i);
    await expect(page.getByText('PlaywrightSeniorPrep')).toBeVisible();
    await expect(page.getByText(/Demo Edition/i)).toBeVisible();
    await expect(page.getByText(/Senior Test Automation Engineer/i)).toBeVisible();
  });

  test('clicking locked Day 4 opens Demo Content Not Available modal', async ({ page }) => {
    await page.getByText(/Day 4/i).first().click();
    await expect(page.getByRole('heading', { name: /Content Not Available Yet/i })).toBeVisible();
  });

  test('navigation between tabs works smoothly', async ({ page }) => {
    await page.getByRole('button', { name: /Questions/i }).first().click();
    await expect(page.getByPlaceholder(/Search questions/i)).toBeVisible();

    await page.getByRole('button', { name: /Live Coding Lab/i }).first().click();
    await expect(page.getByRole('button', { name: /Run Test/i })).toBeVisible();

    await page.getByRole('button', { name: /Cheatsheet/i }).first().click();
    await expect(page.getByText(/6 Golden Rules for Senior \/ Principal QA Interviews/i)).toBeVisible();
  });

  test('virtual runner in Live Coding Lab validates reference solution', async ({ page }) => {
    await page.getByRole('button', { name: /Live Coding Lab/i }).first().click();
    await page.getByRole('button', { name: /Insert Reference Solution/i }).click();
    await page.getByRole('button', { name: /Run Test/i }).click();

    await expect(page.getByText(/PASS/i)).toBeVisible();
    await expect(page.getByText(/1 passed/i)).toBeVisible();
  });
});
