import { test, expect } from '@playwright/test';

/**
 * Integration Testing Layer
 * Tests component integration and workflows
 */
test.describe('Integration Tests', () => {
  test('user authentication integration', async ({ page, request }) => {
    // Login via API
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        email: 'user@example.com',
        password: 'password123',
      },
    });

    expect(loginResponse.ok()).toBeTruthy();
    const { token } = await loginResponse.json();

    // Use token in browser
    await page.goto('/');
    await page.evaluate((t) => {
      localStorage.setItem('token', t);
    }, token);

    // Verify authenticated state
    await page.reload();
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('form submission integration', async ({ page }) => {
    await page.goto('/contact');
    
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="message-input"]', 'Test message');
    await page.click('[data-testid="submit-button"]');

    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('search functionality integration', async ({ page }) => {
    await page.goto('/');
    
    await page.fill('[data-testid="search-input"]', 'test query');
    await page.click('[data-testid="search-button"]');

    // Verify results
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  });
});

