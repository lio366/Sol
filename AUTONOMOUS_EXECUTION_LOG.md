import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { app, resetDatabase } from '../server.js';

async function withServer(handler) {
  await resetDatabase();
  const server = createServer(app);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address();
  try {
    await handler(port);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
}

test('health endpoint responds successfully', async () => {
  await withServer(async (port) => {
    const res = await fetch(`http://127.0.0.1:${port}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ok, true);
  });
});

test('register creates a tenant and login returns the user', async () => {
  await withServer(async (port) => {
    const registerRes = await fetch(`http://127.0.0.1:${port}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'Ana Pérez', email: 'ana@example.com', password: 'secret123', businessName: 'Café Verde', industry: 'retail' })
    });

    assert.equal(registerRes.status, 201);
    const registerJson = await registerRes.json();
    assert.ok(registerJson.token);
    assert.ok(registerJson.tenant.id);

    const loginRes = await fetch(`http://127.0.0.1:${port}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ana@example.com', password: 'secret123' })
    });

    assert.equal(loginRes.status, 200);
    const loginJson = await loginRes.json();
    assert.equal(loginJson.user.email, 'ana@example.com');
  });
});
