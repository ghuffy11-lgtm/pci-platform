/**
 * Shared test fixtures.
 *
 * Principals here use SYNTHETIC identifiers and tokens only, per
 * docs/security/security-architecture.md:39 ("Development fixtures must use synthetic
 * credentials"). Nothing in this file is a real credential.
 */

import { newCorrelationId } from '../../src/domain/identifiers.ts';
import type { PrincipalId, TenantId } from '../../src/domain/identifiers.ts';
import { TenantContext } from '../../src/domain/principal.ts';
import type { Principal } from '../../src/domain/principal.ts';
import type { ActorType } from '../../src/domain/vocabulary.ts';
import { KnowledgeService } from '../../src/application/knowledge-service.ts';
import { MemoryKnowledgeRepository } from '../../src/adapters/memory/memory-repository.ts';
import { StaticPolicyEngine, ROLES } from '../../src/adapters/policy/static-policy-engine.ts';
import { FixedClock } from '../../src/ports/clock.ts';
import { NullLogger } from '../../src/observability/logger.ts';
import type { CreateObjectInput } from '../../src/domain/knowledge-object.ts';

export const TENANT_A = 'tenant-alpha' as TenantId;
export const TENANT_B = 'tenant-beta' as TenantId;

export function principal(overrides: Partial<Principal> = {}): Principal {
  return {
    id: 'user:alice' as PrincipalId,
    tenantId: TENANT_A,
    actorType: 'human' as ActorType,
    displayName: 'Alice Example',
    roles: [ROLES.knowledgeAuthor, ROLES.knowledgeReader],
    scopes: [],
    delegatedBy: null,
    ...overrides,
  };
}

export function contextFor(overrides: Partial<Principal> = {}): TenantContext {
  return TenantContext.forPrincipal(principal(overrides), newCorrelationId());
}

/** A principal holding every kernel role. */
export function adminContext(tenantId: TenantId = TENANT_A): TenantContext {
  return contextFor({
    id: 'user:admin' as PrincipalId,
    tenantId,
    roles: [ROLES.platformAdmin],
  });
}

export function authorContext(tenantId: TenantId = TENANT_A): TenantContext {
  return contextFor({
    id: 'user:author' as PrincipalId,
    tenantId,
    roles: [ROLES.knowledgeAuthor, ROLES.knowledgeReader],
  });
}

export function readerContext(tenantId: TenantId = TENANT_A): TenantContext {
  return contextFor({
    id: 'user:reader' as PrincipalId,
    tenantId,
    roles: [ROLES.knowledgeReader],
  });
}

export function stewardContext(tenantId: TenantId = TENANT_A): TenantContext {
  return contextFor({
    id: 'user:steward' as PrincipalId,
    tenantId,
    roles: [ROLES.knowledgeSteward, ROLES.knowledgeAuthor, ROLES.knowledgeReader],
  });
}

export function securityOfficerContext(tenantId: TenantId = TENANT_A): TenantContext {
  return contextFor({
    id: 'user:sec' as PrincipalId,
    tenantId,
    roles: [ROLES.securityOfficer],
  });
}

export function agentContext(
  options: { delegated?: boolean; tenantId?: TenantId; roles?: string[] } = {},
): TenantContext {
  return contextFor({
    id: 'agent:assistant' as PrincipalId,
    tenantId: options.tenantId ?? TENANT_A,
    actorType: 'agent',
    roles: options.roles ?? [ROLES.knowledgeAuthor, ROLES.knowledgeReader],
    delegatedBy: options.delegated === false ? null : ('user:alice' as PrincipalId),
  });
}

export type Harness = {
  service: KnowledgeService;
  repository: MemoryKnowledgeRepository;
  clock: FixedClock;
};

export function harness(): Harness {
  const repository = new MemoryKnowledgeRepository();
  const clock = new FixedClock();
  const service = new KnowledgeService({
    repository,
    policy: new StaticPolicyEngine(),
    clock,
    logger: new NullLogger(),
    environment: 'test',
  });
  return { service, repository, clock };
}

export function sampleObject(overrides: Partial<CreateObjectInput> = {}): CreateObjectInput {
  return {
    type: 'Service',
    name: 'Patient Records API',
    status: 'active',
    ownership: { organization: 'org:clinic', owner: 'user:alice' },
    classification: 'internal',
    validFrom: null,
    validTo: null,
    attributes: { environment: 'production', tier: 1 },
    ...overrides,
  };
}
