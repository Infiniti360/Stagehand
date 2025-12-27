import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';

/**
 * End-to-End Testing Layer
 * Complete user journey tests
 */
test.describe('E2E Tests', () => {
  test('complete user registration and login flow', async ({ page }) => {
    // Registration
    await page.goto('/register');
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.click('[data-testid="register-button"]');
    
    await expect(page).toHaveURL(/.*dashboard/);

    // Logout
    await page.click('[data-testid="logout-button"]');
    await expect(page).toHaveURL(/.*login/);

    // Login
    const loginPage = new LoginPage(page);
    await loginPage.login('user@example.com', 'password123');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('complete shopping cart flow', async ({ page }) => {
    await page.goto('/products');
    
    // Add product to cart
    await page.click('[data-testid="product-1"]');
    await page.click('[data-testid="add-to-cart"]');
    
    // Go to cart
    await page.click('[data-testid="cart-icon"]');
    await expect(page).toHaveURL(/.*cart/);
    
    // Verify item in cart
    const cartItem = page.locator('[data-testid="cart-item"]');
    await expect(cartItem).toBeVisible();
    
    // Checkout
    await page.click('[data-testid="checkout-button"]');
    await expect(page).toHaveURL(/.*checkout/);
  });
});

