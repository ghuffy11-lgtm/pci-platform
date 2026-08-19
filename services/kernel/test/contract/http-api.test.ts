/**
 * HTTP API contract, exercised against a real listening socket.
 *
 * Covers WP-0001 AC-03, AC-04, AC-05, AC-07, AC-08 through the transport that clients
 * actually use, rather than by calling the service directly.
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';

import { KernelServer } from '../../src/http/server.ts';
import { KnowledgeService } from '../../src/application/knowledge-service.ts';
import { MemoryKnowledgeRepository } from '../../src/adapters/memory/memory-repository.ts';
import { StaticIdentityProvider } from '../../src/adapters/identity/static-identity-provider.ts';
import { StaticPolicyEngine, ROLES } from '../../src/adapters/policy/static-policy-engine.ts';
import { systemClock } from '../../src/ports/clock.ts';
import { NullLogger } from '../../src/observability/logger.ts';
import { loadConfig } from '../../src/config/config.ts';
import type { StaticPrincipalConfig } from '../../src/config/config.ts';

/* Synthetic development credentials — see security-architecture.md:39. */
const TOKEN_AUTHOR = 'test-token-author-000000000000000001';
const TOKEN_READER = 'test-token-reader-000000000000000002';
const TOKEN_STEWARD = 'test-token-steward-00000000000000003';
const TOKEN_OTHER_TENANT = 'test-token-tenant-b-0000000000000004';

const PRINCIPALS: StaticPrincipalConfig[] = [
  {
    token: TOKEN_AUTHOR,
    subject: 'user:author',
    tenantId: 'tenant-alpha',
    actorType: 'human',
    displayName: 'Author',
    roles: [ROLES.knowledgeAuthor, ROLES.knowledgeReader],
    scopes: [],
    delegatedBy: null,
  },
  {
    token: TOKEN_READER,
    subject: 'user:reader',
    tenantId: 'tenant-alpha',
    actorType: 'human',
    displayName: 'Reader',
    roles: [ROLES.knowledgeReader],
    scopes: [],
    delegatedBy: null,
  },
  {
    token: TOKEN_STEWARD,
    subject: 'user:steward',
    tenantId: 'tenant-alpha',
    actorType: 'human',
    displayName: 'Steward',
    roles: [ROLES.knowledgeSteward, ROLES.knowledgeAuthor, ROLES.knowledgeReader],
    scopes: [],
    delegatedBy: null,
  },
  {
    token: TOKEN_OTHER_TENANT,
    subject: 'user:beta',
    tenantId: 'tenant-beta',
    actorType: 'human',
    displayName: 'Beta',
    roles: [ROLES.knowledgeAuthor, ROLES.knowledgeReader],
    scopes: [],
    delegatedBy: null,
  },
];

let server: KernelServer;
let baseUrl: string;

function api(path: string): string {
  return `${baseUrl}${path}`;
}

async function call(
  method: string,
  path: string,
  options: { token?: string; body?: unknown; headers?: Record<string, string> } = {},
): Promise<{ status: number; json: any; headers: Headers }> {
  const headers: Record<string, string> = { ...(options.headers ?? {}) };
  if (options.token !== undefined) headers['Authorization'] = `Bearer ${options.token}`;
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(api(path), {
    method,
    headers,
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });

  const text = await response.text();
  return {
    status: response.status,
    json: text.length > 0 ? JSON.parse(text) : null,
    headers: response.headers,
  };
}

const sampleBody = {
  type: 'Service',
  name: 'Patient Records API',
  status: 'active',
  ownership: { organization: 'org:clinic', owner: 'user:author' },
  classification: 'internal',
};

before(async () => {
  const config = loadConfig({
    PCI_ENV: 'test',
    PCI_STORE_MODE: 'memory',
    PCI_IDENTITY_MODE: 'static',
    PCI_PORT: '0',
    PCI_HOST: '127.0.0.1',
  });

  const repository = new MemoryKnowledgeRepository();
  const policy = new StaticPolicyEngine();

  const service = new KnowledgeService({
    repository,
    policy,
    clock: systemClock,
    logger: new NullLogger(),
    environment: 'test',
  });

  server = new KernelServer({
    config,
    service,
    identity: new StaticIdentityProvider(PRINCIPALS),
    policy,
    repository,
    logger: new NullLogger(),
    startedAt: Date.now(),
    version: '0.1.0-test',
  });

  await server.listen();
  baseUrl = `http://127.0.0.1:${server.boundPort}`;
});

after(async () => {
  await server.close();
});

/* ------------------------------------------------------------------- AC-08 */

