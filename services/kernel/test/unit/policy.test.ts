/**
 * Authorization rules.
 *
 * Sources: SPEC-0011, ADR-0011, ADR-0007, rbac-abac-model.md, data-classification.md,
 *          ai-security.md.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { ROLES, StaticPolicyEngine } from '../../src/adapters/policy/static-policy-engine.ts';
import type { AuthorizationRequest } from '../../src/ports/policy.ts';
import { principal } from '../support/fixtures.ts';

const engine = new StaticPolicyEngine();

function request(overrides: Partial<AuthorizationRequest> = {}): AuthorizationRequest {
  return {
    subject: principal(),
    action: 'knowledge_object.read',
    resourceType: 'knowledge_object',
    resourceId: null,
    resourceClassification: 'internal',
    resourceOwner: null,
    tenantId: 'tenant-alpha',
    environment: 'test',
    riskClass: 'low',
    ...overrides,
  };
}

describe('default deny', () => {
  test('a subject with no roles is denied', async () => {
    const decision = await engine.authorize(
      request({ subject: principal({ roles: [] }) }),
    );
    assert.equal(decision.effect, 'deny');
  });

  test('an unrecognised action is denied', async () => {
    const decision = await engine.authorize(request({ action: 'knowledge_object.obliterate' }));
    assert.equal(decision.effect, 'deny');
    assert.equal(decision.matchedRule, 'deny.unknown_action');
  });

  test('every decision names a rule and a policy version', async () => {
    const decision = await engine.authorize(request());
    assert.ok(decision.matchedRule.length > 0);
    assert.ok(decision.policyVersion.length > 0);
    assert.ok(decision.reason.length > 0);
  });
});

describe('role-based access', () => {
  test('a reader may read but not write', async () => {
    const reader = principal({ roles: [ROLES.knowledgeReader] });
    assert.equal((await engine.authorize(request({ subject: reader }))).effect, 'allow');
    assert.equal(
      (await engine.authorize(request({ subject: reader, action: 'knowledge_object.create' })))
        .effect,
      'deny',
    );
  });

  test('an author may write', async () => {
    const author = principal({ roles: [ROLES.knowledgeAuthor] });
    assert.equal(
      (await engine.authorize(request({ subject: author, action: 'knowledge_object.create' })))
        .effect,
      'allow',
    );
  });

  test('retirement requires the steward role — separation of duties', async () => {
    const author = principal({ roles: [ROLES.knowledgeAuthor] });
    assert.equal(
      (await engine.authorize(request({ subject: author, action: 'knowledge_object.retire' })))
        .effect,
      'deny',
      'an author alone must not be able to retire an object',
    );

    const steward = principal({ roles: [ROLES.knowledgeSteward] });
    assert.equal(
      (await engine.authorize(request({ subject: steward, action: 'knowledge_object.retire' })))
        .effect,
      'allow',
    );
  });

  test('audit access requires the security_officer role', async () => {
    const author = principal({ roles: [ROLES.knowledgeAuthor] });
    assert.equal(
      (await engine.authorize(
        request({ subject: author, action: 'audit.query', resourceClassification: 'confidential' }),
      )).effect,
      'deny',
    );

    const officer = principal({ roles: [ROLES.securityOfficer] });
    assert.equal(
      (await engine.authorize(
        request({ subject: officer, action: 'audit.query', resourceClassification: 'confidential' }),
      )).effect,
      'allow',
    );
  });

  test('platform_admin is allowed any recognised action', async () => {
    const admin = principal({ roles: [ROLES.platformAdmin] });
    for (const action of [
      'knowledge_object.create',
      'knowledge_object.retire',
      'relationship.delete',
      'audit.query',
    ]) {
      assert.equal(
        (await engine.authorize(request({ subject: admin, action }))).effect,
        'allow',
        `${action} should be allowed for platform_admin`,
      );
    }
  });
});

describe('data classification', () => {
  test('Restricted resources require the security_officer role', async () => {
    const author = principal({ roles: [ROLES.knowledgeAuthor, ROLES.knowledgeReader] });
    const decision = await engine.authorize(
      request({ subject: author, resourceClassification: 'restricted' }),
    );
    assert.equal(decision.effect, 'deny');
    assert.equal(decision.matchedRule, 'deny.restricted_classification');
  });

  test('a security officer may access Restricted resources', async () => {
    const officer = principal({ roles: [ROLES.securityOfficer] });
    assert.equal(
      (await engine.authorize(request({ subject: officer, resourceClassification: 'restricted' })))
        .effect,
      'allow',
    );
  });

  test('the Restricted rule outranks platform_admin ordering but admin still holds the role path', async () => {
    // platform_admin is explicitly listed as an exception in the Restricted rule, so an admin
    // is not blocked; this pins that behaviour so a future refactor cannot silently change it.
    const admin = principal({ roles: [ROLES.platformAdmin] });
    assert.equal(
      (await engine.authorize(request({ subject: admin, resourceClassification: 'restricted' })))
        .effect,
      'allow',
    );
  });
});

describe('agent authority (ADR-0011)', () => {
  test('an agent may read', async () => {
    const agent = principal({ actorType: 'agent', delegatedBy: 'user:alice' as never });
    assert.equal((await engine.authorize(request({ subject: agent }))).effect, 'allow');
  });

  test('an agent mutation requires explicit human approval', async () => {
    const agent = principal({
      actorType: 'agent',
      roles: [ROLES.knowledgeAuthor],
      delegatedBy: 'user:alice' as never,
    });
    const decision = await engine.authorize(
      request({ subject: agent, action: 'knowledge_object.create' }),
    );
    assert.equal(decision.effect, 'approval_required');
  });

  test('an agent without a delegating principal cannot mutate at all', async () => {
    const agent = principal({
      actorType: 'agent',
      roles: [ROLES.knowledgeAuthor],
      delegatedBy: null,
    });
    const decision = await engine.authorize(
      request({ subject: agent, action: 'knowledge_object.create' }),
    );
    assert.equal(decision.effect, 'deny');
    assert.equal(decision.matchedRule, 'deny.agent_without_delegation');
  });

  test('an agent may never perform a high-risk action, even with approval', async () => {
    const agent = principal({
      actorType: 'agent',
      roles: [ROLES.knowledgeSteward, ROLES.platformAdmin],
      delegatedBy: 'user:alice' as never,
    });
    const decision = await engine.authorize(
      request({ subject: agent, action: 'knowledge_object.retire' }),
    );
    assert.equal(decision.effect, 'deny');
    assert.equal(
      decision.matchedRule,
      'deny.agent_high_risk',
      'the agent deny rule must outrank platform_admin — an agent must not escalate by role',
    );
  });

  test('an agent lacking the underlying role is denied, not merely gated on approval', async () => {
    const agent = principal({
      actorType: 'agent',
      roles: [ROLES.knowledgeReader],
      delegatedBy: 'user:alice' as never,
    });
    const decision = await engine.authorize(
      request({ subject: agent, action: 'knowledge_object.create' }),
    );
    assert.equal(
      decision.effect,
      'deny',
      'approval must not substitute for a permission the agent never held',
    );
  });

  test('an identical request from a human is allowed where the agent is gated', async () => {
    // SPEC-0011: "The same request must not gain additional authority merely because it
    // originated from an AI agent." This is the converse check.
    const human = principal({ actorType: 'human', roles: [ROLES.knowledgeAuthor] });
    const agent = principal({
      actorType: 'agent',
      roles: [ROLES.knowledgeAuthor],
      delegatedBy: 'user:alice' as never,
    });

    const humanDecision = await engine.authorize(
      request({ subject: human, action: 'knowledge_object.create' }),
    );
    const agentDecision = await engine.authorize(
      request({ subject: agent, action: 'knowledge_object.create' }),
    );

    assert.equal(humanDecision.effect, 'allow');
    assert.equal(agentDecision.effect, 'approval_required');
  });
});
