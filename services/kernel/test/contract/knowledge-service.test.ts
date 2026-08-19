/**
 * Application-service behaviour.
 *
 * Covers WP-0001 AC-03 (create), AC-04 (relationships), AC-06 (audit), AC-07 (rejection).
 * Tenant isolation (AC-05) has its own file.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  ApprovalRequiredError,
  AuthorizationError,
  ConflictError,
  NotFoundError,
  ValidationError,
  VersionConflictError,
} from '../../src/domain/errors.ts';
import { newObjectId } from '../../src/domain/identifiers.ts';
import { EVENT_TYPES } from '../../src/domain/event.ts';
import {
  adminContext,
  agentContext,
  authorContext,
  harness,
  readerContext,
  sampleObject,
  stewardContext,
  securityOfficerContext,
} from '../support/fixtures.ts';

/* ------------------------------------------------------------------- AC-03 */

describe('AC-03 — create a Knowledge Object', () => {
  test('creates with identity, type, ownership, classification, lifecycle, provenance', async () => {
    const { service } = harness();
    const context = authorContext();

    const { object, provenance } = await service.createObject(context, sampleObject(), []);

    assert.ok(object.id.length > 0, 'must have a stable identity');
    assert.equal(object.type, 'Service');
    assert.deepEqual(object.ownership, { organization: 'org:clinic', owner: 'user:alice' });
    assert.equal(object.classification, 'internal');
    assert.equal(object.status, 'active');
    assert.equal(object.version, 1);
    assert.equal(object.createdBy, context.principal.id);
    assert.equal(object.tenantId, context.tenantId);

    assert.equal(provenance.length, 1, 'provenance is synthesised when the caller supplies none');
    assert.equal(provenance[0]?.sourceType, 'human_input');
    assert.equal(provenance[0]?.actorId, context.principal.id);
  });

  test('records caller-supplied provenance', async () => {
    const { service } = harness();
    const { provenance } = await service.createObject(authorContext(), sampleObject(), [
      {
        sourceId: 'cmdb:host-42',
        sourceType: 'connector_observation',
        connector: 'cmdb',
        confidence: 0.75,
      },
    ]);

    assert.equal(provenance.length, 1);
    assert.equal(provenance[0]?.sourceId, 'cmdb:host-42');
    assert.equal(provenance[0]?.confidence, 0.75);
  });

  test('an agent proposal cannot be recorded as validated', async () => {
    const { service } = harness();
    const { provenance } = await service.createObject(adminContext(), sampleObject(), [
      { sourceId: 'model:x', sourceType: 'agent_proposal', validationState: 'validated' },
    ]);

    assert.equal(
      provenance[0]?.validationState,
      'unvalidated',
      'provenance-model.md: a model cannot self-certify its output as authoritative',
    );
  });

  test('the object is retrievable after creation', async () => {
    const { service } = harness();
    const context = authorContext();
    const { object } = await service.createObject(context, sampleObject(), []);

    const found = await service.getObject(context, object.id);
    assert.equal(found.id, object.id);
  });

  test('creation emits an event carrying the correlation id', async () => {
    const { service, repository } = harness();
    const context = authorContext();
    await service.createObject(context, sampleObject(), []);

    const events = repository.allEvents();
    assert.equal(events.length, 1);
    assert.equal(events[0]?.type, EVENT_TYPES.objectCreated);
    assert.equal(events[0]?.correlationId, context.correlationId);
    assert.equal(events[0]?.payloadVersion, 1);
  });
});

/* ------------------------------------------------------------------- AC-04 */