describe('AC-08 — health and readiness', () => {
  test('liveness is public and reports status', async () => {
    const response = await call('GET', '/health/live');
    assert.equal(response.status, 200);
    assert.equal(response.json.status, 'ok');
  });

  test('readiness reports dependency status', async () => {
    const response = await call('GET', '/health/ready');
    assert.equal(response.status, 200);
    assert.equal(response.json.status, 'ready');
    assert.equal(response.json.checks.store.status, 'ok');
    assert.equal(response.json.checks.policy.version.length > 0, true);
  });

  test('health output reveals no secrets or sensitive configuration', async () => {
    const response = await call('GET', '/health/ready');
    const serialised = JSON.stringify(response.json);

    for (const secret of [TOKEN_AUTHOR, TOKEN_READER, TOKEN_STEWARD, TOKEN_OTHER_TENANT]) {
      assert.equal(serialised.includes(secret), false, 'tokens must not appear in health output');
    }
    assert.equal(serialised.includes('postgres://'), false);
    assert.equal(serialised.includes('password'), false);
    assert.equal(serialised.includes('user:author'), false, 'principals must not be enumerated');
  });
});

/* -------------------------------------------------------------- authentication */

describe('authentication', () => {
  test('an unauthenticated request is rejected with 401', async () => {
    const response = await call('GET', '/api/v1/objects');
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('www-authenticate'), 'Bearer realm="pci-kernel"');
  });

  test('an invalid token is rejected identically to a missing one', async () => {
    const missing = await call('GET', '/api/v1/objects');
    const invalid = await call('GET', '/api/v1/objects', { token: 'nope-nope-nope-nope-nope' });

    assert.equal(invalid.status, 401);
    assert.equal(
      invalid.json.detail,
      missing.json.detail,
      'the responses must be indistinguishable — no credential oracle',
    );
  });

  test('a non-bearer scheme is rejected', async () => {
    const response = await fetch(api('/api/v1/objects'), {
      headers: { Authorization: `Basic ${Buffer.from('a:b').toString('base64')}` },
    });
    assert.equal(response.status, 401);
  });
});

/* ------------------------------------------------------------------- AC-03 */

describe('AC-03 — create a Knowledge Object over HTTP', () => {
  test('creates and returns 201 with Location and ETag', async () => {
    const response = await call('POST', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      body: sampleBody,
    });

    assert.equal(response.status, 201);
    assert.equal(response.json.type, 'Service');
    assert.equal(response.json.version, 1);
    assert.ok(response.headers.get('location')?.includes(response.json.id));
    assert.equal(response.headers.get('etag'), '"1"');
    assert.equal(response.json.provenance.length, 1);
  });

  test('the created object is retrievable', async () => {
    const created = await call('POST', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      body: sampleBody,
    });
    const fetched = await call('GET', `/api/v1/objects/${created.json.id}`, {
      token: TOKEN_AUTHOR,
    });

    assert.equal(fetched.status, 200);
    assert.equal(fetched.json.id, created.json.id);
  });

  test('every response carries a correlation id', async () => {
    const response = await call('GET', '/api/v1/objects', { token: TOKEN_AUTHOR });
    assert.ok(response.headers.get('x-correlation-id'));
  });

  test('a caller-supplied correlation id is honoured when it is a UUID', async () => {
    const correlationId = '11111111-1111-4111-8111-111111111111';
    const response = await call('GET', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      headers: { 'X-Correlation-Id': correlationId },
    });
    assert.equal(response.headers.get('x-correlation-id'), correlationId);
  });

  test('a malformed correlation id is replaced rather than echoed', async () => {
    const response = await call('GET', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      headers: { 'X-Correlation-Id': 'not-a-uuid<script>' },
    });
    assert.notEqual(response.headers.get('x-correlation-id'), 'not-a-uuid<script>');
  });
});

/* ------------------------------------------------------------------- AC-04 */

describe('AC-04 — relationships over HTTP', () => {
  test('creates and queries a typed relationship', async () => {
    const from = await call('POST', '/api/v1/objects', { token: TOKEN_AUTHOR, body: sampleBody });
    const to = await call('POST', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      body: { ...sampleBody, name: 'Billing API' },
    });

    const created = await call('POST', '/api/v1/relationships', {
      token: TOKEN_AUTHOR,
      body: { fromId: from.json.id, toId: to.json.id, type: 'DEPENDS_ON' },
    });

    assert.equal(created.status, 201);
    assert.equal(created.json.type, 'DEPENDS_ON');

    const listed = await call(
      'GET',
      `/api/v1/relationships?fromId=${from.json.id}`,
      { token: TOKEN_AUTHOR },
    );
    assert.equal(listed.status, 200);
    assert.equal(listed.json.total, 1);
  });

  test('returns the neighbourhood of an object', async () => {
    const a = await call('POST', '/api/v1/objects', { token: TOKEN_AUTHOR, body: sampleBody });
    const b = await call('POST', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      body: { ...sampleBody, name: 'Neighbour' },
    });
    await call('POST', '/api/v1/relationships', {
      token: TOKEN_AUTHOR,
      body: { fromId: a.json.id, toId: b.json.id, type: 'HOSTS' },
    });

    const response = await call('GET', `/api/v1/objects/${a.json.id}/neighbourhood`, {
      token: TOKEN_AUTHOR,
    });
    assert.equal(response.status, 200);
    assert.equal(response.json.outbound.length, 1);
  });
});

