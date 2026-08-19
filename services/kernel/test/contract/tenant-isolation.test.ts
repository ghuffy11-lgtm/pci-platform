/**
 * WP-0001 AC-05 — a request operating in tenant A cannot retrieve or mutate tenant B objects.
 *
 * Sources: SPEC-0010, ADR-0016 (proposed).
 *
 * NOTE ON COVERAGE: these tests exercise ADR-0016 layers 1 and 2 (type-level and query-level).
 * Layer 3 (PostgreSQL row-level security) cannot be exercised without a database and is
 * therefore UNVERIFIED — see BLK-0001 and DISC-0002.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { NotFoundError, ValidationError } from '../../src/domain/errors.ts';
import { authorContext, harness, sampleObject, stewardContext, TENANT_A, TENANT_B } from '../support/fixtures.ts';

describe('AC-05 — tenant isolation', () => {
  test('an object created in tenant B is invisible to tenant A', async () => {
    const { service } = harness();
    const tenantB = authorContext(TENANT_B);
    const tenantA = authorContext(TENANT_A);

    const { object } = await service.createObject(tenantB, sampleObject({ name: 'Secret B' }), []);

    await assert.rejects(
      () => service.getObject(tenantA, object.id),
      (error: unknown) => {
        assert.ok(error instanceof NotFoundError);
        return true;
      },
    );
  });

  test('cross-tenant reads report not-found, never forbidden', async () => {
    // ADR-0016: a 403 would confirm the identifier exists and leak cross-tenant information.
    const { service } = harness();
    const { object } = await service.createObject(authorContext(TENANT_B), sampleObject(), []);

    await assert.rejects(
      () => service.getObject(authorContext(TENANT_A), object.id),
      (error: unknown) => {
        assert.ok(error instanceof NotFoundError, 'must be NotFound, not AuthorizationError');
        assert.equal(error.code, 'not_found');
        return true;
      },
    );
  });

  test('an unknown id and a cross-tenant id are indistinguishable', async () => {
    const { service } = harness();
    const { object } = await service.createObject(authorContext(TENANT_B), sampleObject(), []);
    const tenantA = authorContext(TENANT_A);

    const crossTenant = await service
      .getObject(tenantA, object.id)
      .then(() => null)
      .catch((error: unknown) => error);

    const nonExistent = await service
      .getObject(tenantA, '00000000-0000-4000-8000-000000000000' as never)
      .then(() => null)
      .catch((error: unknown) => error);

    assert.ok(crossTenant instanceof NotFoundError);
    assert.ok(nonExistent instanceof NotFoundError);
    assert.equal(
      crossTenant.code,
      nonExistent.code,
      'the two cases must be indistinguishable to the caller',
    );
  });

  test('tenant A cannot mutate a tenant B object', async () => {
    const { service } = harness();
    const { object } = await service.createObject(authorContext(TENANT_B), sampleObject(), []);

    await assert.rejects(
      () => service.updateObject(authorContext(TENANT_A), object.id, { name: 'Hijacked' }, 1),
      (error: unknown) => {
        assert.ok(error instanceof NotFoundError);
        return true;
      },
    );

    // And the object is untouched in its own tenant.
    const original = await service.getObject(authorContext(TENANT_B), object.id);
    assert.equal(original.name, 'Patient Records API');
    assert.equal(original.version, 1);
  });

  test('tenant A cannot retire a tenant B object', async () => {
    const { service } = harness();
    const { object } = await service.createObject(authorContext(TENANT_B), sampleObject(), []);

    await assert.rejects(
      () => service.retireObject(stewardContext(TENANT_A), object.id, 1),
      (error: unknown) => {
        assert.ok(error instanceof NotFoundError);
        return true;
      },
    );
  });

  test('listing is scoped to the calling tenant', async () => {
    const { service } = harness();
    await service.createObject(authorContext(TENANT_A), sampleObject({ name: 'Mine' }), []);
    await service.createObject(authorContext(TENANT_B), sampleObject({ name: 'Theirs' }), []);

    const pageA = await service.listObjects(authorContext(TENANT_A), { limit: 50, offset: 0 });
    assert.equal(pageA.total, 1);
    assert.equal(pageA.items[0]?.name, 'Mine');

    const pageB = await service.listObjects(authorContext(TENANT_B), { limit: 50, offset: 0 });
    assert.equal(pageB.total, 1);
    assert.equal(pageB.items[0]?.name, 'Theirs');
  });

  test('a relationship cannot span tenants', async () => {
    const { service } = harness();
    const { object: mine } = await service.createObject(
      authorContext(TENANT_A),
      sampleObject({ name: 'Mine' }),
      [],
    );
    const { object: theirs } = await service.createObject(
      authorContext(TENANT_B),
      sampleObject({ name: 'Theirs' }),
      [],
    );

    await assert.rejects(
      () =>
        service.createRelationship(authorContext(TENANT_A), {
          fromId: mine.id,
          toId: theirs.id,
          type: 'DEPENDS_ON',
        }),
      (error: unknown) => {
        assert.ok(error instanceof ValidationError);
        assert.equal(error.issues[0]?.field, 'toId');
        assert.equal(
          error.issues[0]?.rule,
          'unknown_reference',
          'the other tenant\'s object must read as non-existent, not as forbidden',
        );
        return true;
      },
    );
  });

  test('history is scoped to the calling tenant', async () => {
    const { service } = harness();
    const { object } = await service.createObject(authorContext(TENANT_B), sampleObject(), []);

    await assert.rejects(
      () => service.getHistory(authorContext(TENANT_A), object.id, 50, 0),
      (error: unknown) => {
        assert.ok(error instanceof NotFoundError);
        return true;
      },
    );
  });

  test('provenance is scoped to the calling tenant', async () => {
    const { service } = harness();
    const { object } = await service.createObject(authorContext(TENANT_B), sampleObject(), []);

    await assert.rejects(
      () => service.getProvenance(authorContext(TENANT_A), object.id),
      (error: unknown) => {
        assert.ok(error instanceof NotFoundError);
        return true;
      },
    );
  });

  test('relationship queries are scoped to the calling tenant', async () => {
    const { service } = harness();
    const tenantB = authorContext(TENANT_B);
    const { object: from } = await service.createObject(tenantB, sampleObject(), []);
    const { object: to } = await service.createObject(tenantB, sampleObject(), []);
    await service.createRelationship(tenantB, { fromId: from.id, toId: to.id, type: 'DEPENDS_ON' });

    const pageA = await service.listRelationships(authorContext(TENANT_A), {
      limit: 50,
      offset: 0,
    });
    assert.equal(pageA.total, 0);
  });
});
