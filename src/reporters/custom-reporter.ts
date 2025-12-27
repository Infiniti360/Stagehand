/**
 * Custom Test Reporter for Stagehand
 * Provides enhanced reporting with test categorization and metrics
 */

import { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface TestMetrics {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  byType: Record<string, number>;
  byLayer: Record<string, number>;
}

interface TestReport {
  timestamp: string;
  metrics: TestMetrics;
  tests: Array<{
    title: string;
    status: string;
    duration: number;
    type?: string;
    layer?: string;
    error?: string;
  }>;
}

export default class CustomReporter implements Reporter {
  private report: TestReport = {
    timestamp: new Date().toISOString(),
    metrics: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      byType: {},
      byLayer: {},
    },
    tests: [],
  };

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`\n🎭 Stagehand Test Execution Started`);
    console.log(`   Configuration: ${config.projects.length} project(s)`);
  }

  onTestBegin(test: TestCase) {
    // Extract test type and layer from test title or tags
    const testType = this.extractTestType(test);
    const testLayer = this.extractTestLayer(test);
    
    this.report.metrics.total++;
    if (testType) {
      this.report.metrics.byType[testType] = (this.report.metrics.byType[testType] || 0) + 1;
    }
    if (testLayer) {
      this.report.metrics.byLayer[testLayer] = (this.report.metrics.byLayer[testLayer] || 0) + 1;
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const testType = this.extractTestType(test);
    const testLayer = this.extractTestLayer(test);

    this.report.metrics.duration += result.duration;

    switch (result.status) {
      case 'passed':
        this.report.metrics.passed++;
        break;
      case 'failed':
        this.report.metrics.failed++;
        break;
      case 'skipped':
        this.report.metrics.skipped++;
        break;
    }

    this.report.tests.push({
      title: test.title,
      status: result.status,
      duration: result.duration,
      type: testType,
      layer: testLayer,
      error: result.error?.message,
    });
  }

  onEnd(result: FullResult) {
    console.log(`\n🎭 Stagehand Test Execution Completed`);
    console.log(`   Total: ${this.report.metrics.total}`);
    console.log(`   Passed: ${this.report.metrics.passed} ✅`);
    console.log(`   Failed: ${this.report.metrics.failed} ❌`);
    console.log(`   Skipped: ${this.report.metrics.skipped} ⏭️`);
    console.log(`   Duration: ${(this.report.metrics.duration / 1000).toFixed(2)}s`);

    if (Object.keys(this.report.metrics.byType).length > 0) {
      console.log(`\n   By Type:`);
      Object.entries(this.report.metrics.byType).forEach(([type, count]) => {
        console.log(`     ${type}: ${count}`);
      });
    }

    if (Object.keys(this.report.metrics.byLayer).length > 0) {
      console.log(`\n   By Layer:`);
      Object.entries(this.report.metrics.byLayer).forEach(([layer, count]) => {
        console.log(`     ${layer}: ${count}`);
      });
    }

    // Save report to file
    this.saveReport();
  }

  private extractTestType(test: TestCase): string | undefined {
    // Extract from test title or annotations
    const title = test.title.toLowerCase();
    if (title.includes('e2e') || title.includes('end-to-end')) return 'e2e';
    if (title.includes('integration')) return 'integration';
    if (title.includes('api') || title.includes('contract')) return 'api';
    if (title.includes('accessibility') || title.includes('a11y')) return 'accessibility';
    if (title.includes('security')) return 'security';
    if (title.includes('chaos')) return 'chaos';
    if (title.includes('mock')) return 'mock';
    if (title.includes('network')) return 'network';
    if (title.includes('validation')) return 'validation';
    return undefined;
  }

  private extractTestLayer(test: TestCase): string | undefined {
    // Extract from test file path
    const filePath = test.location.file;
    if (filePath.includes('e2e')) return 'e2e';
    if (filePath.includes('integration')) return 'integration';
    if (filePath.includes('api')) return 'api';
    if (filePath.includes('accessibility')) return 'accessibility';
    if (filePath.includes('security')) return 'security';
    if (filePath.includes('chaos')) return 'chaos';
    if (filePath.includes('mock')) return 'mock';
    if (filePath.includes('network')) return 'network';
    if (filePath.includes('validation')) return 'validation';
    return undefined;
  }

  private saveReport(): void {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportPath = path.join(reportsDir, 'custom-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
    console.log(`\n   📊 Custom report saved to: ${reportPath}`);
  }
}

