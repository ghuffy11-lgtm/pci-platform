/**
 * Persistence port.
 *
 * Source: WP-0001 Required Architectural Properties — "Storage implementation is behind a
 *         service/repository boundary"; SPEC-0005 Design Constraint — "The API is a domain
 *         contract. Storage technology must remain replaceable behind it."
 *
 * Nothing in this file references PostgreSQL, SQL, or any driver type. Adapters implement it;
 * the application layer depends only on it.
 *
 * TENANT SAFETY (ADR-0016 layer 1)
 * --------------------------------
 * A transaction is opened *for a tenant context* and every operation inside it is implicitly
 * scoped to that tenant. There is no method that accepts an arbitrary tenant id, so there is
 * no code path that can read across tenants by omitting a filter.
 */

import type {
  CreateObjectInput,
  KnowledgeObject,
  KnowledgeObjectVersion,
  ObjectQuery,
  Page,
  UpdateObjectInput,
} from '../domain/knowledge-object.ts';
import type {
  CreateRelationshipInput,
  Relationship,
  RelationshipQuery,
} from '../domain/relationship.ts';
import type { CreateProvenanceInput, ProvenanceRecord } from '../domain/provenance.ts';
import type { AuditQuery, AuditRecord } from '../domain/audit.ts';
import type { EventEnvelope } from '../domain/event.ts';
import type { TenantContext } from '../domain/principal.ts';
import type { ObjectId, RelationshipId } from '../domain/identifiers.ts';

/**
 * A tenant-scoped unit of work.
 *
 * Every mutation that must be atomic with its audit record and event envelope happens inside
 * one of these. SPEC-0006 requires audit evidence for governed actions; writing the audit row
 * in the same transaction as the mutation is what prevents a change existing without evidence.
 */
export interface KnowledgeTransaction {
  /* ------------------------------------------------------------------- objects */

  insertObject(input: CreateObjectInput, object: KnowledgeObject): Promise<KnowledgeObject>;

  /** Returns null when the object does not exist *in this tenant*. */
  findObject(id: ObjectId): Promise<KnowledgeObject | null>;

  /**
   * Apply a patch with optimistic concurrency.
   * Returns null when the object does not exist in this tenant.
   * Throws VersionConflictError when `expectedVersion` does not match.
   */
  updateObject(
    id: ObjectId,
    patch: UpdateObjectInput,
    expectedVersion: number,
    next: KnowledgeObject,
  ): Promise<KnowledgeObject | null>;

  listObjects(query: ObjectQuery): Promise<Page<KnowledgeObject>>;

  /* ------------------------------------------------------------------ versions */

  appendVersion(version: KnowledgeObjectVersion): Promise<void>;

  listVersions(id: ObjectId, limit: number, offset: number): Promise<Page<KnowledgeObjectVersion>>;

  /* ------------------------------------------------------------- relationships */

  insertRelationship(
    input: CreateRelationshipInput,
    relationship: Relationship,
  ): Promise<Relationship>;

  findRelationship(id: RelationshipId): Promise<Relationship | null>;

  /**
   * Remove a relationship.
   * Returns false when it does not exist in this tenant.
   */
  removeRelationship(id: RelationshipId): Promise<boolean>;

  listRelationships(query: RelationshipQuery): Promise<Page<Relationship>>;

  /**
   * True when an equivalent active relationship already exists.
   * Used to reject duplicates deterministically (AC-07).
   */
  relationshipExists(
    fromId: ObjectId,
    toId: ObjectId,
    type: Relationship['type'],
  ): Promise<boolean>;

  /* ---------------------------------------------------------------- provenance */

  appendProvenance(
    input: CreateProvenanceInput,
    record: ProvenanceRecord,
  ): Promise<ProvenanceRecord>;

  listProvenance(id: ObjectId): Promise<readonly ProvenanceRecord[]>;

  /* --------------------------------------------------------------------- audit */

  /** Append-only. There is deliberately no update or delete for audit records. */
  appendAudit(record: AuditRecord): Promise<void>;

  queryAudit(query: AuditQuery): Promise<Page<AuditRecord>>;

  /* -------------------------------------------------------------------- events */

  /** Transactional outbox. Written in the same transaction as the mutation it describes. */
  appendEvent(envelope: EventEnvelope): Promise<void>;
}

export interface KnowledgeRepository {
  /**
   * Run `fn` inside a tenant-scoped transaction.
   *
   * The implementation is responsible for establishing the tenant boundary before any
   * statement executes — for PostgreSQL that means setting the `pci.tenant_id` GUC that
   * row-level-security policies read (ADR-0016 layer 3).
   *
   * Rolls back on any thrown error.
   */
  withTransaction<T>(
    context: TenantContext,
    fn: (tx: KnowledgeTransaction) => Promise<T>,
  ): Promise<T>;

  /** Liveness/readiness probe for the store. Must not leak connection details (AC-08). */
  checkHealth(): Promise<{ reachable: boolean; latencyMs: number; detail?: string }>;

  close(): Promise<void>;
}
