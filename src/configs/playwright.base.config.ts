import { defineConfig, devices } from '@playwright/test';

// Determine environment from CI or explicit env var
const ENV = process.env.TEST_ENV || (process.env.CI ? 'ci' : 'local');
const IS_CI = !!process.env.CI;
const IS_PROD = ENV === 'prod';

export default defineConfig({
	testDir: '../tests',
	timeout: 60_000,
	expect: {
		timeout: 10_000,
	},
	fullyParallel: true,
	forbidOnly: IS_CI,
	retries: IS_CI ? 2 : 0,
	workers: IS_CI ? 4 : undefined,
	reporter: [
		// Console reporter - shows test progress in terminal
		['list'],
		// HTML reporter - interactive HTML report with step viewer
		['html', { 
			outputFolder: 'reports/html', 
			open: IS_CI ? 'never' : 'on-failure',
		}],
		// JUnit reporter - XML format for CI integration
		['junit', { 
			outputFile: 'reports/junit/results.xml',
			includeProjectInTestName: true,
		}],
		// JSON reporter - machine-readable format for programmatic processing
		['json', { 
			outputFile: 'reports/json/results.json',
		}],
		// Allure reporter - comprehensive reporting with history and trends
		['allure-playwright', {
			outputFolder: 'reports/allure-results',
			detail: true,
			suiteTitle: false,
		}],
		// GitHub Actions reporter - adds annotations in CI
		...(IS_CI ? [['github'] as const] : []),
	],
	use: {
		headless: IS_CI || process.env.HEADLESS === 'true',
		// Enhanced trace capture - always capture for failures, on retry, or in CI
		trace: IS_CI ? 'on' : 'retain-on-failure',
		// Screenshots - capture on failure and for all steps in CI
		screenshot: IS_CI ? 'on' : 'only-on-failure',
		// Video recording - always record in CI, retain on failure locally
		video: IS_CI ? 'on' : 'retain-on-failure',
		// Network capture - capture HAR files for debugging
		baseURL: process.env.BASE_URL,
		locale: 'en-US',
		viewport: { width: 1280, height: 720 },
		// Action timeout
		actionTimeout: 30_000,
		// Navigation timeout - increased for slow Docker/Metro bundler startup
		navigationTimeout: parseInt(process.env.PLAYWRIGHT_NAVIGATION_TIMEOUT || '60000', 10),
		// Capture network activity
		ignoreHTTPSErrors: process.env.IGNORE_HTTPS_ERRORS === 'true',
	},
	outputDir: 'reports/artifacts',
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
});

