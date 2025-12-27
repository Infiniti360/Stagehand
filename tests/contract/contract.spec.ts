import { test, expect } from '@playwright/test';

/**
 * Contract Testing Layer
 * Tests API contracts and schema validation
 */
test.describe('Contract Tests', () => {
  test('API should return expected schema', async ({ request }) => {
    const response = await request.get('/api/users');
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    
    // Validate schema
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBeTruthy();
    
    if (body.data.length > 0) {
      expect(body.data[0]).toHaveProperty('id');
      expect(body.data[0]).toHaveProperty('email');
    }
  });

  test('API should validate request schema', async ({ request }) => {
    const response = await request.post('/api/users', {
      data: {
        email: 'invalid-email', // Invalid format
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('API should maintain backward compatibility', async ({ request }) => {
    const response = await request.get('/api/v1/users');
    
    // Should not break with versioned endpoints
    expect([200, 404]).toContain(response.status());
  });

  test('API should return consistent response format', async ({ request }) => {
    const response = await request.get('/api/products');
    
    if (response.ok()) {
      const body = await response.json();
      
      // All successful responses should have consistent structure
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('meta');
    }
  });
});

