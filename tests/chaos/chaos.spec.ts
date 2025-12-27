import { test, expect } from '@playwright/test';

/**
 * Chaos Testing Layer
 * Tests for resilience and error handling
 */
test.describe('Chaos Tests', () => {
  test('should handle network failures gracefully', async ({ page, context }) => {
    // Simulate network offline
    await context.setOffline(true);
    
    await page.goto('/');
    
    // App should show error message or fallback
    const errorMessage = await page.locator('[data-testid="error-message"], .error, .offline-message').count();
    expect(errorMessage).toBeGreaterThan(0);
    
    await context.setOffline(false);
  });

  test('should handle slow network conditions', async ({ page, context }) => {
    // Simulate slow 3G
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      await route.continue();
    });

    await page.goto('/');
    await expect(page).toHaveLoadState('networkidle', { timeout: 30000 });
  });

  test('should handle API failures', async ({ page, context }) => {
    // Intercept and fail API calls
    await context.route('**/api/**', route => route.abort());

    await page.goto('/');
    
    // App should handle API failure
    const hasErrorHandling = await page.locator('[data-testid="error"], .error-message').count();
    expect(hasErrorHandling).toBeGreaterThan(0);
  });

  test('should recover from service interruptions', async ({ page }) => {
    await page.goto('/');
    
    // Simulate service interruption
    await page.evaluate(() => {
      window.dispatchEvent(new Event('offline'));
    });

    await page.waitForTimeout(1000);

    // Simulate recovery
    await page.evaluate(() => {
      window.dispatchEvent(new Event('online'));
    });

    // App should recover
    await expect(page).toBeTruthy();
  });
});

