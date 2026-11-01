import test from 'node:test';
import assert from 'node:assert/strict';
import { app, resetDatabase } from '../server.js';

async function withServer(testFn) {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const port = server.address().port;

  try {
    await testFn(port);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
}

async function request(port, path, options = {}) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await response.json().catch(() => ({}));
  return { status: response.status, payload };
}

test.beforeEach(async () => {
  await resetDatabase();
});

test('health endpoint works', async () => {
  await withServer(async (port) => {
    const result = await request(port, '/api/health');
    assert.equal(result.status, 200);
    assert.equal(result.payload.ok, true);
  });
});

test('registration creates user, tenant and token', async () => {
  await withServer(async (port) => {
    const result = await request(port, '/api/register', {
      method: 'POST',
      body: {
        fullName: 'Ana García',
        email: 'ana@company.com',
        password: 'secret123',
        businessName: 'Alfa Labs',
        industry: 'software'
      }
    });

    assert.equal(result.status, 201);
    assert.ok(result.payload.token);
    assert.equal(result.payload.user.email, 'ana@company.com');
    assert.equal(result.payload.tenant.name, 'Alfa Labs');
  });
});

test('duplicate email registration is rejected', async () => {
  await withServer(async (port) => {
    await request(port, '/api/register', {
      method: 'POST',
      body: {
        fullName: 'Ana García',
        email: 'ana@company.com',
        password: 'secret123'
      }
    });

    const result = await request(port, '/api/register', {
      method: 'POST',
      body: {
        fullName: 'Ana García',
        email: 'ana@company.com',
        password: 'secret123'
      }
    });

    assert.equal(result.status, 409);
  });
});

test('login returns session token and account data', async () => {
  await withServer(async (port) => {
    await request(port, '/api/register', {
      method: 'POST',
      body: {
        fullName: 'Ana García',
        email: 'ana@company.com',
        password: 'secret123',
        businessName: 'Alfa Labs'
      }
    });

    const result = await request(port, '/api/login', {
      method: 'POST',
      body: {
        email: 'ana@company.com',
        password: 'secret123'
      }
    });

    assert.equal(result.status, 200);
    assert.ok(result.payload.token);
    assert.equal(result.payload.user.email, 'ana@company.com');
  });
});

test('tenant dashboard denies access to another tenant', async () => {
  await withServer(async (port) => {
    const first = await request(port, '/api/register', {
      method: 'POST',
      body: {
        fullName: 'Owner One',
        email: 'one@company.com',
        password: 'secret123',
        businessName: 'Tenant A'
      }
    });

    const second = await request(port, '/api/register', {
      method: 'POST',
      body: {
        fullName: 'Owner Two',
        email: 'two@company.com',
        password: 'secret123',
        businessName: 'Tenant B'
      }
    });

    const tenantA = first.payload.tenant.id;
    const tokenB = second.payload.token;

    const result = await request(port, '/api/dashboard?tenantId=' + tenantA, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenB}`
      }
    });

    assert.equal(result.status, 403);
  });
});

test('trial acceptance is recorded', async () => {
  await withServer(async (port) => {
    const user = await request(port, '/api/register', {
      method: 'POST',
      body: {
        fullName: 'Owner',
        email: 'owner@company.com',
        password: 'secret123',
        businessName: 'Trial Corp'
      }
    });

    const token = user.payload.token;
    const tenantId = user.payload.tenant.id;

    const result = await request(port, '/api/trial/accept', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        tenantId,
        plan: 'growth'
      }
    });

    assert.equal(result.status, 200);
    assert.equal(result.payload.subscription.plan, 'growth');
    assert.equal(result.payload.subscription.consentAccepted, true);
  });
});

test('admin stats require admin role or owner', async () => {
  await withServer(async (port) => {
    const user = await request(port, '/api/register', {
      method: 'POST',
      body: {
        fullName: 'Admin User',
        email: 'admin@company.com',
        password: 'secret123',
        businessName: 'Admin Corp'
      }
    });

    const result = await request(port, '/api/admin/stats', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.payload.token}`
      }
    });

    assert.equal(result.status, 200);
    assert.ok(result.payload.stats);
  });
});
