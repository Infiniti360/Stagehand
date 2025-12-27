# Stagehand Architecture

This document describes the architecture and design decisions behind Stagehand.

## Overview

Stagehand is built on Playwright and provides a layered architecture that separates configuration, fixtures, helpers, and tests. This design enables:

- **Reusability**: Shared utilities and configurations
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to extend with new features
- **Testability**: Isolated components

## Directory Structure

```
Stagehand/
├── src/
│   ├── configs/          # Playwright configuration files
│   ├── fixtures/         # Test fixtures and extended test objects
│   └── helpers/          # Utility functions and helpers
│       └── appium/       # Appium-specific helpers
├── tests/                # Test files organized by type
│   ├── web/             # Web browser tests
│   ├── mobile/          # Mobile web tests
│   └── native/          # Native app tests
├── examples/            # Example test files
└── docker/              # Docker configuration
```

## Configuration Layer

### Base Configuration (`playwright.base.config.ts`)

The base configuration provides:
- Common settings for all test types
- Reporter configuration (HTML, JUnit, JSON, Allure)
- Default timeouts and retry logic
- CI/CD optimizations

### Web Configuration (`playwright.web.config.ts`)

Extends base config with:
- Multiple browser projects (Chrome, Firefox, Safari)
- Mobile viewport projects
- Environment-based URL configuration

### Mobile Configuration (`playwright.mobile.config.ts`)

Extends base config with:
- Mobile web emulation projects
- Native app projects with Appium metadata
- Platform-specific settings (Android/iOS)

## Fixtures Layer

### Mobile Fixtures (`mobile-fixtures.ts`)

Provides extended test objects:
- `mobileTest`: Extended test with mobile support
- `nativeApp`: Native app helper fixture
- `isNativeApp`: Project detection fixture
- Automatic screenshot capture on actions

## Helpers Layer

### Appium Bridge (`appium-bridge.ts`)

Core Appium integration:
- `AppiumServerManager`: Server lifecycle management
- `AppiumClient`: WebDriver protocol wrapper
- `getDefaultAppiumConfig()`: Environment-based configuration

### Native App Helpers (`native-app-helpers.ts`)

High-level native app interactions:
- `NativeAppHelper`: Main helper class
- Element finding and interaction methods
- App lifecycle management
- Screenshot and debugging utilities

## Test Organization

Tests are organized by type:
- **Web tests**: Standard browser-based tests
- **Mobile web tests**: Mobile viewport emulation tests
- **Native tests**: Native app tests using Appium

## Design Patterns

### 1. Configuration Inheritance

Configurations use inheritance to avoid duplication:
```
Base Config → Web Config
Base Config → Mobile Config
```

### 2. Fixture Extension

Fixtures extend Playwright's base test to add custom functionality:
```typescript
export const mobileTest = baseTest.extend<MobileFixtures>({...})
```

### 3. Helper Abstraction

Helpers abstract low-level Appium operations:
```typescript
nativeApp.click('button-id')  // Instead of direct Appium calls
```

### 4. Environment-Based Configuration

Configuration adapts based on environment variables:
- Local development
- CI/CD pipelines
- Staging/production environments

## Data Flow

### Web Tests
```
Test → Page Object → Playwright API → Browser
```

### Native App Tests
```
Test → NativeAppHelper → AppiumClient → Appium Server → Device
```

## Extension Points

### Adding New Test Types

1. Create new config in `src/configs/`
2. Add test directory in `tests/`
3. Update package.json scripts if needed

### Adding New Helpers

1. Create helper file in `src/helpers/`
2. Export helper functions/classes
3. Import in test files or fixtures

### Adding New Fixtures

1. Extend base test in `src/fixtures/`
2. Add fixture to test type
3. Use in tests

## Best Practices

1. **Keep configs focused**: Each config should serve a specific purpose
2. **Use fixtures for shared setup**: Avoid duplicating setup code
3. **Abstract complex operations**: Use helpers for reusable logic
4. **Environment-aware**: Make configs adapt to different environments
5. **Type safety**: Leverage TypeScript for better developer experience

## Future Enhancements

Potential areas for extension:
- API testing support
- Visual regression testing
- Performance testing
- Cross-browser testing matrix
- Cloud device farm integration

