import { test, expect } from '@playwright/test';

/**
 * API Testing Layer
 * Direct API endpoint testing
 */
test.describe('API Tests', () => {
  const baseURL = process.env.API_BASE_URL || process.env.BASE_URL || 'http://localhost:3000';

  test('GET /api/users should return user list', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/users`);
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBeTruthy();
  });

  test('POST /api/users should create new user', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/users`, {
      data: {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
      },
    });

    expect(response.status()).toBe(201);
    
    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('id');
    expect(body.data).toHaveProperty('email');
  });

  test('GET /api/users/:id should return specific user', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/users/1`);
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('id', 1);
  });

  test('PUT /api/users/:id should update user', async ({ request }) => {
    const response = await request.put(`${baseURL}/api/users/1`, {
      data: {
        name: 'Updated Name',
      },
    });

    expect([200, 204]).toContain(response.status());
  });

  test('DELETE /api/users/:id should delete user', async ({ request }) => {
    const response = await request.delete(`${baseURL}/api/users/1`);
    
    expect([200, 204]).toContain(response.status());
  });

  test('API should handle authentication', async ({ request }) => {
    // Login first
    const loginResponse = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: 'user@example.com',
        password: 'password123',
      },
    });

    expect(loginResponse.ok()).toBeTruthy();
    const { token } = await loginResponse.json();

    // Use token for authenticated request
    const protectedResponse = await request.get(`${baseURL}/api/protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(protectedResponse.status()).toBe(200);
  });

  test('API should return proper error codes', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/users/99999`);
    
    expect(response.status()).toBe(404);
    
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

