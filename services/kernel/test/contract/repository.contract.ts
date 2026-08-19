/**
 * Repository port contract suite.
 *
 * This suite is written against the `KnowledgeRepository` PORT, not against any adapter. It is
 * executed today against the in-memory adapter and will run UNCHANGED against the PostgreSQL
 * adapter once an execution host exists (see BLK-0001).
 *
 * That is the whole point: a single set of assertions defines what "a correct repository" means,
 * so the two adapters cannot drift apart silently. See DISC-0002 for the residual risk that
 * remains until the PostgreSQL side has actually been run.
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';

import { VersionConflictError } from '../../src/domain/errors.ts';
import {
  newAuditId,
  newCorrelationId,
  newEventId,
  newObjectId,
  newProvenanceId,
  newRelationshipId,
} from '../../src/domain/identifiers.ts';
import type { ObjectId, PrincipalId, TenantId } from '../../src/domain/identifiers.ts';
import { TenantContext } from '../../src/domain/principal.ts';
import type { KnowledgeObject } from '../../src/domain/knowledge-object.ts';
import type { KnowledgeRepository } from '../../src/ports/knowledge-repository.ts';
import { principal, TENANT_A, TENANT_B } from '../support/fixtures.ts';

export type RepositoryFactory = () => Promise<{
  repository: KnowledgeRepository;
  /** Remove all data between tests. */
  reset: () => Promise<void>;
  teardown: () => Promise<void>;
}>;

const NOW = '2026-08-19T00:00:00.000Z';

function contextFor(tenantId: TenantId): TenantContext {
  return TenantContext.forPrincipal(principal({ tenantId }), newCorrelationId());
}

function objectFor(tenantId: TenantId, overrides: Partial<KnowledgeObject> = {}): KnowledgeObject {
  return {
    id: newObjectId(),
    tenantId,
    type: 'Service',
    name: 'Records API',
    status: 'active',
    ownership: { organization: 'org:clinic', owner: 'user:alice' },
    classification: 'internal',
    createdAt: NOW,
    updatedAt: NOW,
    validFrom: null,
    validTo: null,
    version: 1,
    attributes: {},
    createdBy: 'user:alice' as PrincipalId,
    updatedBy: 'user:alice' as PrincipalId,
    ...overrides,
  };
}

