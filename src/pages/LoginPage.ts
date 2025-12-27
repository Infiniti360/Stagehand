import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 * Example implementation of POM pattern
 */
export class LoginPage extends BasePage {
  // Locators using recommended selectors
  private readonly emailInput = () => this.getByTestId('email-input');
  private readonly passwordInput = () => this.getByTestId('password-input');
  private readonly loginButton = () => this.getByTestId('login-button');
  private readonly errorMessage = () => this.getByTestId('error-message');

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(`${this.baseURL}/login`);
    await this.waitForLoad();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillInput(this.emailInput(), email);
    await this.fillInput(this.passwordInput(), password);
    await this.click(this.loginButton());
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage());
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.elementExists(this.emailInput()) && 
           await this.elementExists(this.passwordInput()) &&
           await this.elementExists(this.loginButton());
  }
}

