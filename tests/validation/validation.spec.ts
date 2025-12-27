import { test, expect } from '@playwright/test';

/**
 * Validation Testing Layer
 * Tests form validation and data validation
 */
test.describe('Validation Tests', () => {
  test('should validate email format', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.click('[data-testid="submit-button"]');

    // Should show validation error
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toContainText('email');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/contact');
    
    // Try to submit without filling required fields
    await page.click('[data-testid="submit-button"]');

    // Should show required field errors
    const requiredErrors = await page.locator('[data-testid*="-error"]').count();
    expect(requiredErrors).toBeGreaterThan(0);
  });

  test('should validate password strength', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('[data-testid="password-input"]', 'weak');
    await page.click('[data-testid="submit-button"]');

    // Should show password strength error
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
  });

  test('should validate number ranges', async ({ page }) => {
    await page.goto('/products');
    
    await page.fill('[data-testid="quantity-input"]', '999999');
    await page.click('[data-testid="add-to-cart"]');

    // Should validate max quantity
    await expect(page.locator('[data-testid="quantity-error"]')).toBeVisible();
  });

  test('should validate date formats', async ({ page }) => {
    await page.goto('/booking');
    
    await page.fill('[data-testid="date-input"]', 'invalid-date');
    await page.click('[data-testid="submit-button"]');

    // Should show date format error
    await expect(page.locator('[data-testid="date-error"]')).toBeVisible();
  });
});

