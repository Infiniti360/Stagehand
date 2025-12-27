# Stagehand

Stagehand is a scalable Playwright automation framework built with TypeScript to support reliable end-to-end testing. Designed to work behind the scenes, it provides a strong foundation with reusable utilities, clean architecture, CI/CD readiness, and rich reporting to ensure consistent test execution across environments.

## Features

A comprehensive framework for Playwright testing with support for:
- 🌐 **Web Testing** - Desktop and mobile web browsers
- 📱 **Mobile Web Testing** - Mobile browser emulation
- 📲 **Native Mobile Testing** - Android/iOS native apps via Appium
- 🐳 **Docker Support** - Containerized test execution
- 🤖 **Appium Integration** - Native app automation

### Key Capabilities

- ✅ Multiple test configurations (Web, Mobile Web, Native)
- ✅ Appium bridge for native mobile app testing
- ✅ Docker setup for consistent test environments
- ✅ Comprehensive reporting (HTML, JUnit, JSON, Allure)
- ✅ TypeScript support with full type safety
- ✅ Example test files and comprehensive documentation
- ✅ Environment-based configuration
- ✅ CI/CD ready with GitHub Actions workflows

## Prerequisites

### For Web Testing
- Node.js >= 18.0.0
- npm or yarn

### For Native Mobile Testing
1. **Appium Server**
   ```bash
   npm install -g appium
   appium driver install uiautomator2  # For Android
   appium driver install xcuitest       # For iOS
   ```

2. **Android Setup** (for Android native tests)
   - Android SDK installed
   - `ANDROID_HOME` environment variable set
   - ADB available in PATH
   - Android emulator or physical device connected

3. **iOS Setup** (for iOS native tests, macOS only)
   - Xcode installed
   - iOS Simulator available
   - Xcode command line tools installed

## Installation

1. Clone or copy this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npm run playwright:install
   ```

4. Copy environment file:
   ```bash
   cp .env.example .env
   ```

5. Update `.env` with your configuration

## Project Structure

```
Stagehand/
├── src/
│   ├── configs/              # Playwright configurations
│   │   ├── playwright.base.config.ts
│   │   ├── playwright.web.config.ts
│   │   └── playwright.mobile.config.ts
│   ├── fixtures/             # Test fixtures
│   │   └── mobile-fixtures.ts
│   └── helpers/              # Helper utilities
│       └── appium/           # Appium integration
│           ├── appium-bridge.ts
│           └── native-app-helpers.ts
├── tests/
│   ├── web/                  # Web tests
│   ├── mobile/               # Mobile web tests
│   └── native/               # Native app tests
├── examples/                 # Example test files
├── docker/                   # Docker configuration
│   ├── Dockerfile
│   └── docker-compose.yml
└── package.json
```

## Usage

### Web Testing

Run web tests:
```bash
npm run test:web
```

Run specific project:
```bash
npx playwright test --config=src/configs/playwright.web.config.ts --project=desktop-chrome
```

### Mobile Web Testing

Run mobile web tests:
```bash
npm run test:mobile:web
```

### Native Mobile Testing

1. Start Appium server:
   ```bash
   npm run appium:start
   # Or: appium
   ```

2. Run native tests:
   ```bash
   npm run test:mobile:native
   ```

3. Run specific platform:
   ```bash
   npx playwright test --config=src/configs/playwright.mobile.config.ts --project=mobile-android-native
   npx playwright test --config=src/configs/playwright.mobile.config.ts --project=mobile-ios-native
   ```

### Docker Testing

Build Docker image:
```bash
npm run docker:build
```

Run tests in Docker:
```bash
npm run docker:test
```

Or manually:
```bash
docker-compose -f docker/docker-compose.yml run --rm playwright test
```

### UI Mode

Run tests in UI mode:
```bash
npm run test:ui
```

### Debug Mode

Run tests in debug mode:
```bash
npm run test:debug
```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Base URL
BASE_URL=http://localhost:3000

# Mobile App Paths
ANDROID_APP_PATH=./builds/android-app.apk
IOS_APP_PATH=./builds/ios-app.ipa

# Bundle IDs
ANDROID_BUNDLE_ID=com.example.app
IOS_BUNDLE_ID=com.example.app

# Device Configuration
PLATFORM=Android
DEVICE_NAME=Android Emulator
ANDROID_PLATFORM_VERSION=15
IOS_PLATFORM_VERSION=17.0
```

### Playwright Configs

- `playwright.base.config.ts` - Base configuration shared by all configs
- `playwright.web.config.ts` - Web testing configuration
- `playwright.mobile.config.ts` - Mobile web and native app testing

## Writing Tests

### Web Tests

```typescript
import { test, expect } from '@playwright/test';

test('should load homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Example/);
});
```

### Mobile Web Tests

```typescript
import { test, expect } from '@playwright/test';

test('should work on mobile', async ({ page }) => {
  await page.goto('/');
  // Mobile-specific assertions
});
```

### Native App Tests

```typescript
import { mobileTest, expect } from '../src/fixtures/mobile-fixtures';

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
});
```

## Available Native App Methods

- `nativeApp.click(accessibilityId)` - Click element by accessibility ID
- `nativeApp.type(accessibilityId, text)` - Type text into element
- `nativeApp.getText(accessibilityId)` - Get element text
- `nativeApp.waitForElement(accessibilityId, timeout)` - Wait for element
- `nativeApp.elementExists(accessibilityId)` - Check if element exists
- `nativeApp.pressBack()` - Press Android back button
- `nativeApp.background(seconds)` - Background app
- `nativeApp.activate(bundleId?)` - Activate app
- `nativeApp.terminate(bundleId?)` - Terminate app
- `nativeApp.reload()` - Reload app session
- `nativeApp.takeScreenshot()` - Take screenshot
- `nativeApp.isAppResponsive()` - Check if app is responsive

## Reports

View HTML report:
```bash
npm run report
```

View trace:
```bash
npm run trace
```

Reports are generated in:
- `reports/html/` - HTML report
- `reports/junit/` - JUnit XML
- `reports/json/` - JSON results
- `reports/allure-results/` - Allure results

## Troubleshooting

### Appium Server Not Running
```
Error: Could not connect to Appium server
```
**Solution:** Start Appium server: `appium`

### Android Device Not Found
```
Error: No Android devices found
```
**Solution:** 
- Check ADB: `adb devices`
- Start emulator or connect physical device
- Verify `ANDROID_HOME` is set

### iOS Simulator Not Available
```
Error: iOS Simulator not found
```
**Solution:**
- Verify Xcode is installed
- List simulators: `xcrun simctl list devices`
- Boot a simulator: `xcrun simctl boot <device-id>`

### App Not Found
```
Error: App file not found
```
**Solution:** Set `ANDROID_APP_PATH` or `IOS_APP_PATH` environment variable to correct app file path

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run playwright:install
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## License

MIT

## Documentation

- [README.md](README.md) - Main documentation
- [SETUP.md](SETUP.md) - Detailed setup instructions
- [ARCHITECTURE.md](ARCHITECTURE.md) - Framework architecture and design
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [SUMMARY.md](SUMMARY.md) - Project overview
- [CHANGELOG.md](CHANGELOG.md) - Version history

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to Stagehand.

