/**
 * Authenticated principal and tenant context.
 *
 * Source: SPEC-0004, ADR-0007, docs/security/rbac-abac-model.md, ADR-0016 layer 1.
 *
 * A Principal is produced ONLY by an IdentityProvider adapter after verifying a credential.
 * TenantContext can only be constructed from a Principal, which is what makes it impossible
 * to reach persistence without a verified tenant.
 */

import type { ActorType } from './vocabulary.ts';
import type { CorrelationId, PrincipalId, TenantId } from './identifiers.ts';

export type Principal = {
  /** Stable subject identifier from the identity provider (SPEC-0004). */
  readonly id: PrincipalId;
  readonly tenantId: TenantId;
  readonly actorType: ActorType;
  readonly displayName: string;
  readonly roles: readonly string[];
  readonly scopes: readonly string[];
  /**
   * When an agent acts on behalf of a human, this is the delegating principal.
   * ADR-0007: "Agent authority must be narrower than the human authority that delegates it."
   */
  readonly delegatedBy: PrincipalId | null;
};

/**
 * Execution context threaded through every operation.
 *
 * SPEC-0010 requires background jobs to carry tenant context and audit records to retain it;
 * carrying it in one value object rather than as loose parameters is what makes that checkable.
 */
export class TenantContext {
  readonly principal: Principal;
  readonly tenantId: TenantId;
  readonly correlationId: CorrelationId;

  private constructor(principal: Principal, correlationId: CorrelationId) {
    this.principal = principal;
    this.tenantId = principal.tenantId;
    this.correlationId = correlationId;
  }

  /** The only way to build a context. Requires an already-verified principal. */
  static forPrincipal(principal: Principal, correlationId: CorrelationId): TenantContext {
    return new TenantContext(principal, correlationId);
  }

  hasRole(role: string): boolean {
    return this.principal.roles.includes(role);
  }

  hasScope(scope: string): boolean {
    return this.principal.scopes.includes(scope);
  }

  get actorType(): ActorType {
    return this.principal.actorType;
  }

  /**
   * Safe projection for logs and audit records.
   * Deliberately excludes scopes and any credential material.
   */
  describe(): Readonly<Record<string, string>> {
    return Object.freeze({
      actorId: this.principal.id,
      actorType: this.principal.actorType,
      tenantId: this.tenantId,
      correlationId: this.correlationId,
    });
  }
}
