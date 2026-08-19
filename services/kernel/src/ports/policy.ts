/**
 * Authorization port.
 *
 * Source: SPEC-0011, docs/security/rbac-abac-model.md, ADR-0011, ADR-0007.
 *
 * SPEC-0011 requires that policy be "enforced outside the language model" and that policy
 * changes be possible "without recompiling application logic". This port is the seam that
 * allows the static engine shipped in WP-0001 to be replaced by an external policy service
 * (OPA, Cedar, or a PCI policy service) without touching the application layer.
 */

import type { Classification } from '../domain/vocabulary.ts';
import type { Principal } from '../domain/principal.ts';

export const POLICY_EFFECTS = ['allow', 'deny', 'approval_required'] as const;
export type PolicyEffect = (typeof POLICY_EFFECTS)[number];

/** SPEC-0011 "Decision Inputs". */
export type AuthorizationRequest = {
  readonly subject: Principal;
  readonly action: string;
  readonly resourceType: string;
  readonly resourceId: string | null;
  /** Present when the resource exists and its classification is known. */
  readonly resourceClassification: Classification | null;
  /** Owning organization of the resource, for ownership-sensitive rules. */
  readonly resourceOwner: string | null;
  readonly tenantId: string;
  readonly environment: string;
  /** Risk class of the action, used for approval gating. */
  readonly riskClass: 'low' | 'medium' | 'high';
};

export type PolicyDecision = {
  readonly effect: PolicyEffect;
  /** Human-readable justification, recorded in audit (SPEC-0006 "policy evaluation"). */
  readonly reason: string;
  /**
   * Version of the policy set that produced this decision.
   * SPEC-0011: "Record the policy decision and relevant policy version for governed operations."
   */
  readonly policyVersion: string;
  /** Identifier of the specific rule that matched, for debuggability. */
  readonly matchedRule: string;
};

export interface PolicyEngine {
  /**
   * Evaluate a request. MUST deny by default: an unmatched request is a denial, never an
   * allowance (SPEC-0011, rbac-abac-model.md "Default deny").
   */
  authorize(request: AuthorizationRequest): Promise<PolicyDecision>;

  /** Current policy set version, surfaced on the readiness endpoint. */
  readonly version: string;
}
