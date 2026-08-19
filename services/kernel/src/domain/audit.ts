/**
 * Audit and evidence records.
 *
 * Source: SPEC-0006 "Required Evidence", ADR-0011, docs/security/security-architecture.md
 *
 * SPEC-0006 requires that a reviewer be able to reconstruct a governed operation from request
 * through verification without relying on model memory or application logs alone. Every field
 * below maps to one bullet of that specification's Required Evidence list.
 *
 * Audit records are append-only and MUST NOT contain secrets (SPEC-0006, ADR-0009,
 * data-classification.md). Enforcement is in secret-guard.ts, applied on the write path.
 */

import type {
  AuditId,
  CorrelationId,
  PrincipalId,
  TenantId,
} from './identifiers.ts';
import type { ActorType } from './vocabulary.ts';

/** Outcome of the audited attempt. Failures are audited as thoroughly as successes. */
export const AUDIT_OUTCOMES = ['success', 'denied', 'approval_required', 'error'] as const;
export type AuditOutcome = (typeof AUDIT_OUTCOMES)[number];

export type AuditRecord = {
  readonly id: AuditId;
  readonly tenantId: TenantId;
  readonly occurredAt: string;

  /** SPEC-0006: actor identity, actor type. */
  readonly actorId: PrincipalId;
  readonly actorType: ActorType;
  /** ADR-0011: an agent's delegating human, where applicable. */
  readonly delegatedBy: PrincipalId | null;

  /** SPEC-0006: intent/request. */
  readonly action: string;

  /** SPEC-0006: target object(s). */
  readonly targetType: string;
  readonly targetId: string | null;

  /** SPEC-0006: policy evaluation, authorization/approval. */
  readonly policyDecision: string;
  readonly policyVersion: string;
  readonly policyReason: string;

  /** SPEC-0006: correlation identifiers. */
  readonly correlationId: CorrelationId;
  readonly causationId: string | null;

  /** SPEC-0006: result. */
  readonly outcome: AuditOutcome;
  readonly errorCode: string | null;

  /**
   * SPEC-0006: proposed and actual change.
   * A redacted, structured summary — never a raw request body, because a raw body could
   * carry credential material submitted by a caller.
   */
  readonly changeSummary: Readonly<Record<string, unknown>>;

  /** Object version produced by this action, when it produced one. */
  readonly resultingVersion: number | null;
};

export type AuditQuery = {
  readonly actorId?: PrincipalId;
  readonly targetId?: string;
  readonly action?: string;
  readonly correlationId?: CorrelationId;
  readonly outcome?: AuditOutcome;
  readonly from?: string;
  readonly to?: string;
  readonly limit: number;
  readonly offset: number;
};

/** Canonical action names. Stable strings — audit history must stay interpretable over time. */
export const AUDIT_ACTIONS = {
  objectCreate: 'knowledge_object.create',
  objectRead: 'knowledge_object.read',
  objectUpdate: 'knowledge_object.update',
  objectRetire: 'knowledge_object.retire',
  objectQuery: 'knowledge_object.query',
  objectHistory: 'knowledge_object.history',
  relationshipCreate: 'relationship.create',
  relationshipDelete: 'relationship.delete',
  relationshipQuery: 'relationship.query',
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];
