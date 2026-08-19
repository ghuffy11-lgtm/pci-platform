/**
 * Secret exclusion.
 *
 * Sources: canonical-object-schema.md invariant 6, ADR-0009, data-classification.md:23,
 *          SPEC-0006 ("Audit records must not contain secrets").
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  findSecretMaterial,
  findAttributeShapeIssues,
  looksLikeSecretKey,
  matchSecretValue,
  redact,
} from '../../src/domain/secret-guard.ts';
import { validateCreateObject } from '../../src/domain/validation.ts';
import { ValidationError } from '../../src/domain/errors.ts';

describe('looksLikeSecretKey', () => {
  test('flags credential-shaped key names', () => {
    for (const key of [
      'password',
      'api_key',
      'apiKey',
      'client_secret',
      'private_key',
      'accessKey',
      'db_password',
      'auth',
      'bearer_token',
      'passphrase',
    ]) {
      assert.equal(looksLikeSecretKey(key), true, `${key} should be flagged`);
    }
  });

  test('does not flag ordinary field names', () => {
    for (const key of ['name', 'environment', 'owner', 'keyboard', 'tokenizer', 'description']) {
      assert.equal(looksLikeSecretKey(key), false, `${key} should not be flagged`);
    }
  });
});

describe('matchSecretValue', () => {
  test('recognises well-known credential formats', () => {
    // One PEM pattern covers every private-key header variant, OpenSSH included.
    assert.equal(matchSecretValue('-----BEGIN OPENSSH PRIVATE KEY-----\nabc'), 'pem_private_key');
    assert.equal(matchSecretValue('-----BEGIN RSA PRIVATE KEY-----\nabc'), 'pem_private_key');
    assert.equal(matchSecretValue('-----BEGIN PRIVATE KEY-----\nabc'), 'pem_private_key');
    assert.equal(matchSecretValue('AKIAIOSFODNN7EXAMPLE'), 'aws_access_key_id');
    assert.equal(
      matchSecretValue('https://user:hunter2@internal.example.com/path'),
      'basic_auth_url',
    );
  });

  test('leaves ordinary prose alone', () => {
    assert.equal(matchSecretValue('The billing service depends on the records API.'), null);
    assert.equal(matchSecretValue('https://internal.example.com/path'), null);
  });
});

describe('findSecretMaterial', () => {
  test('flags a nested credential-shaped key', () => {
    const found = findSecretMaterial({ db: { host: 'x', password: 'y' } }, 'attributes');
    assert.equal(found.length, 1);
    assert.equal(found[0]?.field, 'attributes.db.password');
    assert.equal(found[0]?.rule, 'secret_key');
  });

  test('does not descend into a flagged key', () => {
    // The value under a secret-named key must not be inspected or echoed.
    const found = findSecretMaterial({ secret: { nested: { deeper: 'x' } } }, 'attributes');
    assert.equal(found.length, 1, 'exactly one issue, from the key itself');
  });

  test('flags credential-shaped values under innocuous keys', () => {
    const found = findSecretMaterial({ note: 'AKIAIOSFODNN7EXAMPLE' }, 'attributes');
    assert.equal(found[0]?.rule, 'secret_material');
  });

  test('accepts a clean attribute bag', () => {
    assert.deepEqual(findSecretMaterial({ tier: 1, region: 'eu-west' }, 'attributes'), []);
  });

  test('flags excessive nesting depth', () => {
    let deep: Record<string, unknown> = { value: 1 };
    for (let i = 0; i < 12; i += 1) deep = { nested: deep };
    const found = findSecretMaterial(deep, 'attributes');
    assert.ok(found.some((issue) => issue.rule === 'max_depth'));
  });
});

describe('findAttributeShapeIssues', () => {
  test('rejects non-objects', () => {
    assert.equal(findAttributeShapeIssues([1, 2], 'attributes')[0]?.rule, 'type');
    assert.equal(findAttributeShapeIssues('x', 'attributes')[0]?.rule, 'type');
  });

  test('rejects an oversized bag', () => {
    const big = { blob: 'x'.repeat(300 * 1024) };
    assert.equal(findAttributeShapeIssues(big, 'attributes')[0]?.rule, 'max_size');
  });

  test('accepts a normal bag', () => {
    assert.deepEqual(findAttributeShapeIssues({ a: 1 }, 'attributes'), []);
  });
});

describe('redact', () => {
  test('replaces secret-named keys and secret-shaped values', () => {
    const result = redact({
      user: 'alice',
      password: 'hunter2',
      note: 'AKIAIOSFODNN7EXAMPLE',
    }) as Record<string, unknown>;

    assert.equal(result['user'], 'alice');
    assert.equal(result['password'], '[redacted]');
    assert.equal(result['note'], '[redacted]');
  });

  test('never throws on awkward input', () => {
    assert.doesNotThrow(() => redact(undefined));
    assert.doesNotThrow(() => redact(null));
    assert.doesNotThrow(() => redact([1, { token: 'x' }]));
  });

  test('recurses through arrays', () => {
    const result = redact([{ apiKey: 'abc' }]) as Record<string, unknown>[];
    assert.equal(result[0]?.['apiKey'], '[redacted]');
  });
});

describe('integration with object validation', () => {
  test('a create request carrying a credential is rejected', () => {
    assert.throws(
      () =>
        validateCreateObject({
          type: 'Service',
          name: 'Billing',
          ownership: { organization: 'o', owner: 'u' },
          classification: 'internal',
          attributes: { db_password: 'hunter2' },
        }),
      (error: unknown) => {
        assert.ok(error instanceof ValidationError);
        assert.equal(error.issues[0]?.rule, 'secret_key');
        // The rejection must not echo the secret value back to the caller.
        assert.equal(
          JSON.stringify(error.issues).includes('hunter2'),
          false,
          'the rejection must not contain the submitted secret',
        );
        return true;
      },
    );
  });
});
