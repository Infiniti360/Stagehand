import { AppiumClient, AppiumConfig, AppiumServerManager, getDefaultAppiumConfig } from './appium-bridge';

/**
 * Native App Helpers for Playwright Tests
 * These helpers bridge Playwright tests with Appium for native app testing
 */

export class NativeAppHelper {
	private appiumClient: AppiumClient;
	private sessionId: string | null = null;
	private config: AppiumConfig;

	constructor(config?: Partial<AppiumConfig>) {
		this.appiumClient = new AppiumClient();
		const defaultConfig = getDefaultAppiumConfig();
		this.config = { ...defaultConfig, ...config } as AppiumConfig;
	}

	/**
	 * Initialize native app session
	 */
	async initialize(): Promise<void> {
		// Ensure Appium server is running
		const isRunning = await AppiumServerManager.isServerRunning();
		if (!isRunning) {
			await AppiumServerManager.startServer();
			// Wait a bit for server to be ready
			await new Promise(resolve => setTimeout(resolve, 5000));
		}

		// Create Appium session
		const session = await this.appiumClient.createSession(this.config);
		this.sessionId = session.sessionId;
		console.log(`Native app session created: ${this.sessionId}`);
	}

	/**
	 * Cleanup native app session
	 */
	async cleanup(): Promise<void> {
		if (this.sessionId) {
			await this.appiumClient.deleteSession();
			this.sessionId = null;
		}
	}

	/**
	 * Find element by accessibility ID (testID in React Native)
	 */
	async findElement(accessibilityId: string) {
		return await this.appiumClient.findElementByAccessibilityId(accessibilityId);
	}

	/**
	 * Find elements by accessibility ID
	 */
	async findElements(accessibilityId: string) {
		return await this.appiumClient.findElementsByAccessibilityId(accessibilityId);
	}

	/**
	 * Click element by accessibility ID
	 */
	async click(accessibilityId: string): Promise<void> {
		const element = await this.findElement(accessibilityId);
		await this.appiumClient.clickElement(element.elementId);
	}

	/**
	 * Type text into element
	 */
	async type(accessibilityId: string, text: string): Promise<void> {
		const element = await this.findElement(accessibilityId);
		await this.appiumClient.sendKeys(element.elementId, text);
	}

	/**
	 * Get text from element
	 */
	async getText(accessibilityId: string): Promise<string> {
		const element = await this.findElement(accessibilityId);
		return await this.appiumClient.getElementText(element.elementId);
	}

	/**
	 * Get page source
	 */
	async getPageSource(): Promise<string> {
		return await this.appiumClient.getPageSource();
	}

	/**
	 * Press Android back button
	 */
	async pressBack(): Promise<void> {
		await this.appiumClient.pressBack();
	}

	/**
	 * Background app
	 */
	async background(seconds: number = 3): Promise<void> {
		await this.appiumClient.backgroundApp(seconds);
	}

	/**
	 * Activate app
	 */
	async activate(bundleId?: string): Promise<void> {
		const targetBundleId = bundleId || this.config.bundleId || 'com.example.app';
		await this.appiumClient.activateApp(targetBundleId);
	}

	/**
	 * Terminate app
	 */
	async terminate(bundleId?: string): Promise<void> {
		const targetBundleId = bundleId || this.config.bundleId || 'com.example.app';
		await this.appiumClient.terminateApp(targetBundleId);
	}

	/**
	 * Reload app session (terminate and activate)
	 */
	async reload(): Promise<void> {
		const bundleId = this.config.bundleId || 'com.example.app';
		await this.terminate(bundleId);
		await new Promise(resolve => setTimeout(resolve, 1000));
		await this.activate(bundleId);
		await new Promise(resolve => setTimeout(resolve, 3000));
	}

	/**
	 * Take screenshot
	 */
	async takeScreenshot(): Promise<string> {
		return await this.appiumClient.takeScreenshot();
	}

	/**
	 * Take screenshot and save to file
	 */
	async takeScreenshotAndSave(filePath: string): Promise<string> {
		const screenshotBase64 = await this.takeScreenshot();
		const fs = require('fs');
		const path = require('path');
		
		// Ensure directory exists
		const dir = path.dirname(filePath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		
		// Save screenshot
		const buffer = Buffer.from(screenshotBase64, 'base64');
		fs.writeFileSync(filePath, buffer);
		
		console.log(`Screenshot saved to: ${filePath}`);
		return filePath;
	}

	/**
	 * Execute deep link
	 */
	async executeDeepLink(url: string, packageName?: string): Promise<void> {
		await this.appiumClient.executeDeepLink(url, packageName);
	}

	/**
	 * Wait for element to appear
	 */
	async waitForElement(accessibilityId: string, timeout: number = 10000): Promise<any> {
		const startTime = Date.now();
		while (Date.now() - startTime < timeout) {
			try {
				const element = await this.findElement(accessibilityId);
				if (element) return element;
			} catch {
				// Element not found, continue waiting
			}
			await new Promise(resolve => setTimeout(resolve, 500));
		}
		throw new Error(`Element with accessibility ID "${accessibilityId}" not found within ${timeout}ms`);
	}

	/**
	 * Check if element exists
	 */
	async elementExists(accessibilityId: string): Promise<boolean> {
		try {
			const element = await this.findElement(accessibilityId);
			return !!element;
		} catch {
			return false;
		}
	}

	/**
	 * Check if app is responsive
	 */
	async isAppResponsive(): Promise<boolean> {
		try {
			const source = await this.getPageSource();
			return source.length > 0;
		} catch {
			return false;
		}
	}
}

/**
 * Create a native app helper instance
 */
export function createNativeAppHelper(config?: Partial<AppiumConfig>): NativeAppHelper {
	return new NativeAppHelper(config);
}

