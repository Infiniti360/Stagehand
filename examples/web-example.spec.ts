import { test, expect } from '@playwright/test';

/**
 * Example web test file
 * This demonstrates basic Playwright web testing patterns
 */

test.describe('Example Web Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to base URL before each test
    await page.goto('/');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Example/);
  });

  test('should be able to click a button', async ({ page }) => {
    const button = page.locator('button:has-text("Click me")');
    await expect(button).toBeVisible();
    await button.click();
  });

  test('should fill a form', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for navigation or success message
    await page.waitForURL(/.*success/);
  });
});

