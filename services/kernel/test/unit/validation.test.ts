/**
 * WP-0001 AC-07 — invalid object types, malformed relationships, missing required fields
 * are rejected deterministically.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { ValidationError } from '../../src/domain/errors.ts';
import {
  validateCreateObject,
  validateCreateRelationship,
  validateProvenanceArray,
  validateUpdateObject,
  validatePagination,
  isIsoInstant,
} from '../../src/domain/validation.ts';

const VALID_UUID_A = '9f1c4a4e-4f2a-4a63-9c2e-2b8a1d0e5f11';
const VALID_UUID_B = '3a7d2c11-8e6b-4d51-90f7-6c5b4a3e2d10';

function issues(fn: () => unknown): { field: string; rule: string }[] {
  try {
    fn();
  } catch (error) {
    assert.ok(error instanceof ValidationError, `expected ValidationError, got ${String(error)}`);
    return error.issues.map((issue) => ({ field: issue.field, rule: issue.rule }));
  }
  assert.fail('expected validation to fail');
}

describe('validateCreateObject', () => {
  test('accepts a well-formed object', () => {
    const result = validateCreateObject({
      type: 'Service',
      name: '  Billing API  ',
      ownership: { organization: 'org:clinic', owner: 'user:alice' },
      classification: 'internal',
    });

    assert.equal(result.type, 'Service');
    assert.equal(result.name, 'Billing API', 'name should be trimmed');
    assert.equal(result.status, 'proposed', 'status defaults to the first lifecycle state');
    assert.deepEqual(result.attributes, {});
  });

  test('rejects an object type outside the registry', () => {
    const found = issues(() =>
      validateCreateObject({
        type: 'Spaceship',
        name: 'x',
        ownership: { organization: 'o', owner: 'u' },
        classification: 'internal',
      }),
    );
    assert.deepEqual(found, [{ field: 'type', rule: 'enum' }]);
  });

  test('collects every problem rather than stopping at the first', () => {
    const found = issues(() => validateCreateObject({}));
    const fields = found.map((issue) => issue.field).sort();
    assert.deepEqual(fields, ['classification', 'name', 'ownership', 'type']);
  });

  test('is deterministic — identical input yields an identical issue list', () => {
    const first = issues(() => validateCreateObject({ type: 'Nope' }));
    const second = issues(() => validateCreateObject({ type: 'Nope' }));
    assert.deepEqual(first, second);
  });

  test('rejects creation directly into the retired state', () => {
    const found = issues(() =>
      validateCreateObject({
        type: 'Service',
        name: 'x',
        status: 'retired',
        ownership: { organization: 'o', owner: 'u' },
        classification: 'internal',
      }),
    );
    assert.deepEqual(found, [{ field: 'status', rule: 'illegal_initial_state' }]);
  });

  test('rejects a validity window that ends before it starts', () => {
    const found = issues(() =>
      validateCreateObject({
        type: 'Service',
        name: 'x',
        ownership: { organization: 'o', owner: 'u' },
        classification: 'internal',
        validFrom: '2026-08-19T00:00:00Z',
        validTo: '2026-08-18T00:00:00Z',
      }),
    );
    assert.deepEqual(found, [{ field: 'validTo', rule: 'range' }]);
  });

  test('rejects a blank name', () => {
    const found = issues(() =>
      validateCreateObject({
        type: 'Service',
        name: '   ',
        ownership: { organization: 'o', owner: 'u' },
        classification: 'internal',
      }),
    );
    assert.deepEqual(found, [{ field: 'name', rule: 'not_blank' }]);
  });

  test('rejects a non-object body', () => {
    const found = issues(() => validateCreateObject('not an object'));
    assert.deepEqual(found, [{ field: '(body)', rule: 'type' }]);
  });
});

describe('validateUpdateObject', () => {
  test('rejects attempts to change immutable fields', () => {
    const found = issues(() =>
      validateUpdateObject({ type: 'Person', id: 'x', version: 4 }, 'active'),
    );
    assert.deepEqual(
      found.map((issue) => issue.field).sort(),
      ['id', 'type', 'version'],
      'immutable fields must be rejected explicitly, not silently discarded',
    );
  });

  test('rejects an illegal lifecycle transition', () => {
    const found = issues(() => validateUpdateObject({ status: 'active' }, 'retired'));
    assert.deepEqual(found, [{ field: 'status', rule: 'illegal_transition' }]);
  });

  test('permits a legal lifecycle transition', () => {
    const patch = validateUpdateObject({ status: 'deprecated' }, 'active');
    assert.equal(patch.status, 'deprecated');
  });

  test('distinguishes an absent field from an explicit null', () => {
    const patch = validateUpdateObject({ validTo: null }, 'active');
    assert.ok('validTo' in patch, 'an explicit null must reach the patch');
    assert.equal(patch.validTo, null);

    const empty = validateUpdateObject({}, 'active');
    assert.equal('validTo' in empty, false, 'an absent field must not appear in the patch');
  });
});

describe('validateCreateRelationship', () => {
  test('accepts a well-formed relationship', () => {
    const result = validateCreateRelationship({
      fromId: VALID_UUID_A,
      toId: VALID_UUID_B,
      type: 'DEPENDS_ON',
    });
    assert.equal(result.type, 'DEPENDS_ON');
    assert.equal(result.confidence, null);
  });

  test('rejects a relationship type outside the taxonomy', () => {
    const found = issues(() =>
      validateCreateRelationship({ fromId: VALID_UUID_A, toId: VALID_UUID_B, type: 'LIKES' }),
    );
    assert.deepEqual(found, [{ field: 'type', rule: 'enum' }]);
  });

  test('rejects a self-referential relationship', () => {
    const found = issues(() =>
      validateCreateRelationship({ fromId: VALID_UUID_A, toId: VALID_UUID_A, type: 'DEPENDS_ON' }),
    );
    assert.deepEqual(found, [{ field: 'toId', rule: 'self_reference' }]);
  });

  test('rejects non-UUID endpoints', () => {
    const found = issues(() =>
      validateCreateRelationship({ fromId: 'abc', toId: 'def', type: 'DEPENDS_ON' }),
    );
    assert.deepEqual(found, [
      { field: 'fromId', rule: 'format' },
      { field: 'toId', rule: 'format' },
    ]);
  });

  test('rejects confidence outside [0,1]', () => {
    const found = issues(() =>
      validateCreateRelationship({
        fromId: VALID_UUID_A,
        toId: VALID_UUID_B,
        type: 'DEPENDS_ON',
        confidence: 1.5,
      }),
    );
    assert.deepEqual(found, [{ field: 'confidence', rule: 'range' }]);
  });
});

describe('validateProvenanceArray', () => {
  test('returns an empty array when absent', () => {
    assert.deepEqual(validateProvenanceArray(undefined), []);
  });

  test('rejects an unknown source type', () => {
    const found = issues(() => validateProvenanceArray([{ sourceId: 's', sourceType: 'telepathy' }]));
    assert.deepEqual(found, [{ field: 'provenance[0].sourceType', rule: 'enum' }]);
  });

  test('accepts a well-formed record', () => {
    const result = validateProvenanceArray([
      { sourceId: 'cmdb:1234', sourceType: 'connector_observation', confidence: 0.8 },
    ]);
    assert.equal(result.length, 1);
    assert.equal(result[0]?.sourceType, 'connector_observation');
  });
});

describe('isIsoInstant', () => {
  test('accepts full ISO-8601 instants', () => {
    assert.equal(isIsoInstant('2026-08-19T10:30:00Z'), true);
    assert.equal(isIsoInstant('2026-08-19T10:30:00.123Z'), true);
    assert.equal(isIsoInstant('2026-08-19T10:30:00+03:00'), true);
  });

  test('rejects loose values that Date.parse would otherwise accept', () => {
    // Date.parse('2026') succeeds; the domain must not.
    assert.equal(isIsoInstant('2026'), false);
    assert.equal(isIsoInstant('2026-08-19'), false);
    assert.equal(isIsoInstant('August 19, 2026'), false);
    assert.equal(isIsoInstant(''), false);
    assert.equal(isIsoInstant(null), false);
  });
});

describe('validatePagination', () => {
  test('applies defaults', () => {
    assert.deepEqual(validatePagination(null, null), { limit: 50, offset: 0 });
  });

  test('rejects a limit above the maximum', () => {
    const found = issues(() => validatePagination('5000', null));
    assert.deepEqual(found, [{ field: 'limit', rule: 'range' }]);
  });

  test('rejects a negative offset', () => {
    const found = issues(() => validatePagination(null, '-1'));
    assert.deepEqual(found, [{ field: 'offset', rule: 'range' }]);
  });

  test('rejects non-integer values', () => {
    const found = issues(() => validatePagination('abc', null));
    assert.deepEqual(found, [{ field: 'limit', rule: 'range' }]);
  });
});