/** Register the contract suite against a given adapter. */
export function repositoryContract(adapterName: string, factory: RepositoryFactory): void {
  describe(`KnowledgeRepository contract [${adapterName}]`, () => {
    let repository: KnowledgeRepository;
    let reset: () => Promise<void>;
    let teardown: () => Promise<void>;

    before(async () => {
      const built = await factory();
      repository = built.repository;
      reset = built.reset;
      teardown = built.teardown;
    });

    after(async () => {
      await teardown();
    });

    const fresh = async (): Promise<void> => {
      await reset();
    };

    /* ------------------------------------------------------------- objects */

    test('an inserted object can be read back', async () => {
      await fresh();
      const object = objectFor(TENANT_A);

      await repository.withTransaction(contextFor(TENANT_A), async (tx) => {
        await tx.insertObject({} as never, object);
      });

      const found = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.findObject(object.id),
      );

      assert.ok(found);
      assert.equal(found.id, object.id);
      assert.equal(found.name, 'Records API');
      assert.equal(found.version, 1);
    });

    test('a missing object reads as null', async () => {
      await fresh();
      const found = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.findObject(newObjectId()),
      );
      assert.equal(found, null);
    });

    test('an object from another tenant is invisible', async () => {
      await fresh();
      const object = objectFor(TENANT_B);

      await repository.withTransaction(contextFor(TENANT_B), async (tx) => {
        await tx.insertObject({} as never, object);
      });

      const found = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.findObject(object.id),
      );

      assert.equal(found, null, 'SPEC-0010: cross-tenant access is denied by default');
    });

    test('update enforces optimistic concurrency', async () => {
      await fresh();
      const object = objectFor(TENANT_A);
      await repository.withTransaction(contextFor(TENANT_A), async (tx) => {
        await tx.insertObject({} as never, object);
      });

      const next = { ...object, name: 'Renamed', version: 2 };

      await assert.rejects(
        () =>
          repository.withTransaction(contextFor(TENANT_A), (tx) =>
            tx.updateObject(object.id, { name: 'Renamed' }, 99, next),
          ),
        (error: unknown) => {
          assert.ok(error instanceof VersionConflictError);
          assert.equal(error.actualVersion, 1);
          return true;
        },
      );
    });

    test('update with the correct version succeeds', async () => {
      await fresh();
      const object = objectFor(TENANT_A);
      await repository.withTransaction(contextFor(TENANT_A), async (tx) => {
        await tx.insertObject({} as never, object);
      });

      const updated = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.updateObject(object.id, { name: 'Renamed' }, 1, {
          ...object,
          name: 'Renamed',
          version: 2,
        }),
      );

      assert.ok(updated);
      assert.equal(updated.name, 'Renamed');
      assert.equal(updated.version, 2);
    });

    test('updating an object in another tenant returns null', async () => {
      await fresh();
      const object = objectFor(TENANT_B);
      await repository.withTransaction(contextFor(TENANT_B), async (tx) => {
        await tx.insertObject({} as never, object);
      });

      const result = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.updateObject(object.id, { name: 'Hijacked' }, 1, { ...object, version: 2 }),
      );

      assert.equal(result, null);
    });

    test('listing excludes retired objects by default and includes them on request', async () => {
      await fresh();
      const active = objectFor(TENANT_A, { name: 'Active' });
      const retired = objectFor(TENANT_A, { name: 'Retired', status: 'retired' });

      await repository.withTransaction(contextFor(TENANT_A), async (tx) => {
        await tx.insertObject({} as never, active);
        await tx.insertObject({} as never, retired);
      });

      const current = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.listObjects({ limit: 50, offset: 0 }),
      );
      assert.equal(current.total, 1);
      assert.equal(current.items[0]?.name, 'Active');

      const all = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.listObjects({ limit: 50, offset: 0, includeRetired: true }),
      );
      assert.equal(all.total, 2);
    });

    test('listing filters by type and reports an accurate total', async () => {
      await fresh();
      await repository.withTransaction(contextFor(TENANT_A), async (tx) => {
        await tx.insertObject({} as never, objectFor(TENANT_A, { type: 'Service' }));
        await tx.insertObject({} as never, objectFor(TENANT_A, { type: 'Person' }));
        await tx.insertObject({} as never, objectFor(TENANT_A, { type: 'Person' }));
      });

      const people = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.listObjects({ type: 'Person', limit: 50, offset: 0 }),
      );
      assert.equal(people.total, 2);
    });

    test('listing never returns another tenant\'s objects', async () => {
      await fresh();
      await repository.withTransaction(contextFor(TENANT_A), async (tx) => {
        await tx.insertObject({} as never, objectFor(TENANT_A, { name: 'Mine' }));
      });
      await repository.withTransaction(contextFor(TENANT_B), async (tx) => {
        await tx.insertObject({} as never, objectFor(TENANT_B, { name: 'Theirs' }));
      });

      const page = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.listObjects({ limit: 50, offset: 0 }),
      );

      assert.equal(page.total, 1);
      assert.equal(page.items[0]?.name, 'Mine');
    });

    test('pagination is stable and total reflects the unpaged count', async () => {
      await fresh();
      await repository.withTransaction(contextFor(TENANT_A), async (tx) => {
        for (let index = 0; index < 5; index += 1) {
          await tx.insertObject({} as never, objectFor(TENANT_A, { name: `Object ${index}` }));
        }
      });

      const first = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.listObjects({ limit: 2, offset: 0 }),
      );
      const second = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.listObjects({ limit: 2, offset: 2 }),
      );

      assert.equal(first.total, 5);
      assert.equal(first.items.length, 2);
      assert.equal(second.items.length, 2);

      const firstIds = first.items.map((item) => item.id);
      const secondIds = second.items.map((item) => item.id);
      assert.equal(
        firstIds.some((id) => secondIds.includes(id)),
        false,
        'pages must not overlap',
      );
    });

    /* ------------------------------------------------------------ versions */

    test('versions are appended and returned newest first', async () => {
      await fresh();
      const object = objectFor(TENANT_A);
      await repository.withTransaction(contextFor(TENANT_A), async (tx) => {
        await tx.insertObject({} as never, object);
        await tx.appendVersion({
          objectId: object.id,
          tenantId: TENANT_A,
          version: 1,
          recordedAt: NOW,
          recordedBy: 'user:alice' as PrincipalId,
          changeKind: 'created',
          snapshot: object,
        });
        await tx.appendVersion({
          objectId: object.id,
          tenantId: TENANT_A,
          version: 2,
          recordedAt: '2026-08-19T01:00:00.000Z',
          recordedBy: 'user:alice' as PrincipalId,
          changeKind: 'updated',
          snapshot: { ...object, version: 2 },
        });
      });

      const history = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.listVersions(object.id, 50, 0),
      );

      assert.equal(history.total, 2);
      assert.equal(history.items[0]?.version, 2, 'newest first');
      assert.equal(history.items[1]?.version, 1);
    });

    /* ------------------------------------------------------- relationships */

    test('a relationship can be created, found, and removed', async () => {
      await fresh();
      const from = objectFor(TENANT_A);
      const to = objectFor(TENANT_A);
      const relationshipId = newRelationshipId();

      await repository.withTransaction(contextFor(TENANT_A), async (tx) => {
        await tx.insertObject({} as never, from);
        await tx.insertObject({} as never, to);
        await tx.insertRelationship({} as never, {
          id: relationshipId,
          tenantId: TENANT_A,
          fromId: from.id,
          toId: to.id,
          type: 'DEPENDS_ON',
          createdAt: NOW,
          createdBy: 'user:alice' as PrincipalId,
          validFrom: null,
          validTo: null,
          confidence: null,
          attributes: {},
        });
      });

      const found = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.findRelationship(relationshipId),
      );
      assert.ok(found);
      assert.equal(found.type, 'DEPENDS_ON');

      const removed = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.removeRelationship(relationshipId),
      );
      assert.equal(removed, true);

      const afterRemoval = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.findRelationship(relationshipId),
      );
      assert.equal(afterRemoval, null);
    });

    test('relationshipExists detects a duplicate edge', async () => {
      await fresh();
      const from = objectFor(TENANT_A);
      const to = objectFor(TENANT_A);

      await repository.withTransaction(contextFor(TENANT_A), async (tx) => {
        await tx.insertObject({} as never, from);
        await tx.insertObject({} as never, to);

        assert.equal(await tx.relationshipExists(from.id, to.id, 'DEPENDS_ON'), false);

        await tx.insertRelationship({} as never, {
          id: newRelationshipId(),
          tenantId: TENANT_A,
          fromId: from.id,
          toId: to.id,
          type: 'DEPENDS_ON',
          createdAt: NOW,
          createdBy: 'user:alice' as PrincipalId,
          validFrom: null,
          validTo: null,
          confidence: null,
          attributes: {},
        });

        assert.equal(await tx.relationshipExists(from.id, to.id, 'DEPENDS_ON'), true);
        assert.equal(
          await tx.relationshipExists(from.id, to.id, 'HOSTS'),
          false,
          'a different type is a different edge',
        );
        assert.equal(
          await tx.relationshipExists(to.id, from.id, 'DEPENDS_ON'),
          false,
          'direction is significant',
        );
      });
    });

    test('relationships can be queried by direction', async () => {
      await fresh();
      const a = objectFor(TENANT_A);
      const b = objectFor(TENANT_A);
      const c = objectFor(TENANT_A);

      await repository.withTransaction(contextFor(TENANT_A), async (tx) => {
        for (const object of [a, b, c]) await tx.insertObject({} as never, object);

        const edge = (fromId: ObjectId, toId: ObjectId) => ({
          id: newRelationshipId(),
          tenantId: TENANT_A,
          fromId,
          toId,
          type: 'DEPENDS_ON' as const,
          createdAt: NOW,
          createdBy: 'user:alice' as PrincipalId,
          validFrom: null,
          validTo: null,
          confidence: null,
          attributes: {},
        });

        await tx.insertRelationship({} as never, edge(a.id, b.id));
        await tx.insertRelationship({} as never, edge(c.id, b.id));
      });

      const outbound = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.listRelationships({ fromId: a.id, limit: 50, offset: 0 }),
      );
      assert.equal(outbound.total, 1);

      const inbound = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.listRelationships({ toId: b.id, limit: 50, offset: 0 }),
      );
      assert.equal(inbound.total, 2);

      const either = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.listRelationships({ eitherId: b.id, limit: 50, offset: 0 }),
      );
      assert.equal(either.total, 2);
    });

    /* ---------------------------------------------------------- provenance */

    test('provenance is appended and retrievable in ingestion order', async () => {
      await fresh();
      const object = objectFor(TENANT_A);

      await repository.withTransaction(contextFor(TENANT_A), async (tx) => {
        await tx.insertObject({} as never, object);
        await tx.appendProvenance({} as never, {
          id: newProvenanceId(),
          tenantId: TENANT_A,
          objectId: object.id,
          objectVersion: 1,
          sourceId: 'cmdb:1',
          sourceType: 'connector_observation',
          sourceLocation: null,
          observedAt: null,
          ingestedAt: NOW,
          transformation: null,
          actorId: 'user:alice' as PrincipalId,
          connector: 'cmdb',
          confidence: 0.9,
          validationState: 'unvalidated',
          evidenceRef: null,
        });
      });

      const records = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.listProvenance(object.id),
      );

      assert.equal(records.length, 1);
      assert.equal(records[0]?.sourceType, 'connector_observation');
      assert.equal(records[0]?.confidence, 0.9, 'numeric precision must survive the round trip');
    });

    /* --------------------------------------------------------------- audit */

    test('audit records are appended and queryable by correlation id', async () => {
      await fresh();
      const correlationId = newCorrelationId();

      await repository.withTransaction(contextFor(TENANT_A), async (tx) => {
        await tx.appendAudit({
          id: newAuditId(),
          tenantId: TENANT_A,
          occurredAt: NOW,
          actorId: 'user:alice' as PrincipalId,
          actorType: 'human',
          delegatedBy: null,
          action: 'knowledge_object.create',
          targetType: 'knowledge_object',
          targetId: null,
          policyDecision: 'allow',
          policyVersion: 'test/1',
          policyReason: 'test',
          correlationId,
          causationId: null,
          outcome: 'success',
          errorCode: null,
          changeSummary: { type: 'Service' },
          resultingVersion: 1,
        });
      });

      const page = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.queryAudit({ correlationId, limit: 50, offset: 0 }),
      );

      assert.equal(page.total, 1);
      assert.equal(page.items[0]?.action, 'knowledge_object.create');
    });

    test('audit records are not visible across tenants', async () => {
      await fresh();
      const correlationId = newCorrelationId();

      await repository.withTransaction(contextFor(TENANT_B), async (tx) => {
        await tx.appendAudit({
          id: newAuditId(),
          tenantId: TENANT_B,
          occurredAt: NOW,
          actorId: 'user:bob' as PrincipalId,
          actorType: 'human',
          delegatedBy: null,
          action: 'knowledge_object.create',
          targetType: 'knowledge_object',
          targetId: null,
          policyDecision: 'allow',
          policyVersion: 'test/1',
          policyReason: 'test',
          correlationId,
          causationId: null,
          outcome: 'success',
          errorCode: null,
          changeSummary: {},
          resultingVersion: 1,
        });
      });

      const page = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.queryAudit({ limit: 50, offset: 0 }),
      );
      assert.equal(page.total, 0, 'SPEC-0010: audit records retain and respect tenant context');
    });

    /* -------------------------------------------------------------- events */

    test('events are appended within the transaction', async () => {
      await fresh();
      const correlationId = newCorrelationId();

      await repository.withTransaction(contextFor(TENANT_A), async (tx) => {
        await tx.appendEvent({
          id: newEventId(),
          type: 'pci.knowledge.object.created',
          occurredAt: NOW,
          producer: 'pci.kernel',
          producedBy: 'user:alice' as PrincipalId,
          tenantId: TENANT_A,
          subjectType: 'knowledge_object',
          subjectId: newObjectId(),
          relatedIds: [],
          correlationId,
          causationId: null,
          payloadVersion: 1,
          payload: { type: 'Service' },
        });
      });
      // No read path for events is exposed on the port in WP-0001 (no dispatcher is in scope);
      // the assertion is that the write path completes inside the transaction.
    });

    /* -------------------------------------------------------- transactions */

    test('a failed transaction leaves no partial writes', async () => {
      await fresh();
      const object = objectFor(TENANT_A);

      await assert.rejects(() =>
        repository.withTransaction(contextFor(TENANT_A), async (tx) => {
          await tx.insertObject({} as never, object);
          throw new Error('deliberate failure after the insert');
        }),
      );

      const found = await repository.withTransaction(contextFor(TENANT_A), (tx) =>
        tx.findObject(object.id),
      );

      assert.equal(found, null, 'the insert must have been rolled back');
    });

    /* -------------------------------------------------------------- health */

    test('health check reports reachability without leaking connection detail', async () => {
      const health = await repository.checkHealth();
      assert.equal(typeof health.reachable, 'boolean');
      assert.equal(typeof health.latencyMs, 'number');
      if (health.detail !== undefined) {
        assert.equal(
          /password|postgres:\/\/|@/.test(health.detail),
          false,
          'AC-08: health output must not contain connection details',
        );
      }
    });
  });
}
