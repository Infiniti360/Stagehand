import { mobileTest, expect } from '../../src/fixtures/mobile-fixtures';

mobileTest.describe('Native App Tests', () => {
  mobileTest('should interact with native app', async ({ nativeApp, isNativeApp }) => {
    if (!isNativeApp || !nativeApp) {
      mobileTest.skip();
      return;
    }

    // Wait for element
    await nativeApp.waitForElement('email-input');

    // Type text
    await nativeApp.type('email-input', 'user@example.com');

    // Click element
    await nativeApp.click('login-button');

    // Verify app is responsive
    const isResponsive = await nativeApp.isAppResponsive();
    expect(isResponsive).toBeTruthy();
  });

  mobileTest('should handle app backgrounding', async ({ nativeApp, isNativeApp }) => {
    if (!isNativeApp || !nativeApp) {
      mobileTest.skip();
      return;
    }

    // Background app for 3 seconds
    await nativeApp.background(3);

    // Activate app again
    await nativeApp.activate();

    // Verify app is still responsive
    const isResponsive = await nativeApp.isAppResponsive();
    expect(isResponsive).toBeTruthy();
  });
});

