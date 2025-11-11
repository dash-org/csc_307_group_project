import { jest, describe, expect, test, afterAll } from '@jest/globals';
jest.setTimeout(10000); //timout if longer than 10 seconds
const tempUsernames = new Set(); //used to keep track of users created during tests
function fetchWithTimeout(url, options = {}, ms = 2000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

function authedFetch(url, token, options = {}, ms = 2000) {
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetchWithTimeout(url, { ...options, headers }, ms);
}

async function getToken(BASE_URL) {
  const username = `jest_${Date.now()}@example.com`;
  const pwd = 'P@ssw0rd!';
  tempUsernames.add(username);
  await fetchWithTimeout(
    `${BASE_URL}/signup`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pwd }),
    },
    4000
  );
  const loginRes = await fetchWithTimeout(
    `${BASE_URL}/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pwd }),
    },
    4000
  );
  const { token } = await loginRes.json();
  return token;
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
    const token = await getToken(BASE_URL);
    const response = await authedFetch(`${BASE_URL}/users`, token);
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
    }
  });

  test('GET /users/id should return error (no user exists for this test)', async () => {
    const token = await getToken(BASE_URL);
    const response = await authedFetch(`${BASE_URL}/users/id`, token);
    expect(response.status).toBe(404);
  });
});

/*
describe('Backend live server user tests functions', () => {
  const BASE_URL = 'http://localhost:8000';
  let createdUser = null;
  let authToken = null;

  // Hook timeout greater than fetch timeout
  beforeAll(async () => {
    authToken = await getToken(BASE_URL);
    try {
      const res = await authedFetch(
        `${BASE_URL}/users`,
        authToken,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Mac Tester',
            // No password needed here
          }),
        },
        1000
      ); //1 second timeout

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
    if (!createdUser || !createdUser._id) return;

    await authedFetch(
      `${BASE_URL}/users/${createdUser._id}`,
      authToken,
      { method: 'DELETE' },
      4000
    );
  });
  test('GET /users/:id should return the created user by id', async () => {
    const res = await authedFetch(
      `${BASE_URL}/users/${createdUser._id}`,
      authToken,
      {},
      2000
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body._id).toBe(createdUser._id);
  });
});
*/

// Cleanup any users created during tests
afterAll(async () => {
  const BASE_URL = 'http://localhost:8000';
  const authToken = await getToken(BASE_URL);

  for (const username of tempUsernames) {
    // Fetch user list to find user ID by username
    const usersRes = await authedFetch(
      `${BASE_URL}/users`,
      authToken,
      {},
      4000
    );
    if (usersRes.status !== 200) continue;

    const usersBody = await usersRes.json();
    const user = usersBody.users_list.find((u) => u.name === username);
    if (!user) continue;

    // Delete the user by ID
    await authedFetch(
      `${BASE_URL}/users/${user._id}`,
      authToken,
      { method: 'DELETE' },
      4000
    );
  }
});