describe('AC-04 — typed relationships', () => {
  test('creates and queries a relationship between two existing objects', async () => {
    const { service } = harness();
    const context = authorContext();

    const { object: from } = await service.createObject(
      context,
      sampleObject({ name: 'Billing' }),
      [],
    );
    const { object: to } = await service.createObject(
      context,
      sampleObject({ name: 'Records' }),
      [],
    );

    const relationship = await service.createRelationship(context, {
      fromId: from.id,
      toId: to.id,
      type: 'DEPENDS_ON',
    });

    assert.equal(relationship.type, 'DEPENDS_ON');
    assert.equal(relationship.fromId, from.id);

    const page = await service.listRelationships(context, {
      fromId: from.id,
      limit: 50,
      offset: 0,
    });
    assert.equal(page.total, 1);
  });

  test('returns the object neighbourhood in both directions', async () => {
    const { service } = harness();
    const context = authorContext();

    const { object: a } = await service.createObject(context, sampleObject({ name: 'A' }), []);
    const { object: b } = await service.createObject(context, sampleObject({ name: 'B' }), []);
    const { object: c } = await service.createObject(context, sampleObject({ name: 'C' }), []);

    await service.createRelationship(context, { fromId: a.id, toId: b.id, type: 'DEPENDS_ON' });
    await service.createRelationship(context, { fromId: c.id, toId: a.id, type: 'HOSTS' });

    const neighbourhood = await service.getNeighbourhood(context, a.id, 50);
    assert.equal(neighbourhood.outbound.length, 1);
    assert.equal(neighbourhood.inbound.length, 1);
    assert.equal(neighbourhood.outbound[0]?.toId, b.id);
    assert.equal(neighbourhood.inbound[0]?.fromId, c.id);
  });

  test('rejects a relationship whose endpoint does not exist', async () => {
    const { service } = harness();
    const context = authorContext();
    const { object } = await service.createObject(context, sampleObject(), []);

    await assert.rejects(
      () =>
        service.createRelationship(context, {
          fromId: object.id,
          toId: newObjectId(),
          type: 'DEPENDS_ON',
        }),
      (error: unknown) => {
        assert.ok(error instanceof ValidationError);
        assert.equal(error.issues[0]?.field, 'toId');
        assert.equal(error.issues[0]?.rule, 'unknown_reference');
        return true;
      },
    );
  });

  test('rejects a duplicate edge', async () => {
    const { service } = harness();
    const context = authorContext();
    const { object: from } = await service.createObject(context, sampleObject(), []);
    const { object: to } = await service.createObject(context, sampleObject(), []);

    await service.createRelationship(context, { fromId: from.id, toId: to.id, type: 'DEPENDS_ON' });

    await assert.rejects(
      () =>
        service.createRelationship(context, {
          fromId: from.id,
          toId: to.id,
          type: 'DEPENDS_ON',
        }),
      (error: unknown) => {
        assert.ok(error instanceof ConflictError);
        assert.equal(error.code, 'duplicate_relationship');
        return true;
      },
    );
  });

  test('a steward can remove a relationship', async () => {
    const { service } = harness();
    const context = stewardContext();
    const { object: from } = await service.createObject(context, sampleObject(), []);
    const { object: to } = await service.createObject(context, sampleObject(), []);
    const relationship = await service.createRelationship(context, {
      fromId: from.id,
      toId: to.id,
      type: 'DEPENDS_ON',
    });

    await service.removeRelationship(context, relationship.id);

    const page = await service.listRelationships(context, { limit: 50, offset: 0 });
    assert.equal(page.total, 0);
  });
});

/* ---------------------------------------------------- versioning and lifecycle */

