# Setup Guide

This guide will help you set up the Playwright boilerplate for your project.

## Quick Start

1. **Copy the boilerplate** to your desired location
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npm run playwright:install
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

## Detailed Setup

### 1. Web Testing Setup

No additional setup required. Just configure your `BASE_URL` in `.env`:

```bash
BASE_URL=http://localhost:3000
```

### 2. Mobile Web Testing Setup

Mobile web testing uses Playwright's device emulation. No additional setup needed.

### 3. Native Mobile Testing Setup

#### Install Appium

```bash
npm install -g appium
appium driver install uiautomator2  # For Android
appium driver install xcuitest       # For iOS
```

#### Android Setup

1. Install Android SDK
2. Set `ANDROID_HOME` environment variable:
   ```bash
   export ANDROID_HOME=/path/to/android/sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```
3. Start Android emulator or connect physical device
4. Verify device is connected:
   ```bash
   adb devices
   ```

#### iOS Setup (macOS only)

1. Install Xcode from App Store
2. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```
3. List available simulators:
   ```bash
   xcrun simctl list devices
   ```
4. Boot a simulator:
   ```bash
   xcrun simctl boot "iPhone 15"
   ```

#### Configure App Paths

Update `.env` with your app paths:

```bash
ANDROID_APP_PATH=./builds/your-app.apk
IOS_APP_PATH=./builds/your-app.ipa
ANDROID_BUNDLE_ID=com.yourcompany.app
IOS_BUNDLE_ID=com.yourcompany.app
```

### 4. Docker Setup

#### Build Docker Image

```bash
npm run docker:build
```

#### Run Tests in Docker

```bash
npm run docker:test
```

Or manually:

```bash
docker-compose -f docker/docker-compose.yml run --rm playwright test
```

## Next Steps

1. Review example tests in `examples/` directory
2. Create your own tests in `tests/` directory
3. Customize Playwright configs in `src/configs/`
4. Add your own helpers in `src/helpers/`

## Troubleshooting

See the main [README.md](README.md) for troubleshooting tips.

