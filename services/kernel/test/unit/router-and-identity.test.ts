/**
 * Router matching, the development identity adapter, and log redaction.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { MatchKind, Router } from '../../src/http/router.ts';
import { StaticIdentityProvider } from '../../src/adapters/identity/static-identity-provider.ts';
import { OidcIdentityProvider } from '../../src/adapters/identity/oidc-identity-provider.ts';
import { NotImplementedError } from '../../src/domain/errors.ts';
import { MemoryLogger } from '../../src/observability/logger.ts';
import type { StaticPrincipalConfig } from '../../src/config/config.ts';

/* --------------------------------------------------------------------- router */

describe('Router', () => {
  const noop = async () => ({ status: 200 });

  test('matches a literal route', () => {
    const router = new Router().add('GET', '/api/v1/objects', noop);
    const result = router.match('GET', '/api/v1/objects');
    assert.equal(result.kind, MatchKind.Found);
  });

  test('extracts path parameters', () => {
    const router = new Router().add('GET', '/api/v1/objects/:id', noop);
    const result = router.match('GET', '/api/v1/objects/abc-123');
    assert.equal(result.kind, MatchKind.Found);
    if (result.kind !== MatchKind.Found) return;
    assert.equal(result.route.params['id'], 'abc-123');
  });

  test('percent-decodes parameters', () => {
    const router = new Router().add('GET', '/api/v1/objects/:id', noop);
    const result = router.match('GET', '/api/v1/objects/a%20b');
    assert.equal(result.kind, MatchKind.Found);
    if (result.kind !== MatchKind.Found) return;
    assert.equal(result.route.params['id'], 'a b');
  });

  test('an encoded slash cannot change path segmentation', () => {
    const router = new Router().add('GET', '/api/v1/objects/:id', noop);
    const result = router.match('GET', '/api/v1/objects/a%2Fb');
    assert.equal(result.kind, MatchKind.Found);
    if (result.kind !== MatchKind.Found) return;
    assert.equal(result.route.params['id'], 'a/b', 'decoded after segmentation, not before');
  });

  test('reports method-not-allowed with the permitted methods', () => {
    const router = new Router()
      .add('GET', '/api/v1/objects', noop)
      .add('POST', '/api/v1/objects', noop);
    const result = router.match('DELETE', '/api/v1/objects');
    assert.equal(result.kind, MatchKind.MethodNotAllowed);
    if (result.kind !== MatchKind.MethodNotAllowed) return;
    assert.deepEqual(result.allowed, ['GET', 'POST']);
  });

  test('reports not-found for an unknown path', () => {
    const router = new Router().add('GET', '/api/v1/objects', noop);
    assert.equal(router.match('GET', '/nope').kind, MatchKind.NotFound);
  });

  test('does not match a longer or shorter path', () => {
    const router = new Router().add('GET', '/api/v1/objects/:id', noop);
    assert.equal(router.match('GET', '/api/v1/objects').kind, MatchKind.NotFound);
    assert.equal(router.match('GET', '/api/v1/objects/a/b').kind, MatchKind.NotFound);
  });
});

/* ------------------------------------------------------------------- identity */

describe('StaticIdentityProvider', () => {
  const SYNTHETIC_TOKEN = 'dev-token-not-a-real-credential-0001';

  const principals: StaticPrincipalConfig[] = [
    {
      token: SYNTHETIC_TOKEN,
      subject: 'user:alice',
      tenantId: 'tenant-alpha',
      actorType: 'human',
      displayName: 'Alice',
      roles: ['knowledge_author'],
      scopes: [],
      delegatedBy: null,
    },
  ];

  test('resolves a known token to a principal', async () => {
    const provider = new StaticIdentityProvider(principals);
    const principal = await provider.verify(SYNTHETIC_TOKEN);
    assert.ok(principal);
    assert.equal(principal.id, 'user:alice');
    assert.equal(principal.tenantId, 'tenant-alpha');
  });

  test('returns null for an unknown token', async () => {
    const provider = new StaticIdentityProvider(principals);
    assert.equal(await provider.verify('wrong-token-value-0000000000'), null);
  });

  test('returns null for an empty credential', async () => {
    const provider = new StaticIdentityProvider(principals);
    assert.equal(await provider.verify(''), null);
  });

  test('a prefix of a valid token is rejected', async () => {
    const provider = new StaticIdentityProvider(principals);
    assert.equal(
      await provider.verify(SYNTHETIC_TOKEN.slice(0, 20)),
      null,
      'length padding must not create a false match',
    );
  });

  test('an empty principal table authenticates nobody', async () => {
    const provider = new StaticIdentityProvider([]);
    assert.equal(await provider.verify(SYNTHETIC_TOKEN), null);
  });
});

describe('OidcIdentityProvider', () => {
  test('fails closed rather than accepting a token', async () => {
    const provider = new OidcIdentityProvider({
      issuer: 'https://idp.example.com',
      audience: 'pci-kernel',
    });

    await assert.rejects(
      () => provider.verify('any-token'),
      (error: unknown) => {
        assert.ok(error instanceof NotImplementedError);
        return true;
      },
      'an unimplemented identity provider must never return a principal',
    );
  });
});

/* --------------------------------------------------------------------- logger */

describe('JsonLogger redaction', () => {
  test('redacts secret-shaped fields before they reach the log', () => {
    const logger = new MemoryLogger();
    logger.info('db.connect', { host: 'db', password: 'hunter2' });

    const record = logger.records[0];
    assert.ok(record);
    assert.equal(record.fields['host'], 'db');
    assert.equal(record.fields['password'], '[redacted]', 'ADR-0009: secrets never in logs');
  });

  test('a child logger inherits base fields and shares the record stream', () => {
    const logger = new MemoryLogger();
    const child = logger.child({ correlationId: 'abc' });
    child.warn('something', { extra: 1 });

    assert.equal(logger.records.length, 1);
    assert.equal(logger.records[0]?.fields['correlationId'], 'abc');
    assert.equal(logger.records[0]?.fields['extra'], 1);
  });
});