/* ------------------------------------------------------------------- AC-05 */

describe('AC-05 — tenant isolation over HTTP', () => {
  test('tenant B cannot read a tenant A object', async () => {
    const created = await call('POST', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      body: sampleBody,
    });

    const cross = await call('GET', `/api/v1/objects/${created.json.id}`, {
      token: TOKEN_OTHER_TENANT,
    });

    assert.equal(cross.status, 404, 'must be 404, not 403 — see ADR-0016');
  });

  test('tenant B cannot modify a tenant A object', async () => {
    const created = await call('POST', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      body: sampleBody,
    });

    const cross = await call('PATCH', `/api/v1/objects/${created.json.id}`, {
      token: TOKEN_OTHER_TENANT,
      body: { name: 'Hijacked' },
      headers: { 'If-Match': '1' },
    });

    assert.equal(cross.status, 404);

    const original = await call('GET', `/api/v1/objects/${created.json.id}`, {
      token: TOKEN_AUTHOR,
    });
    assert.equal(original.json.name, 'Patient Records API');
  });
});

/* ------------------------------------------------------------------- AC-07 */

describe('AC-07 — deterministic rejection over HTTP', () => {
  test('an unknown object type yields 400 with structured issues', async () => {
    const response = await call('POST', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      body: { ...sampleBody, type: 'Spaceship' },
    });

    assert.equal(response.status, 400);
    assert.equal(response.headers.get('content-type')?.includes('application/problem+json'), true);
    assert.equal(response.json.code, 'validation_failed');
    assert.equal(response.json.errors[0].field, 'type');
    assert.equal(response.json.errors[0].rule, 'enum');
  });

  test('missing required fields are all reported at once', async () => {
    const response = await call('POST', '/api/v1/objects', { token: TOKEN_AUTHOR, body: {} });
    assert.equal(response.status, 400);
    const fields = response.json.errors.map((issue: { field: string }) => issue.field).sort();
    assert.deepEqual(fields, ['classification', 'name', 'ownership', 'type']);
  });

  test('a reader is forbidden from creating', async () => {
    const response = await call('POST', '/api/v1/objects', {
      token: TOKEN_READER,
      body: sampleBody,
    });
    assert.equal(response.status, 403);
    assert.equal(response.json.code, 'forbidden');
    assert.ok(response.json.policyVersion);
  });

  test('a mutation without If-Match is rejected', async () => {
    const created = await call('POST', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      body: sampleBody,
    });

    const response = await call('PATCH', `/api/v1/objects/${created.json.id}`, {
      token: TOKEN_AUTHOR,
      body: { name: 'Renamed' },
    });

    assert.equal(response.status, 400);
    assert.equal(response.json.errors[0].field, 'If-Match');
  });

  test('a stale If-Match yields 409 with the actual version', async () => {
    const created = await call('POST', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      body: sampleBody,
    });
    await call('PATCH', `/api/v1/objects/${created.json.id}`, {
      token: TOKEN_AUTHOR,
      body: { name: 'First' },
      headers: { 'If-Match': '1' },
    });

    const stale = await call('PATCH', `/api/v1/objects/${created.json.id}`, {
      token: TOKEN_AUTHOR,
      body: { name: 'Second' },
      headers: { 'If-Match': '1' },
    });

    assert.equal(stale.status, 409);
    assert.equal(stale.json.actualVersion, 2);
  });

  test('an attribute bag containing a credential is rejected without echoing it', async () => {
    const response = await call('POST', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      body: { ...sampleBody, attributes: { db_password: 'hunter2' } },
    });

    assert.equal(response.status, 400);
    assert.equal(response.json.errors[0].rule, 'secret_key');
    assert.equal(
      JSON.stringify(response.json).includes('hunter2'),
      false,
      'the rejection must not echo the submitted secret',
    );
  });

  test('malformed JSON yields a structured 400', async () => {
    const response = await fetch(api('/api/v1/objects'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN_AUTHOR}`,
        'Content-Type': 'application/json',
      },
      body: '{ not json',
    });
    assert.equal(response.status, 400);
    const problem = (await response.json()) as { code: string };
    assert.equal(problem.code, 'malformed_json');
  });

  test('a non-JSON content type is rejected with 415', async () => {
    const response = await fetch(api('/api/v1/objects'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN_AUTHOR}`, 'Content-Type': 'text/plain' },
      body: 'hello',
    });
    assert.equal(response.status, 415);
  });

  test('an unknown route yields 404 and an unsupported method yields 405', async () => {
    const notFound = await call('GET', '/api/v1/nope', { token: TOKEN_AUTHOR });
    assert.equal(notFound.status, 404);

    const notAllowed = await call('DELETE', '/api/v1/objects', { token: TOKEN_AUTHOR });
    assert.equal(notAllowed.status, 405);
    assert.ok(notAllowed.headers.get('allow')?.includes('GET'));
  });

  test('a malformed object id yields 404 rather than a validation error', async () => {
    const response = await call('GET', '/api/v1/objects/not-a-uuid', { token: TOKEN_AUTHOR });
    assert.equal(response.status, 404, 'must not reveal which identifier formats are valid');
  });

  test('an invalid pagination limit is rejected', async () => {
    const response = await call('GET', '/api/v1/objects?limit=100000', { token: TOKEN_AUTHOR });
    assert.equal(response.status, 400);
    assert.equal(response.json.errors[0].field, 'limit');
  });
});

