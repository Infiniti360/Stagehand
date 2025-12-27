import baseConfig from './playwright.base.config';
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables for local runs. In CI, env is injected by the runner.
dotenv.config({ path: process.env.DOTENV_PATH ?? path.resolve(__dirname, '../../.env') });

// Get app paths from environment or use defaults
const ANDROID_APP_PATH = process.env.ANDROID_APP_PATH || path.join(__dirname, '../../builds/android-app.apk');
const IOS_APP_PATH = process.env.IOS_APP_PATH || path.join(__dirname, '../../builds/ios-app.ipa');
const ANDROID_BUNDLE_ID = process.env.ANDROID_BUNDLE_ID || 'com.example.app';
const IOS_BUNDLE_ID = process.env.IOS_BUNDLE_ID || 'com.example.app';

export default defineConfig({
	...baseConfig,
	testDir: '../../tests/mobile',
	projects: [
		// Web-based mobile emulation (for mobile web testing)
		{
			name: 'mobile-android-pixel-web',
			use: {
				...baseConfig.use,
				...devices['Pixel 7'],
				hasTouch: true,
				isMobile: true,
			},
		},
		{
			name: 'mobile-android-galaxy-web',
			use: {
				...baseConfig.use,
				...devices['Galaxy S21'],
				hasTouch: true,
				isMobile: true,
			},
		},
		{
			name: 'mobile-ios-iphone-web',
			use: {
				...baseConfig.use,
				...devices['iPhone 14'],
				hasTouch: true,
				isMobile: true,
			},
		},
		// Native Android app testing (via Appium bridge)
		{
			name: 'mobile-android-native',
			use: {
				...baseConfig.use,
				// Native app testing doesn't use browser context
				// These settings are for test metadata
				hasTouch: true,
				isMobile: true,
				// IMPORTANT: Disable Playwright's browser-based screenshot/video capture
				// Native app screenshots are captured from the emulator/simulator via Appium
				// This prevents Playwright from capturing browser windows or blank pages
				screenshot: 'off',
				video: 'off',
				trace: 'off',
			},
			// Store native app config in test metadata
			metadata: {
				platform: 'Android',
				appPath: ANDROID_APP_PATH,
				bundleId: ANDROID_BUNDLE_ID,
				deviceName: process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
				platformVersion: process.env.ANDROID_PLATFORM_VERSION || '15',
				automationName: 'UiAutomator2',
			},
		},
		// Native iOS app testing (via Appium bridge)
		{
			name: 'mobile-ios-native',
			use: {
				...baseConfig.use,
				hasTouch: true,
				isMobile: true,
				// IMPORTANT: Disable Playwright's browser-based screenshot/video capture
				// Native app screenshots are captured from the emulator/simulator via Appium
				// This prevents Playwright from capturing browser windows or blank pages
				screenshot: 'off',
				video: 'off',
				trace: 'off',
			},
			metadata: {
				platform: 'iOS',
				appPath: IOS_APP_PATH,
				bundleId: IOS_BUNDLE_ID,
				deviceName: process.env.IOS_DEVICE_NAME || 'iPhone Simulator',
				platformVersion: process.env.IOS_PLATFORM_VERSION || '17.0',
				automationName: 'XCUITest',
			},
		},
	],
	// Mobile-specific settings
	use: {
		...baseConfig.use,
		// For native app testing, baseURL is not used
		viewport: { width: 412, height: 915 }, // Default mobile viewport
		deviceScaleFactor: 2.625,
		hasTouch: true,
		isMobile: true,
		// Note: Screenshot/video settings are overridden per project
		// Web-based mobile tests: use Playwright's screenshot/video
		// Native app tests: use Appium screenshots (configured in project-specific settings)
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		trace: 'on-first-retry',
	},
});

