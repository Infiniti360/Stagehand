# Stagehand - Summary

Stagehand is a scalable Playwright automation framework that provides all the necessary components for comprehensive end-to-end testing with Web, Mobile, Native, Docker, and Appium support.

## Repository Structure

```
Stagehand/
├── src/
│   ├── configs/                    # Playwright configurations
│   │   ├── playwright.base.config.ts    # Base config shared by all
│   │   ├── playwright.web.config.ts     # Web testing config
│   │   └── playwright.mobile.config.ts  # Mobile web & native config
│   ├── fixtures/                    # Test fixtures
│   │   └── mobile-fixtures.ts           # Mobile-specific fixtures
│   └── helpers/                     # Helper utilities
│       └── appium/                  # Appium integration
│           ├── appium-bridge.ts         # Appium client wrapper
│           └── native-app-helpers.ts    # Native app helper class
├── tests/
│   ├── web/                        # Web tests
│   │   └── example.spec.ts
│   ├── mobile/                     # Mobile web tests
│   │   └── mobile-web.spec.ts
│   └── native/                     # Native app tests
│       └── native-app.spec.ts
├── examples/                        # Example test files
│   ├── web-example.spec.ts
│   └── native-example.spec.ts
├── docker/                         # Docker configuration
│   ├── Dockerfile
│   └── docker-compose.yml
├── .github/
│   └── workflows/
│       └── test.yml                # CI/CD workflow example
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── README.md                       # Main documentation
├── SETUP.md                        # Detailed setup guide
└── LICENSE                         # MIT License

```

## Key Features

### ✅ Web Testing
- Desktop browser testing (Chrome, Firefox, Safari)
- Mobile browser emulation
- Multiple viewport configurations

### ✅ Mobile Web Testing
- Mobile device emulation (Pixel, iPhone, Galaxy)
- Touch interaction support
- Mobile-specific viewports

### ✅ Native Mobile Testing
- Android native app testing via Appium
- iOS native app testing via Appium
- Automatic screenshot capture
- App lifecycle management

### ✅ Docker Support
- Dockerfile for containerized testing
- Docker Compose configuration
- Volume mounting for reports

### ✅ Appium Integration
- Appium server management
- Native app session handling
- Element interaction helpers
- Screenshot and debugging support

## Configuration Files

1. **playwright.base.config.ts** - Base configuration with:
   - Reporter setup (HTML, JUnit, JSON, Allure)
   - Timeout configurations
   - Screenshot/video settings
   - CI/CD optimizations

2. **playwright.web.config.ts** - Web testing with:
   - Multiple browser projects
   - Environment-based URLs
   - Desktop and mobile viewports

3. **playwright.mobile.config.ts** - Mobile testing with:
   - Mobile web emulation projects
   - Native app projects (Android/iOS)
   - Appium metadata configuration

## Helper Classes

### AppiumBridge
- `AppiumServerManager` - Server lifecycle management
- `AppiumClient` - WebDriver protocol wrapper
- `getDefaultAppiumConfig()` - Environment-based config

### NativeAppHelper
- Element finding and interaction
- App lifecycle (background, activate, terminate)
- Screenshot capture
- Deep linking support

## Test Fixtures

### mobile-fixtures.ts
- `mobileTest` - Extended test with mobile support
- `nativeApp` - Native app helper fixture
- `isNativeApp` - Project detection
- Automatic screenshot capture on actions

## Scripts Available

```bash
npm test                    # Run all tests
npm run test:web           # Run web tests
npm run test:mobile        # Run mobile tests
npm run test:mobile:web    # Run mobile web tests
npm run test:mobile:native # Run native app tests
npm run test:ui            # Run in UI mode
npm run test:debug         # Run in debug mode
npm run playwright:install # Install browsers
npm run appium:start       # Start Appium server
npm run docker:build       # Build Docker image
npm run docker:test        # Run tests in Docker
npm run report             # View HTML report
```

## Environment Variables

See `.env.example` for all available environment variables:
- Base URLs (local, staging, prod)
- Mobile app paths
- Bundle IDs
- Device configuration
- Appium settings

## Next Steps

1. **Clone Stagehand** or use it as a template for your project
2. **Install dependencies:** `npm install`
3. **Install browsers:** `npm run playwright:install`
4. **Configure environment:** Copy `.env.example` to `.env` and update with your settings
5. **Write your tests** in the `tests/` directory
6. **Run tests:** `npm test`

## Documentation

- **README.md** - Main documentation with usage examples
- **SETUP.md** - Detailed setup instructions
- **Examples** - Example test files in `examples/` directory

## Support

For issues or questions, refer to:
- Playwright documentation: https://playwright.dev
- Appium documentation: https://appium.io/docs/

