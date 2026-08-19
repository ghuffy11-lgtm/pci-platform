/**
 * Controlled vocabularies and lifecycle transitions.
 *
 * Sources: docs/knowledge/object-type-registry.md, knowledge-object-lifecycle.md,
 *          relationship-taxonomy.md, data-classification.md.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  allowedTransitions,
  canTransition,
  classificationRank,
  highestClassification,
  isCurrentState,
  isObjectType,
  isRelationshipType,
  LIFECYCLE_STATES,
  OBJECT_TYPES,
  RELATIONSHIP_TYPES,
} from '../../src/domain/vocabulary.ts';
import { normaliseValidationState } from '../../src/domain/provenance.ts';

describe('object type registry', () => {
  test('exposes exactly the WP-0001 initial types', () => {
    // WP-0001 "Initial Object Types" restricts the kernel to these seven. The full registry
    // in object-type-registry.md is intentionally not implemented here.
    assert.deepEqual(
      [...OBJECT_TYPES].sort(),
      ['Agent', 'Asset', 'Document', 'Organization', 'Person', 'Policy', 'Service'],
    );
  });

  test('rejects unknown types', () => {
    assert.equal(isObjectType('NetworkDevice'), false, 'not yet in scope for WP-0001');
    assert.equal(isObjectType('service'), false, 'type names are case-sensitive');
    assert.equal(isObjectType(null), false);
  });
});

describe('relationship taxonomy', () => {
  test('covers all seven families from the taxonomy document', () => {
    // Spot-check one member of each family.
    for (const type of [
      'OWNS',
      'LOCATED_IN',
      'DEPENDS_ON',
      'SUPPORTS',
      'GOVERNED_BY',
      'DOCUMENTED_BY',
      'TRIGGERS',
    ]) {
      assert.equal(isRelationshipType(type), true, `${type} should be recognised`);
    }
    assert.equal(RELATIONSHIP_TYPES.length, 36);
  });

  test('rejects an invented relationship type', () => {
    assert.equal(isRelationshipType('SORT_OF_RELATES_TO'), false);
  });
});

describe('lifecycle transitions', () => {
  test('permits the documented forward path', () => {
    const path = LIFECYCLE_STATES.filter((state) => state !== 'retired');
    for (let index = 0; index < path.length - 1; index += 1) {
      const from = path[index] as (typeof LIFECYCLE_STATES)[number];
      const to = path[index + 1] as (typeof LIFECYCLE_STATES)[number];
      assert.equal(canTransition(from, to), true, `${from} -> ${to} should be permitted`);
    }
  });

  test('retired is terminal', () => {
    assert.deepEqual(allowedTransitions('retired'), []);
    assert.equal(canTransition('retired', 'active'), false);
    assert.equal(canTransition('retired', 'draft'), false);
  });

  test('any non-terminal state may be retired', () => {
    for (const state of LIFECYCLE_STATES) {
      if (state === 'retired') continue;
      assert.equal(canTransition(state, 'retired'), true, `${state} should be retirable`);
    }
  });

  test('forbids skipping states', () => {
    assert.equal(canTransition('proposed', 'active'), false);
    assert.equal(canTransition('draft', 'approved'), false);
  });

  test('permits review rejection back to draft', () => {
    assert.equal(canTransition('reviewed', 'draft'), true);
    assert.equal(canTransition('approved', 'draft'), true);
  });

  test('permits reinstating a deprecated object', () => {
    assert.equal(canTransition('deprecated', 'active'), true);
  });

  test('a no-op transition is permitted', () => {
    assert.equal(canTransition('active', 'active'), true);
  });

  test('retired objects are excluded from current state', () => {
    assert.equal(isCurrentState('retired'), false);
    assert.equal(isCurrentState('deprecated'), true, 'deprecated stays discoverable');
  });
});

describe('classification', () => {
  test('ranks in ascending sensitivity', () => {
    assert.ok(classificationRank('public') < classificationRank('internal'));
    assert.ok(classificationRank('internal') < classificationRank('confidential'));
    assert.ok(classificationRank('confidential') < classificationRank('restricted'));
  });

  test('an aggregate inherits the highest classification of its parts', () => {
    // data-classification.md: "Exports inherit the highest classification of included content."
    assert.equal(highestClassification(['public', 'confidential', 'internal']), 'confidential');
    assert.equal(highestClassification([]), 'public');
    assert.equal(highestClassification(['restricted', 'public']), 'restricted');
  });
});

describe('provenance validation state', () => {
  test('an agent proposal cannot be self-certified as validated', () => {
    // provenance-model.md: AI-generated statements are never authoritative solely because a
    // model produced them.
    assert.equal(normaliseValidationState('agent_proposal', 'validated'), 'unvalidated');
  });

  test('other source types keep the requested state', () => {
    assert.equal(normaliseValidationState('connector_observation', 'validated'), 'validated');
    assert.equal(normaliseValidationState('human_input', undefined), 'unvalidated');
  });
});
