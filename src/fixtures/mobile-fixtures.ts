import { test as baseTest, TestInfo } from '@playwright/test';
import { NativeAppHelper, AppiumConfig } from '../helpers/appium/native-app-helpers';
import * as path from 'path';
import * as fs from 'fs';

type MobileFixtures = {
	nativeApp: NativeAppHelper | null;
	isNativeApp: boolean;
	testInfo: TestInfo;
};

/**
 * Mobile-specific fixtures
 * For web-based mobile tests: extends base fixtures (includes page, etc.)
 * For native app tests: extends Playwright base test (no page needed)
 * 
 * Usage:
 * - Web-based: Use `mobileTest` - has access to `page` fixture
 * - Native: Use `mobileTest` with `nativeApp` fixture - no `page` needed
 */
export const mobileTest = baseTest.extend<MobileFixtures>({
	// Expose testInfo as a fixture
	testInfo: async ({}, use, testInfo: TestInfo) => {
		await use(testInfo);
	},

	// Determine if this is a native app test based on project name
	isNativeApp: async ({}, use, testInfo: TestInfo) => {
		const projectName = testInfo.project.name || '';
		const isNative = projectName.includes('native');
		await use(isNative);
	},

	// Native app helper (only available for native app projects)
	nativeApp: async ({ isNativeApp }, use, testInfo: TestInfo) => {
		if (!isNativeApp) {
			// Return null for web-based mobile tests
			await use(null);
			return;
		}

		// Get native app config from project metadata or environment
		const projectMetadata = (testInfo.project as any).metadata || {};
		const platform = projectMetadata.platform || process.env.PLATFORM || 'Android';
		
		const config: Partial<AppiumConfig> = {
			platformName: platform === 'iOS' ? 'iOS' : 'Android',
			deviceName: projectMetadata.deviceName || process.env.DEVICE_NAME || 
				(platform === 'iOS' ? 'iPhone Simulator' : 'Android Emulator'),
			platformVersion: projectMetadata.platformVersion || process.env.PLATFORM_VERSION || 
				(platform === 'iOS' ? '17.0' : '15'),
			app: projectMetadata.appPath || process.env.ANDROID_APP_PATH || process.env.IOS_APP_PATH || '',
			bundleId: projectMetadata.bundleId || process.env.ANDROID_BUNDLE_ID || process.env.IOS_BUNDLE_ID || 
				'com.example.app',
			automationName: projectMetadata.automationName || 
				(platform === 'iOS' ? 'XCUITest' : 'UiAutomator2'),
			noReset: process.env.APPIUM_NO_RESET === 'true',
			fullReset: process.env.APPIUM_FULL_RESET !== 'false',
			autoGrantPermissions: process.env.APPIUM_AUTO_GRANT_PERMISSIONS !== 'false',
			systemPort: process.env.APPIUM_SYSTEM_PORT ? parseInt(process.env.APPIUM_SYSTEM_PORT) : undefined,
		};

		const nativeApp = new NativeAppHelper(config);
		
		// Initialize native app session
		try {
			await nativeApp.initialize();
		} catch (error) {
			// Attach initialization error details
			const errorDetails = {
				error: error instanceof Error ? error.message : String(error),
				config: {
					platform: config.platformName,
					deviceName: config.deviceName,
					bundleId: config.bundleId,
				},
				timestamp: new Date().toISOString(),
			};
			await testInfo.attach('initialization_error', {
				body: JSON.stringify(errorDetails, null, 2),
				contentType: 'application/json'
			});
			throw error;
		}

		// Create screenshots directory for this test
		const outputDir = testInfo.outputDir || testInfo.project.outputDir || 'test-results';
		const screenshotsDir = path.join(outputDir, 'screenshots', testInfo.titlePath.join('_').replace(/[^a-z0-9]/gi, '_'));
		if (!fs.existsSync(screenshotsDir)) {
			fs.mkdirSync(screenshotsDir, { recursive: true });
		}

		// Enhanced nativeApp with automatic screenshot capture
		const enhancedNativeApp = {
			...nativeApp,
			// Override key methods to capture screenshots from native app (via Appium)
			click: async (accessibilityId: string) => {
				try {
					await nativeApp.click(accessibilityId);
					await new Promise(resolve => setTimeout(resolve, 500)); // Wait for UI update
					try {
						const screenshotPath = path.join(screenshotsDir, `click_${accessibilityId}_${Date.now()}.png`);
						await nativeApp.takeScreenshotAndSave(screenshotPath);
						await testInfo.attach(`click_${accessibilityId}`, { 
							path: screenshotPath,
							contentType: 'image/png'
						});
					} catch (error) {
						console.error(`Failed to capture screenshot after click on ${accessibilityId}:`, error);
					}
				} catch (error) {
					// Capture error screenshot and context
					try {
						const errorScreenshotPath = path.join(screenshotsDir, `click_error_${accessibilityId}_${Date.now()}.png`);
						await nativeApp.takeScreenshotAndSave(errorScreenshotPath);
						await testInfo.attach(`click_error_${accessibilityId}`, { 
							path: errorScreenshotPath,
							contentType: 'image/png'
						});
					} catch (screenshotError) {
						console.error(`Failed to capture error screenshot:`, screenshotError);
					}
					throw error;
				}
			},
			type: async (accessibilityId: string, text: string) => {
				try {
					await nativeApp.type(accessibilityId, text);
					await new Promise(resolve => setTimeout(resolve, 500)); // Wait for UI update
					try {
						const screenshotPath = path.join(screenshotsDir, `type_${accessibilityId}_${Date.now()}.png`);
						await nativeApp.takeScreenshotAndSave(screenshotPath);
						await testInfo.attach(`type_${accessibilityId}`, { 
							path: screenshotPath,
							contentType: 'image/png'
						});
					} catch (error) {
						console.error(`Failed to capture screenshot after type on ${accessibilityId}:`, error);
					}
				} catch (error) {
					// Capture error screenshot and context
					try {
						const errorScreenshotPath = path.join(screenshotsDir, `type_error_${accessibilityId}_${Date.now()}.png`);
						await nativeApp.takeScreenshotAndSave(errorScreenshotPath);
						await testInfo.attach(`type_error_${accessibilityId}`, { 
							path: errorScreenshotPath,
							contentType: 'image/png'
						});
					} catch (screenshotError) {
						console.error(`Failed to capture error screenshot:`, screenshotError);
					}
					throw error;
				}
			},
			// Keep all other methods as-is
			findElement: nativeApp.findElement.bind(nativeApp),
			findElements: nativeApp.findElements.bind(nativeApp),
			getText: nativeApp.getText.bind(nativeApp),
			getPageSource: nativeApp.getPageSource.bind(nativeApp),
			pressBack: nativeApp.pressBack.bind(nativeApp),
			background: nativeApp.background.bind(nativeApp),
			activate: nativeApp.activate.bind(nativeApp),
			terminate: nativeApp.terminate.bind(nativeApp),
			reload: nativeApp.reload.bind(nativeApp),
			takeScreenshot: nativeApp.takeScreenshot.bind(nativeApp),
			takeScreenshotAndSave: nativeApp.takeScreenshotAndSave.bind(nativeApp),
			executeDeepLink: nativeApp.executeDeepLink.bind(nativeApp),
			waitForElement: nativeApp.waitForElement.bind(nativeApp),
			elementExists: nativeApp.elementExists.bind(nativeApp),
			isAppResponsive: nativeApp.isAppResponsive.bind(nativeApp),
		};

		// Take initial screenshot after app launch
		try {
			await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for app to fully load
			const initialScreenshotPath = path.join(screenshotsDir, `initial_app_launch.png`);
			await enhancedNativeApp.takeScreenshotAndSave(initialScreenshotPath);
			await testInfo.attach('initial_app_launch', { 
				path: initialScreenshotPath,
				contentType: 'image/png'
			});
		} catch (error) {
			console.error('Could not take initial native app screenshot:', error);
		}

		// Use the enhanced native app helper
		let testError: Error | undefined;
		try {
			await use(enhancedNativeApp as NativeAppHelper);
		} catch (error) {
			testError = error as Error;
			throw error;
		} finally {
			// Capture error details if test failed
			if (testInfo.status === 'failed' || testError) {
				try {
					const errorScreenshotPath = path.join(screenshotsDir, `error_screenshot.png`);
					await enhancedNativeApp.takeScreenshotAndSave(errorScreenshotPath);
					await testInfo.attach('error_screenshot', { 
						path: errorScreenshotPath,
						contentType: 'image/png'
					});
				} catch (error) {
					console.error('Failed to capture native app error details:', error);
				}
			}

			// Cleanup after test
			await nativeApp.cleanup();
		}
	},
});

export const expect = mobileTest.expect;

