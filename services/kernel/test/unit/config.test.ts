/**
 * Configuration validation and fail-closed production guards.
 *
 * Sources: ADR-0007 (no PCI-implemented authentication), ADR-0009 (externalized secrets),
 *          installation-architecture.md, DISC-0003.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { ConfigError, describeConfig, loadConfig } from '../../src/config/config.ts';

const SYNTHETIC_TOKEN = 'dev-token-not-a-real-credential-0001';

function env(overrides: Record<string, string> = {}): Record<string, string | undefined> {
  return {
    PCI_ENV: 'development',
    PCI_STORE_MODE: 'memory',
    PCI_IDENTITY_MODE: 'static',
    PCI_STATIC_PRINCIPALS: JSON.stringify([
      {
        token: SYNTHETIC_TOKEN,
        subject: 'user:alice',
        tenantId: 'tenant-alpha',
        actorType: 'human',
        roles: ['knowledge_author'],
      },
    ]),
    ...overrides,
  };
}

function problems(fn: () => unknown): readonly string[] {
  try {
    fn();
  } catch (error) {
    assert.ok(error instanceof ConfigError);
    return error.problems;
  }
  assert.fail('expected configuration to be rejected');
}

describe('loadConfig', () => {
  test('accepts a valid development configuration', () => {
    const config = loadConfig(env());
    assert.equal(config.environment, 'development');
    assert.equal(config.storeMode, 'memory');
    assert.equal(config.staticPrincipals.length, 1);
  });

  test('requires a database URL when the store is postgres', () => {
    const found = problems(() => loadConfig(env({ PCI_STORE_MODE: 'postgres' })));
    assert.ok(found.some((problem) => problem.includes('PCI_DATABASE_URL')));
  });

  test('rejects an out-of-range port', () => {
    const found = problems(() => loadConfig(env({ PCI_PORT: '99999' })));
    assert.ok(found.some((problem) => problem.includes('PCI_PORT')));
  });

  test('accepts port 0, meaning any free port', () => {
    assert.equal(loadConfig(env({ PCI_PORT: '0' })).port, 0);
  });

  test('rejects a non-slug tenant id in a static principal', () => {
    const found = problems(() =>
      loadConfig(
        env({
          PCI_STATIC_PRINCIPALS: JSON.stringify([
            {
              token: SYNTHETIC_TOKEN,
              subject: 'user:alice',
              tenantId: 'Tenant Alpha!',
              actorType: 'human',
            },
          ]),
        }),
      ),
    );
    assert.ok(found.some((problem) => problem.includes('tenantId')));
  });

  test('rejects a short static token', () => {
    const found = problems(() =>
      loadConfig(
        env({
          PCI_STATIC_PRINCIPALS: JSON.stringify([
            { token: 'short', subject: 'u', tenantId: 'tenant-alpha', actorType: 'human' },
          ]),
        }),
      ),
    );
    assert.ok(found.some((problem) => problem.includes('token')));
  });

  test('reports every problem at once rather than one per run', () => {
    const found = problems(() =>
      loadConfig({ PCI_ENV: 'nonsense', PCI_PORT: 'abc', PCI_STORE_MODE: 'cassette' }),
    );
    assert.ok(found.length >= 3, `expected several problems, got ${found.length}`);
  });
});

describe('production guards (fail closed)', () => {
  test('the static identity adapter is prohibited in production', () => {
    const found = problems(() =>
      loadConfig(
        env({
          PCI_ENV: 'production',
          PCI_STORE_MODE: 'postgres',
          PCI_DATABASE_URL: 'postgres://user:pw@db:5432/pci',
        }),
      ),
    );
    assert.ok(
      found.some((problem) => problem.includes('PCI_IDENTITY_MODE=static is prohibited')),
      'ADR-0007 forbids PCI implementing authentication; the dev adapter must not reach production',
    );
  });

  test('the in-memory store is prohibited in production', () => {
    const found = problems(() =>
      loadConfig(
        env({
          PCI_ENV: 'production',
          PCI_IDENTITY_MODE: 'oidc',
          PCI_OIDC_ISSUER: 'https://idp.example.com',
          PCI_OIDC_AUDIENCE: 'pci-kernel',
        }),
      ),
    );
    assert.ok(found.some((problem) => problem.includes('PCI_STORE_MODE=memory is prohibited')));
  });

  test('OIDC mode requires issuer and audience', () => {
    const found = problems(() => loadConfig(env({ PCI_IDENTITY_MODE: 'oidc' })));
    assert.ok(found.some((problem) => problem.includes('PCI_OIDC_ISSUER')));
    assert.ok(found.some((problem) => problem.includes('PCI_OIDC_AUDIENCE')));
  });

  test('a fully valid production configuration is accepted', () => {
    const config = loadConfig({
      PCI_ENV: 'production',
      PCI_STORE_MODE: 'postgres',
      PCI_DATABASE_URL: 'postgres://pci_app:pw@db:5432/pci',
      PCI_IDENTITY_MODE: 'oidc',
      PCI_OIDC_ISSUER: 'https://idp.example.com',
      PCI_OIDC_AUDIENCE: 'pci-kernel',
    });
    assert.equal(config.environment, 'production');
    assert.equal(config.identityMode, 'oidc');
  });
});

describe('describeConfig (AC-08)', () => {
  test('never exposes the database URL or static tokens', () => {
    const config = loadConfig(
      env({
        PCI_STORE_MODE: 'postgres',
        PCI_DATABASE_URL: 'postgres://pci_app:sup3rs3cret@db:5432/pci',
      }),
    );

    const serialised = JSON.stringify(describeConfig(config));

    assert.equal(serialised.includes('sup3rs3cret'), false, 'the database password must not leak');
    assert.equal(serialised.includes('postgres://'), false, 'the connection string must not leak');
    assert.equal(serialised.includes(SYNTHETIC_TOKEN), false, 'static tokens must not leak');
    assert.equal(serialised.includes('user:alice'), false, 'principal identifiers must not leak');

    // It should still describe the shape of the configuration.
    assert.match(serialised, /"databaseConfigured":true/);
    assert.match(serialised, /"storeMode":"postgres"/);
  });
});
