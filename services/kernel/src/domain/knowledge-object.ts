/**
 * Knowledge Object — the canonical envelope.
 *
 * Source: docs/knowledge/canonical-object-schema.md
 *
 * Invariants enforced elsewhere in the codebase:
 *   1. IDs stable and never reused        -> identifiers.ts, migrations (no DELETE path)
 *   2. Type controlled by the registry    -> vocabulary.ts + validation.ts
 *   3. Mutations are versioned            -> version field + knowledge_object_versions table
 *   4. Provenance required for external   -> validation.ts (requireProvenance)
 *   5. Relationships reference IDs        -> relationship.ts stores IDs, never embedded objects
 *   6. Secrets excluded                   -> secret-guard.ts
 *   7. Domain attributes may extend       -> `attributes` bag, opaque to the kernel
 */

import type { ObjectId, PrincipalId, TenantId } from './identifiers.ts';
import type { Classification, LifecycleState, ObjectType } from './vocabulary.ts';

export type Ownership = {
  /** Owning organization, per the canonical envelope's `ownership.organization`. */
  readonly organization: string;
  /** Accountable principal, per `ownership.owner`. */
  readonly owner: string;
};

export type KnowledgeObject = {
  readonly id: ObjectId;
  /**
   * Tenant boundary. Not part of the canonical envelope document, which describes a
   * single-tenant view; SPEC-0010 requires it on every customer-owned object. It is carried
   * as a first-class field rather than inside `attributes` so that isolation cannot be
   * bypassed by attribute manipulation.
   */
  readonly tenantId: TenantId;
  readonly type: ObjectType;
  readonly name: string;
  readonly status: LifecycleState;
  readonly ownership: Ownership;
  readonly classification: Classification;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly validFrom: string | null;
  readonly validTo: string | null;
  readonly version: number;
  readonly attributes: Readonly<Record<string, unknown>>;
  /** Principal that produced the current version. Required by SPEC-0005 attributability. */
  readonly updatedBy: PrincipalId;
  readonly createdBy: PrincipalId;
};

/**
 * An immutable historical snapshot.
 * SPEC-0005 requires "Retrieve object history"; the lifecycle document requires that schema
 * changes preserve historical readability, so snapshots are stored whole rather than as diffs.
 */
export type KnowledgeObjectVersion = {
  readonly objectId: ObjectId;
  readonly tenantId: TenantId;
  readonly version: number;
  readonly recordedAt: string;
  readonly recordedBy: PrincipalId;
  readonly changeKind: 'created' | 'updated' | 'state_changed' | 'retired';
  readonly snapshot: KnowledgeObject;
};

/** Fields a caller may supply on create. */
export type CreateObjectInput = {
  readonly type: ObjectType;
  readonly name: string;
  readonly status?: LifecycleState;
  readonly ownership: Ownership;
  readonly classification: Classification;
  readonly validFrom?: string | null;
  readonly validTo?: string | null;
  readonly attributes?: Readonly<Record<string, unknown>>;
};

/**
 * Fields a caller may supply on update.
 *
 * `id`, `tenantId`, `type`, `createdAt`, `createdBy`, and `version` are deliberately absent:
 * identity and type are immutable after creation (invariant 1), and version is owned by the
 * persistence layer.
 */
export type UpdateObjectInput = {
  readonly name?: string;
  readonly status?: LifecycleState;
  readonly ownership?: Ownership;
  readonly classification?: Classification;
  readonly validFrom?: string | null;
  readonly validTo?: string | null;
  readonly attributes?: Readonly<Record<string, unknown>>;
};

/** Query filter for listing current-state objects. */
export type ObjectQuery = {
  readonly type?: ObjectType;
  readonly status?: LifecycleState;
  readonly classification?: Classification;
  readonly owner?: string;
  readonly organization?: string;
  /** Retired objects are excluded unless this is true (lifecycle document rule). */
  readonly includeRetired?: boolean;
  /** Point-in-time filter against valid_from/valid_to. */
  readonly asOf?: string;
  readonly limit: number;
  readonly offset: number;
};

export type Page<T> = {
  readonly items: readonly T[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
};
