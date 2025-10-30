import { jest } from '@jest/globals';
jest.setTimeout(10000); //timout if longer than 10 seconds

function fetchWithTimeout(url, options = {}, ms = 2000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

describe('Backend live server tests base functions', () => {
  const BASE_URL = 'http://localhost:8000';

  test('GET / should return Hello World!', async () => {
    const response = await fetch(`${BASE_URL}/`);
    expect(response.status).toBe(200);

    const text = await response.text();
    expect(text).toBe('Hello World!');
  });

  test('GET /users should return users', async () => {
    const response = await fetch(`${BASE_URL}/users`);
    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('users_list');
    expect(Array.isArray(body.users_list)).toBe(true);

    //check that there is one user before testing
    if (body.users_list.length > 0) {
      const u = body.users_list[0];
      expect(u).toHaveProperty('_id');
      expect(u).toHaveProperty('name');
      expect(u).toHaveProperty('createdAt');
      expect(u).toHaveProperty('hashpassword');
      expect(u).toHaveProperty('email');
    }
  });

  test('GET /users/id should return error (no user exists for this test)', async () => {
    const response = await fetch(`${BASE_URL}/users/id`);
    expect(response.status).toBe(404);
  });
});

describe('Backend live server user tests functions', () => {
  const BASE_URL = 'http://localhost:8000';
  let createdUser = null;

  // Hook timeout greater than fetch timeout
  beforeAll(async () => {
    const newUser = {
      name: 'Mac Tester',
      email: `mac_${Date.now()}@example.com`,
      // No password yet — hashpassword not implemented yet.
    };

    try {
      const res = await fetchWithTimeout(
        `${BASE_URL}/users`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        },
        2000
      ); //2 second timeout

      // If the server does respond
      if (res.status !== 201) {
        const body = await res.text().catch(() => '<no body>');
        throw new Error(
          `Expected 201 from POST /users, got ${res.status}. Body: ${body}`
        );
      }

      createdUser = await res.json();
      // eslint-disable-next-line no-unused-vars
    } catch (_error) {
      // failure and explaination
      throw new Error(
        'Setup aborted after 2s: POST /users did not complete — hashpassword not implemented yet.'
      );
    }
  }, 6000); // hook timeout

  // cleanup delete created user after all tests are completed
  afterAll(async () => {
    if (!createdUser._id) return;

    await fetchWithTimeout(
      `${BASE_URL}/users/${createdUser._id}`,
      { method: 'DELETE' },
      4000
    );
  });
  test('GET /users/:id should return the created user by id', async () => {
    // test will not run, yet, beforeall does not succeeed!!
    const res = await fetchWithTimeout(
      `${BASE_URL}/users/${createdUser._id}`,
      {},
      2000
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body._id).toBe(createdUser._id);
  });
});
