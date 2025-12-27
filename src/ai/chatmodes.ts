/**
 * AI ChatModes & Agents for Test Generation and Healing
 * Supports planner, generator, and healer modes
 */

export enum ChatMode {
  PLANNER = 'planner',
  GENERATOR = 'generator',
  HEALER = 'healer',
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface TestPlan {
  testName: string;
  description: string;
  steps: string[];
  assertions: string[];
  type: 'e2e' | 'integration' | 'api' | 'accessibility' | 'security' | 'contract';
}

export interface TestCode {
  code: string;
  language: 'typescript' | 'javascript';
  framework: 'playwright';
}

export interface HealingSuggestion {
  element: string;
  originalSelector: string;
  suggestedSelector: string;
  reason: string;
  confidence: number;
}

/**
 * AI ChatMode Agent Base Class
 */
export abstract class ChatModeAgent {
  protected apiKey: string;
  protected model: string;
  protected baseUrl: string;

  constructor(apiKey?: string, model: string = 'gpt-4', baseUrl?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    this.model = model;
    this.baseUrl = baseUrl || 'https://api.openai.com/v1';
  }

  protected async callAI(messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not provided. Set OPENAI_API_KEY environment variable.');
    }

    // In a real implementation, this would make an HTTP request to OpenAI API
    // For now, return a mock response
    console.log('🤖 AI ChatMode: Processing request...');
    return this.getMockResponse(messages);
  }

  protected abstract getMockResponse(messages: ChatMessage[]): string;
}

/**
 * Planner Agent - Plans test scenarios
 */
export class PlannerAgent extends ChatModeAgent {
  async planTests(requirements: string, context?: string): Promise<TestPlan[]> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a test planning expert. Analyze requirements and create comprehensive test plans.
        Return test plans in JSON format with: testName, description, steps, assertions, and type.`,
      },
      {
        role: 'user',
        content: `Requirements: ${requirements}\n${context ? `Context: ${context}` : ''}`,
      },
    ];

    const response = await this.callAI(messages);
    return this.parseTestPlans(response);
  }

  protected getMockResponse(messages: ChatMessage[]): string {
    return JSON.stringify([
      {
        testName: 'User Login Flow',
        description: 'Test complete user login process',
        steps: ['Navigate to login page', 'Enter credentials', 'Submit form', 'Verify redirect'],
        assertions: ['Login form is visible', 'Success message appears', 'User is redirected to dashboard'],
        type: 'e2e',
      },
    ]);
  }

  private parseTestPlans(response: string): TestPlan[] {
    try {
      return JSON.parse(response);
    } catch {
      return [];
    }
  }
}

/**
 * Generator Agent - Generates test code
 */
export class GeneratorAgent extends ChatModeAgent {
  async generateTest(plan: TestPlan, framework: 'playwright' = 'playwright'): Promise<TestCode> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a test code generator. Generate ${framework} test code based on test plans.
        Use Page Object Model pattern. Return only valid TypeScript code.`,
      },
      {
        role: 'user',
        content: `Generate test code for: ${JSON.stringify(plan)}`,
      },
    ];

    const response = await this.callAI(messages);
    return {
      code: response,
      language: 'typescript',
      framework: 'playwright',
    };
  }

  protected getMockResponse(messages: ChatMessage[]): string {
    return `import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('User Login Flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL(/.*dashboard/);
});`;
  }
}

/**
 * Healer Agent - Heals broken tests
 */
export class HealerAgent extends ChatModeAgent {
  async healTest(
    testCode: string,
    error: string,
    pageSource?: string
  ): Promise<HealingSuggestion[]> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a test healing expert. Analyze broken tests and suggest fixes for selectors and locators.
        Return healing suggestions in JSON format.`,
      },
      {
        role: 'user',
        content: `Test code: ${testCode}\nError: ${error}\n${pageSource ? `Page source: ${pageSource}` : ''}`,
      },
    ];

    const response = await this.callAI(messages);
    return this.parseHealingSuggestions(response);
  }

  protected getMockResponse(messages: ChatMessage[]): string {
    return JSON.stringify([
      {
        element: 'login-button',
        originalSelector: 'button#login',
        suggestedSelector: 'button[data-testid="login-button"]',
        reason: 'ID selector may have changed, using data-testid is more stable',
        confidence: 0.9,
      },
    ]);
  }

  private parseHealingSuggestions(response: string): HealingSuggestion[] {
    try {
      return JSON.parse(response);
    } catch {
      return [];
    }
  }
}

/**
 * ChatMode Manager - Orchestrates all agents
 */
export class ChatModeManager {
  private planner: PlannerAgent;
  private generator: GeneratorAgent;
  private healer: HealerAgent;

  constructor(apiKey?: string) {
    this.planner = new PlannerAgent(apiKey);
    this.generator = new GeneratorAgent(apiKey);
    this.healer = new HealerAgent(apiKey);
  }

  async planAndGenerate(requirements: string, context?: string): Promise<TestCode[]> {
    const plans = await this.planner.planTests(requirements, context);
    const codes: TestCode[] = [];

    for (const plan of plans) {
      const code = await this.generator.generateTest(plan);
      codes.push(code);
    }

    return codes;
  }

  async heal(testCode: string, error: string, pageSource?: string): Promise<HealingSuggestion[]> {
    return await this.healer.healTest(testCode, error, pageSource);
  }
}

