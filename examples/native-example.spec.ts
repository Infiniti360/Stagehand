import { mobileTest, expect } from '../src/fixtures/mobile-fixtures';

/**
 * Example native app test file
 * This demonstrates native mobile app testing with Appium
 */

mobileTest.describe('Example Native App Tests', () => {
  mobileTest('should login to native app', async ({ nativeApp, isNativeApp }) => {
    if (!isNativeApp || !nativeApp) {
      mobileTest.skip();
      return;
    }

    // Wait for login screen
    await nativeApp.waitForElement('email-input');
    await nativeApp.waitForElement('password-input');
    await nativeApp.waitForElement('login-button');

    // Enter credentials
    await nativeApp.type('email-input', 'user@example.com');
    await nativeApp.type('password-input', 'password123');

    // Click login button
    await nativeApp.click('login-button');

    // Wait for home screen
    await nativeApp.waitForElement('home-screen', 15000);

    // Verify app is responsive
    const isResponsive = await nativeApp.isAppResponsive();
    expect(isResponsive).toBeTruthy();
  });

  mobileTest('should navigate in native app', async ({ nativeApp, isNativeApp }) => {
    if (!isNativeApp || !nativeApp) {
      mobileTest.skip();
      return;
    }

    // Navigate to a screen
    await nativeApp.waitForElement('menu-button');
    await nativeApp.click('menu-button');

    // Wait for menu to appear
    await nativeApp.waitForElement('menu-item-settings');

    // Click settings
    await nativeApp.click('menu-item-settings');

    // Verify settings screen
    await nativeApp.waitForElement('settings-screen');
  });

  mobileTest('should handle app lifecycle', async ({ nativeApp, isNativeApp }) => {
    if (!isNativeApp || !nativeApp) {
      mobileTest.skip();
      return;
    }

    // Verify app is responsive initially
    expect(await nativeApp.isAppResponsive()).toBeTruthy();

    // Background app
    await nativeApp.background(5);

    // Activate app again
    await nativeApp.activate();

    // Verify app is still responsive
    expect(await nativeApp.isAppResponsive()).toBeTruthy();
  });
});

