import baseConfig from './playwright.base.config';
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local'), override: true });

// Environment-specific configuration
const TEST_ENV = process.env.TEST_ENV || 'local';
const IS_STAGING = TEST_ENV === 'staging';
const IS_PROD = TEST_ENV === 'prod';

// Determine base URL based on environment
const getBaseURL = (): string => {
	// Explicit env var takes precedence
	if (process.env.BASE_URL) return process.env.BASE_URL;
	
	// Environment defaults
	switch (TEST_ENV) {
		case 'staging':
			return process.env.STAGING_BASE_URL || 'https://staging.example.com';
		case 'prod':
			return process.env.PROD_BASE_URL || 'https://example.com';
		default:
			return 'http://localhost:3000';
	}
};

const baseURL = getBaseURL();

// Adjust timeouts for different environments
const navigationTimeout = IS_PROD ? 30000 : parseInt(process.env.PLAYWRIGHT_NAVIGATION_TIMEOUT || '60000', 10);

export default defineConfig({
	...baseConfig,
	testDir: '../../tests/web',
	// Longer timeout for staging/prod as network latency is higher
	timeout: IS_STAGING || IS_PROD ? 90000 : 60000,
	// More retries for remote environments
	retries: IS_STAGING ? 2 : (IS_PROD ? 1 : 0),
	use: {
		...baseConfig.use,
		baseURL,
		navigationTimeout,
		// Ignore HTTPS errors for staging environments with self-signed certs
		ignoreHTTPSErrors: IS_STAGING || process.env.IGNORE_HTTPS_ERRORS === 'true',
	},
	projects: [
		{
			name: 'desktop-chrome',
			use: {
				...baseConfig.use,
				...devices['Desktop Chrome'],
				baseURL,
			},
		},
		{
			name: 'desktop-firefox',
			use: {
				...baseConfig.use,
				...devices['Desktop Firefox'],
				baseURL,
			},
		},
		{
			name: 'desktop-safari',
			use: {
				...baseConfig.use,
				...devices['Desktop Safari'],
				baseURL,
			},
		},
		{
			name: 'mobile-pixel',
			use: {
				...baseConfig.use,
				...devices['Pixel 7'],
				baseURL,
			},
		},
		{
			name: 'mobile-iphone',
			use: {
				...baseConfig.use,
				...devices['iPhone 14'],
				baseURL,
			},
		},
	],
});

