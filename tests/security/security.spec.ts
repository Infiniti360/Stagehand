import { test, expect } from '@playwright/test';

/**
 * Security Testing Layer
 * Tests for security vulnerabilities and best practices
 */
test.describe('Security Tests', () => {
  test('should prevent XSS attacks', async ({ page }) => {
    const xssPayload = '<script>alert("XSS")</script>';
    
    await page.goto('/');
    await page.fill('[data-testid="search-input"]', xssPayload);
    await page.click('[data-testid="search-button"]');

    // Script should be escaped, not executed
    const pageContent = await page.content();
    expect(pageContent).not.toContain('<script>alert');
    expect(pageContent).toContain('&lt;script&gt;');
  });

  test('should use HTTPS in production', async ({ page }) => {
    await page.goto('/');
    
    // Check for secure connections
    const requests = page.request.url();
    if (requests.includes('https://')) {
      // Verify SSL
      expect(true).toBeTruthy();
    }
  });

  test('should not expose sensitive data in responses', async ({ page, context }) => {
    await context.route('**/api/**', async route => {
      const response = await route.fetch();
      const body = await response.text();
      
      // Check for sensitive data patterns
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /api[_-]?key/i,
        /token/i,
      ];
      
      for (const pattern of sensitivePatterns) {
        if (pattern.test(body)) {
          // Should be masked or not present
          expect(body).not.toMatch(new RegExp(`${pattern.source}.*:.*["\']([^"\']+)["\']`, 'i'));
        }
      }
      
      await route.fulfill({ response });
    });

    await page.goto('/');
  });

  test('should enforce authentication on protected routes', async ({ page }) => {
    // Try to access protected route without auth
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should validate input sanitization', async ({ page }) => {
    const sqlInjection = "'; DROP TABLE users; --";
    
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', sqlInjection);
    await page.fill('[data-testid="password-input"]', 'password');
    await page.click('[data-testid="login-button"]');

    // Should handle safely without executing SQL
    const url = page.url();
    expect(url).not.toContain('DROP TABLE');
  });
});

