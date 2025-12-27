import { test, expect } from '@playwright/test';

/**
 * Mock Testing Layer
 * Tests with mocked API responses
 */
test.describe('Mock Tests', () => {
  test('should work with mocked API responses', async ({ page, context }) => {
    // Mock API response
    await context.route('**/api/users', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            { id: 1, name: 'Mock User 1', email: 'mock1@example.com' },
            { id: 2, name: 'Mock User 2', email: 'mock2@example.com' },
          ],
        }),
      });
    });

    await page.goto('/users');
    
    // Verify mocked data is displayed
    await expect(page.locator('text=Mock User 1')).toBeVisible();
    await expect(page.locator('text=Mock User 2')).toBeVisible();
  });

  test('should handle mocked error responses', async ({ page, context }) => {
    await context.route('**/api/products', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('/products');
    
    // Verify error handling
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should work with delayed mock responses', async ({ page, context }) => {
    await context.route('**/api/data', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ data: 'Delayed response' }),
      });
    });

    await page.goto('/data');
    
    // Verify loading state
    await expect(page.locator('[data-testid="loading"]')).toBeVisible();
    
    // Verify data after delay
    await expect(page.locator('text=Delayed response')).toBeVisible({ timeout: 5000 });
  });
});

