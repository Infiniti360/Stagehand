#!/usr/bin/env tsx

/**
 * AI ChatMode CLI Tool
 * Command-line interface for AI-powered test generation and healing
 */

import { ChatModeManager, PlannerAgent, GeneratorAgent, HealerAgent } from './chatmodes';
import * as fs from 'fs';
import * as path from 'path';

const command = process.argv[2];
const args = process.argv.slice(3);

async function plan() {
  const requirements = args.join(' ') || 'User login and registration flow';
  console.log('🤖 Planning tests for:', requirements);
  
  const manager = new ChatModeManager();
  const codes = await manager.planAndGenerate(requirements);
  
  console.log(`\n✅ Generated ${codes.length} test plan(s)`);
  
  codes.forEach((code, index) => {
    const filename = `tests/generated/test-${Date.now()}-${index + 1}.spec.ts`;
    const dir = path.dirname(filename);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filename, code.code);
    console.log(`   📝 Created: ${filename}`);
  });
}

async function generate() {
  const testPlan = args.join(' ') || 'E2E test for user login';
  console.log('🤖 Generating test code for:', testPlan);
  
  const generator = new GeneratorAgent();
  const plan = {
    testName: 'Generated Test',
    description: testPlan,
    steps: [],
    assertions: [],
    type: 'e2e' as const,
  };
  
  const code = await generator.generateTest(plan);
  
  const filename = `tests/generated/test-${Date.now()}.spec.ts`;
  const dir = path.dirname(filename);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filename, code.code);
  console.log(`\n✅ Generated test: ${filename}`);
}

async function heal() {
  const testFile = args[0];
  const error = args.slice(1).join(' ') || 'Element not found';
  
  if (!testFile) {
    console.error('❌ Please provide a test file path');
    process.exit(1);
  }
  
  if (!fs.existsSync(testFile)) {
    console.error(`❌ Test file not found: ${testFile}`);
    process.exit(1);
  }
  
  console.log('🤖 Healing test:', testFile);
  console.log('   Error:', error);
  
  const testCode = fs.readFileSync(testFile, 'utf-8');
  const healer = new HealerAgent();
  const suggestions = await healer.healTest(testCode, error);
  
  console.log(`\n✅ Found ${suggestions.length} healing suggestion(s):\n`);
  
  suggestions.forEach((suggestion, index) => {
    console.log(`${index + 1}. Element: ${suggestion.element}`);
    console.log(`   Original: ${suggestion.originalSelector}`);
    console.log(`   Suggested: ${suggestion.suggestedSelector}`);
    console.log(`   Reason: ${suggestion.reason}`);
    console.log(`   Confidence: ${(suggestion.confidence * 100).toFixed(0)}%\n`);
  });
}

async function main() {
  switch (command) {
    case 'plan':
      await plan();
      break;
    case 'generate':
      await generate();
      break;
    case 'heal':
      await heal();
      break;
    default:
      console.log(`
🎭 Stagehand AI ChatMode CLI

Usage:
  npm run ai:plan [requirements]     - Plan and generate tests
  npm run ai:generate [description]  - Generate test code
  npm run ai:heal <file> [error]     - Heal broken tests

Examples:
  npm run ai:plan "User login flow"
  npm run ai:generate "E2E test for checkout"
  npm run ai:heal tests/e2e/login.spec.ts "Element not found"
      `);
      process.exit(1);
  }
}

main().catch(console.error);

