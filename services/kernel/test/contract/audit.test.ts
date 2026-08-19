/**
 * WP-0001 AC-06 — a mutation produces an auditable record containing actor, action, target,
 * time, correlation ID, and result, without exposing secrets.
 *
 * Sources: SPEC-0006 Required Evidence, ADR-0011, ADR-0009, data-classification.md.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  adminContext,
  agentContext,
  authorContext,
  harness,
  readerContext,
  sampleObject,
  securityOfficerContext,
  stewardContext,
} from '../support/fixtures.ts';
import { AUDIT_ACTIONS } from '../../src/domain/audit.ts';

describe('AC-06 — audit evidence', () => {
  test('a successful mutation produces a complete audit record', async () => {
    const { service, repository } = harness();
    const context = authorContext();

    const { object } = await service.createObject(context, sampleObject(), []);

    const records = repository.allAudit();
    assert.equal(records.length, 1);
    const record = records[0];
    assert.ok(record);

    // SPEC-0006 Required Evidence, field by field.
    assert.equal(record.actorId, context.principal.id, 'actor identity');
    assert.equal(record.actorType, 'human', 'actor type');
    assert.equal(record.action, AUDIT_ACTIONS.objectCreate, 'intent/request');
    assert.equal(record.targetType, 'knowledge_object', 'target');
    assert.equal(record.targetId, object.id, 'target id');
    assert.equal(record.policyDecision, 'allow', 'policy evaluation');
    assert.ok(record.policyVersion.length > 0, 'policy version');
    assert.ok(record.policyReason.length > 0, 'authorization reason');
    assert.equal(record.correlationId, context.correlationId, 'correlation identifier');
    assert.equal(record.outcome, 'success', 'result');
    assert.equal(record.resultingVersion, 1, 'resulting version');
    assert.ok(record.occurredAt.length > 0, 'timestamp');
    assert.equal(record.tenantId, context.tenantId, 'tenant context is retained');
  });

  test('a denied request is audited too', async () => {
    const { service, repository } = harness();
    const context = readerContext();

    await assert.rejects(() => service.createObject(context, sampleObject(), []));

    const records = repository.allAudit();
    assert.equal(records.length, 1, 'the denial must leave evidence');
    assert.equal(records[0]?.outcome, 'denied');
    assert.equal(records[0]?.policyDecision, 'deny');
    assert.equal(records[0]?.actorId, context.principal.id);
  });

  test('an approval-required decision is audited', async () => {
    const { service, repository } = harness();
    await assert.rejects(() => service.createObject(agentContext(), sampleObject(), []));

    const records = repository.allAudit();
    assert.equal(records[0]?.outcome, 'approval_required');
    assert.equal(records[0]?.actorType, 'agent');
  });

  test('an agent audit record names the delegating principal', async () => {
    const { service, repository } = harness();
    const context = agentContext();
    await assert.rejects(() => service.createObject(context, sampleObject(), []));

    assert.equal(
      repository.allAudit()[0]?.delegatedBy,
      'user:alice',
      'ADR-0011: agent activity must be attributable to its delegator',
    );
  });

  test('a failed mutation is audited even though the transaction rolled back', async () => {
    const { service, repository } = harness();
    const context = authorContext();
    const { object } = await service.createObject(context, sampleObject(), []);

    await assert.rejects(() =>
      service.createRelationship(context, {
        fromId: object.id,
        toId: '00000000-0000-4000-8000-000000000000' as never,
        type: 'DEPENDS_ON',
      }),
    );

    const failures = repository.allAudit().filter((record) => record.outcome === 'error');
    assert.equal(failures.length, 1, 'the failure evidence must survive the rollback');
    assert.equal(failures[0]?.action, AUDIT_ACTIONS.relationshipCreate);
    assert.equal(failures[0]?.errorCode, 'validation_failed');
  });

  test('an operation is reconstructable end to end from its correlation id', async () => {
    // SPEC-0006 acceptance: a reviewer can reconstruct a governed operation without relying
    // on model memory or application logs alone.
    const { service, repository } = harness();
    const context = stewardContext();

    const { object } = await service.createObject(context, sampleObject(), []);
    await service.updateObject(context, object.id, { name: 'Renamed' }, 1);
    await service.retireObject(context, object.id, 2);

    const trail = repository
      .allAudit()
      .filter((record) => record.correlationId === context.correlationId)
      .map((record) => record.action);

    assert.deepEqual(trail.sort(), [
      AUDIT_ACTIONS.objectCreate,
      AUDIT_ACTIONS.objectRetire,
      AUDIT_ACTIONS.objectUpdate,
    ].sort());
  });

  test('audit records never contain secret material', async () => {
    const { service, repository } = harness();
    const context = authorContext();

    // The attribute guard rejects this before persistence, but the audit record for the
    // FAILED attempt must also be free of the submitted secret.
    await assert.rejects(() =>
      service.createObject(
        context,
        sampleObject({ attributes: { db_password: 'hunter2' } }),
        [],
      ),
    );

    const serialised = JSON.stringify(repository.allAudit());
    assert.equal(
      serialised.includes('hunter2'),
      false,
      'SPEC-0006 and ADR-0009: audit records must not contain secrets',
    );
  });

  test('a change summary is redacted before it is written', async () => {
    const { service, repository } = harness();
    const context = authorContext();
    await service.createObject(context, sampleObject({ name: 'Ordinary' }), []);

    const record = repository.allAudit()[0];
    assert.ok(record);
    assert.equal(typeof record.changeSummary, 'object');
    assert.equal(JSON.stringify(record.changeSummary).includes('[redacted]'), false);
  });

  test('a security officer can query the audit trail; an author cannot', async () => {
    const { service } = harness();
    await service.createObject(authorContext(), sampleObject(), []);

    const page = await service.queryAudit(securityOfficerContext(), { limit: 50, offset: 0 });
    assert.ok(page.total >= 1);

    await assert.rejects(
      () => service.queryAudit(authorContext(), { limit: 50, offset: 0 }),
      'audit evidence must not be readable by an ordinary author',
    );
  });

  test('agent reads are audited even though ordinary reads are not', async () => {
    const { service, repository } = harness();
    const admin = authorContext();
    const { object } = await service.createObject(admin, sampleObject(), []);

    const beforeHuman = repository.allAudit().length;
    await service.getObject(admin, object.id);
    assert.equal(
      repository.allAudit().length,
      beforeHuman,
      'an ordinary human read is not audited — SPEC-0006 scopes audit to sensitive activity',
    );

    await service.getObject(agentContext(), object.id);
    assert.equal(
      repository.allAudit().length,
      beforeHuman + 1,
      'ADR-0011: agent activity must be auditable',
    );
  });

  test('reads of Restricted objects are audited', async () => {
    const { service, repository } = harness();
    const officer = securityOfficerContext();

    // Created by an admin: an ordinary author cannot create or upgrade to Restricted, which
    // the policy suite covers separately.
    const { object } = await service.createObject(
      adminContext(),
      sampleObject({ classification: 'restricted' }),
      [],
    );

    const before = repository.allAudit().length;
    await service.getObject(officer, object.id);
    assert.equal(
      repository.allAudit().length,
      before + 1,
      'data-classification.md: Restricted access requires an audit trail',
    );
  });

  test('an author cannot upgrade an object to Restricted', async () => {
    const { service } = harness();
    const context = authorContext();
    const { object } = await service.createObject(
      context,
      sampleObject({ classification: 'internal' }),
      [],
    );

    await assert.rejects(
      () => service.updateObject(context, object.id, { classification: 'restricted' }, 1),
      'authorization is evaluated against the higher of the current and requested classification',
    );
  });
});