describe('versioning and lifecycle', () => {
  test('an update increments the version and records history', async () => {
    const { service } = harness();
    const context = authorContext();
    const { object } = await service.createObject(context, sampleObject(), []);

    const updated = await service.updateObject(context, object.id, { name: 'Renamed' }, 1);
    assert.equal(updated.version, 2);
    assert.equal(updated.name, 'Renamed');

    const history = await service.getHistory(context, object.id, 50, 0);
    assert.equal(history.total, 2);
    assert.equal(history.items[0]?.version, 2);
    assert.equal(history.items[1]?.changeKind, 'created');
  });

  test('a stale version is rejected', async () => {
    const { service } = harness();
    const context = authorContext();
    const { object } = await service.createObject(context, sampleObject(), []);
    await service.updateObject(context, object.id, { name: 'First' }, 1);

    await assert.rejects(
      () => service.updateObject(context, object.id, { name: 'Second' }, 1),
      (error: unknown) => {
        assert.ok(error instanceof VersionConflictError);
        assert.equal(error.actualVersion, 2);
        return true;
      },
    );
  });

  test('retirement is a lifecycle transition, and the object remains retrievable', async () => {
    const { service } = harness();
    const context = stewardContext();
    const { object } = await service.createObject(context, sampleObject(), []);

    const retired = await service.retireObject(context, object.id, 1);
    assert.equal(retired.status, 'retired');

    const found = await service.getObject(context, object.id);
    assert.equal(
      found.status,
      'retired',
      'canonical-object-schema.md invariant 1: identifiers stay stable; retirement is not deletion',
    );

    const current = await service.listObjects(context, { limit: 50, offset: 0 });
    assert.equal(current.total, 0, 'retired objects are excluded from current state');
  });

  test('retiring an already-retired object is rejected', async () => {
    const { service } = harness();
    const context = stewardContext();
    const { object } = await service.createObject(context, sampleObject(), []);
    await service.retireObject(context, object.id, 1);

    await assert.rejects(
      () => service.retireObject(context, object.id, 2),
      (error: unknown) => {
        assert.ok(error instanceof ConflictError);
        assert.equal(error.code, 'already_retired');
        return true;
      },
    );
  });
});

/* ------------------------------------------------------------------- AC-07 */

describe('AC-07 — deterministic rejection of unauthorized operations', () => {
  test('a reader cannot create', async () => {
    const { service } = harness();
    await assert.rejects(
      () => service.createObject(readerContext(), sampleObject(), []),
      (error: unknown) => {
        assert.ok(error instanceof AuthorizationError);
        return true;
      },
    );
  });

  test('an author cannot retire — separation of duties', async () => {
    const { service } = harness();
    const context = authorContext();
    const { object } = await service.createObject(context, sampleObject(), []);

    await assert.rejects(
      () => service.retireObject(context, object.id, 1),
      (error: unknown) => {
        assert.ok(error instanceof AuthorizationError);
        return true;
      },
    );
  });

  test('an agent mutation requires approval rather than proceeding', async () => {
    const { service } = harness();
    await assert.rejects(
      () => service.createObject(agentContext(), sampleObject(), []),
      (error: unknown) => {
        assert.ok(error instanceof ApprovalRequiredError, `got ${String(error)}`);
        return true;
      },
    );
  });

  test('an undelegated agent is denied outright', async () => {
    const { service } = harness();
    await assert.rejects(
      () => service.createObject(agentContext({ delegated: false }), sampleObject(), []),
      (error: unknown) => {
        assert.ok(error instanceof AuthorizationError);
        return true;
      },
    );
  });

  test('a Restricted object is unreadable without the security_officer role', async () => {
    const { service } = harness();
    const admin = adminContext();
    const { object } = await service.createObject(
      admin,
      sampleObject({ classification: 'restricted' }),
      [],
    );

    await assert.rejects(
      () => service.getObject(authorContext(), object.id),
      (error: unknown) => {
        assert.ok(error instanceof AuthorizationError);
        return true;
      },
    );

    const officer = await service.getObject(securityOfficerContext(), object.id);
    assert.equal(officer.id, object.id);
  });

  test('an unknown object id is reported as not found', async () => {
    const { service } = harness();
    await assert.rejects(
      () => service.getObject(authorContext(), newObjectId()),
      (error: unknown) => {
        assert.ok(error instanceof NotFoundError);
        return true;
      },
    );
  });

  test('a failed mutation leaves no object behind', async () => {
    const { service } = harness();
    const context = authorContext();
    const { object } = await service.createObject(context, sampleObject(), []);

    await assert.rejects(() =>
      service.createRelationship(context, {
        fromId: object.id,
        toId: newObjectId(),
        type: 'DEPENDS_ON',
      }),
    );

    const page = await service.listRelationships(context, { limit: 50, offset: 0 });
    assert.equal(page.total, 0);
  });
});