/* --------------------------------------------------------- history and retire */

describe('lifecycle over HTTP', () => {
  test('history is retrievable after an update', async () => {
    const created = await call('POST', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      body: sampleBody,
    });
    await call('PATCH', `/api/v1/objects/${created.json.id}`, {
      token: TOKEN_AUTHOR,
      body: { name: 'Renamed' },
      headers: { 'If-Match': '1' },
    });

    const history = await call('GET', `/api/v1/objects/${created.json.id}/history`, {
      token: TOKEN_AUTHOR,
    });
    assert.equal(history.status, 200);
    assert.equal(history.json.total, 2);
    assert.equal(history.json.items[0].version, 2);
  });

  test('provenance is retrievable', async () => {
    const created = await call('POST', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      body: sampleBody,
    });
    const provenance = await call('GET', `/api/v1/objects/${created.json.id}/provenance`, {
      token: TOKEN_AUTHOR,
    });
    assert.equal(provenance.status, 200);
    assert.equal(provenance.json.total, 1);
  });

  test('a steward can retire, and the object leaves current-state listings', async () => {
    const created = await call('POST', '/api/v1/objects', {
      token: TOKEN_STEWARD,
      body: { ...sampleBody, name: 'To Be Retired' },
    });

    const retired = await call('POST', `/api/v1/objects/${created.json.id}/retire`, {
      token: TOKEN_STEWARD,
      headers: { 'If-Match': '1' },
    });
    assert.equal(retired.status, 200);
    assert.equal(retired.json.status, 'retired');

    const listing = await call('GET', '/api/v1/objects?limit=200', { token: TOKEN_STEWARD });
    const names = listing.json.items.map((item: { name: string }) => item.name);
    assert.equal(names.includes('To Be Retired'), false);

    // Still addressable directly — retirement is not deletion.
    const direct = await call('GET', `/api/v1/objects/${created.json.id}`, {
      token: TOKEN_STEWARD,
    });
    assert.equal(direct.status, 200);
  });

  test('an author cannot retire', async () => {
    const created = await call('POST', '/api/v1/objects', {
      token: TOKEN_AUTHOR,
      body: sampleBody,
    });
    const response = await call('POST', `/api/v1/objects/${created.json.id}/retire`, {
      token: TOKEN_AUTHOR,
      headers: { 'If-Match': '1' },
    });
    assert.equal(response.status, 403);
  });
});

/* -------------------------------------------------------------- transport limits */

describe('transport hardening', () => {
  test('an oversized body is rejected with 413', async () => {
    const huge = { ...sampleBody, attributes: { blob: 'x'.repeat(2 * 1024 * 1024) } };
    const response = await fetch(api('/api/v1/objects'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN_AUTHOR}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(huge),
    }).catch(() => null);

    // The server destroys the socket once the cap is exceeded, so either a 413 or a
    // connection reset is an acceptable outcome; silently accepting it is not.
    if (response !== null) {
      assert.equal(response.status, 413);
    }
  });

  test('responses set conservative security headers', async () => {
    const response = await call('GET', '/api/v1/objects', { token: TOKEN_AUTHOR });
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('cache-control'), 'no-store');
  });
});
