/**
 * Provenance records.
 *
 * Source: docs/knowledge/provenance-model.md
 *         docs/architecture/technology-standards.md (reuse W3C PROV concepts:
 *         source, activity, agent, derivation)
 *
 * Provenance is append-only. A record is never updated in place — a superseding record is
 * appended and the prior record's validation state becomes 'superseded'. This is what makes
 * "where did this fact come from" answerable retrospectively.
 */

import type { ObjectId, PrincipalId, ProvenanceId, TenantId } from './identifiers.ts';
import type { SourceType, ValidationState } from './vocabulary.ts';

export type ProvenanceRecord = {
  readonly id: ProvenanceId;
  readonly tenantId: TenantId;
  /** The object this provenance explains. */
  readonly objectId: ObjectId;
  /** The object version this provenance was attached to. */
  readonly objectVersion: number;

  /** PROV: Entity — where the fact came from. */
  readonly sourceId: string;
  readonly sourceType: SourceType;
  /** Reference to the source location (URI, file path, ticket ID, device name). */
  readonly sourceLocation: string | null;

  /** PROV: Activity — when it was seen and when it entered PCI. */
  readonly observedAt: string | null;
  readonly ingestedAt: string;
  /** Normalization/transformation step applied, if any. */
  readonly transformation: string | null;

  /** PROV: Agent — who or what asserted it. */
  readonly actorId: PrincipalId;
  readonly connector: string | null;

  /** Confidence in [0,1], or null when not assessed. */
  readonly confidence: number | null;
  readonly validationState: ValidationState;
  /** Free-form reference to supporting evidence (audit ID, document ID, run ID). */
  readonly evidenceRef: string | null;
};

export type CreateProvenanceInput = {
  readonly sourceId: string;
  readonly sourceType: SourceType;
  readonly sourceLocation?: string | null;
  readonly observedAt?: string | null;
  readonly transformation?: string | null;
  readonly connector?: string | null;
  readonly confidence?: number | null;
  readonly validationState?: ValidationState;
  readonly evidenceRef?: string | null;
};

/**
 * Provenance asserted by an AI agent is never authoritative merely because a model produced it.
 *
 * provenance-model.md: "AI-generated statements are never authoritative solely because a model
 * produced them. They must identify their source context and validation state."
 *
 * The kernel enforces this by forcing agent-proposed provenance to 'unvalidated' regardless of
 * what the caller requested. A model cannot self-certify.
 */
export function normaliseValidationState(
  sourceType: SourceType,
  requested: ValidationState | undefined,
): ValidationState {
  if (sourceType === 'agent_proposal') return 'unvalidated';
  return requested ?? 'unvalidated';
}
