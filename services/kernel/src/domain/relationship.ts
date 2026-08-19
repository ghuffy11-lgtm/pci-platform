/**
 * Typed relationships.
 *
 * Source: docs/knowledge/relationship-taxonomy.md, canonical-object-schema.md invariant 5
 *         ("Relationships reference object identifiers, not duplicated object records").
 *
 * A relationship stores only identifiers. Nothing in this type can hold a copy of an object,
 * which is what keeps the Reality Model from developing a second source of truth.
 */

import type { ObjectId, PrincipalId, RelationshipId, TenantId } from './identifiers.ts';
import type { RelationshipType } from './vocabulary.ts';

export type Relationship = {
  readonly id: RelationshipId;
  readonly tenantId: TenantId;
  readonly fromId: ObjectId;
  readonly toId: ObjectId;
  readonly type: RelationshipType;
  readonly createdAt: string;
  readonly createdBy: PrincipalId;
  /** Effective time — the taxonomy permits relationships to carry effective time. */
  readonly validFrom: string | null;
  readonly validTo: string | null;
  /**
   * Confidence in [0,1], or null when not assessed.
   * provenance-model.md lists confidence as a provenance element; the taxonomy also permits
   * it on the relationship itself.
   */
  readonly confidence: number | null;
  readonly attributes: Readonly<Record<string, unknown>>;
};

export type CreateRelationshipInput = {
  readonly fromId: ObjectId;
  readonly toId: ObjectId;
  readonly type: RelationshipType;
  readonly validFrom?: string | null;
  readonly validTo?: string | null;
  readonly confidence?: number | null;
  readonly attributes?: Readonly<Record<string, unknown>>;
};

export type RelationshipQuery = {
  /** Restrict to relationships where this object is the subject. */
  readonly fromId?: ObjectId;
  /** Restrict to relationships where this object is the target. */
  readonly toId?: ObjectId;
  /** Restrict to relationships touching this object in either direction. */
  readonly eitherId?: ObjectId;
  readonly type?: RelationshipType;
  readonly asOf?: string;
  readonly limit: number;
  readonly offset: number;
};

/**
 * The object neighbourhood required by SPEC-0005 ("query its neighborhood").
 * Neighbours are returned as identifiers plus their type and name — enough to navigate
 * without duplicating whole objects into the relationship payload.
 */
export type Neighbourhood = {
  readonly objectId: ObjectId;
  readonly outbound: readonly Relationship[];
  readonly inbound: readonly Relationship[];
};
