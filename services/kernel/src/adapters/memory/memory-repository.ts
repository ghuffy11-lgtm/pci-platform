/**
 * In-memory repository adapter.
 *
 * PURPOSE AND LIMITS
 * ------------------
 * This is a TEST DOUBLE. It exists so the kernel's domain, authorization, audit, and API
 * contract can be verified without a database. It is NOT a supported production store, and
 * config.ts refuses to start with `PCI_STORE_MODE=memory` when `PCI_ENV=production`.
 *
 * Because it is a second implementation of the same semantics, it can pass tests that the
 * PostgreSQL adapter would fail. That risk is recorded in
 * implementation/discoveries/DISC-0002-adapter-test-fidelity.md and is the reason the contract
 * suite is written against the port rather than against this class.
 *
 * Values are structurally cloned on the way in and on the way out. Without that, a test could
 * mutate a stored object through a returned reference and appear to pass — an aliasing bug
 * that PostgreSQL would never exhibit.
 */

import { VersionConflictError } from '../../domain/errors.ts';
import type {
  CreateObjectInput,
  KnowledgeObject,
  KnowledgeObjectVersion,
  ObjectQuery,
  Page,
  UpdateObjectInput,
} from '../../domain/knowledge-object.ts';
import type {
  CreateRelationshipInput,
  Relationship,
  RelationshipQuery,
} from '../../domain/relationship.ts';
import type { CreateProvenanceInput, ProvenanceRecord } from '../../domain/provenance.ts';
import type { AuditQuery, AuditRecord } from '../../domain/audit.ts';
import type { EventEnvelope } from '../../domain/event.ts';
import type { TenantContext } from '../../domain/principal.ts';
import type { ObjectId, RelationshipId, TenantId } from '../../domain/identifiers.ts';
import type {
  KnowledgeRepository,
  KnowledgeTransaction,
} from '../../ports/knowledge-repository.ts';

type Store = {
  objects: Map<string, KnowledgeObject>;
  versions: KnowledgeObjectVersion[];
  relationships: Map<string, Relationship>;
  provenance: ProvenanceRecord[];
  audit: AuditRecord[];
  events: EventEnvelope[];
};

function emptyStore(): Store {
  return {
    objects: new Map(),
    versions: [],
    relationships: new Map(),
    provenance: [],
    audit: [],
    events: [],
  };
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function paginate<T>(items: readonly T[], limit: number, offset: number): Page<T> {
  return {
    items: items.slice(offset, offset + limit).map(clone),
    total: items.length,
    limit,
    offset,
  };
}

/** True when `asOf` falls inside [validFrom, validTo). Open-ended bounds always match. */
function withinValidity(
  validFrom: string | null,
  validTo: string | null,
  asOf: string | undefined,
): boolean {
  if (asOf === undefined) return true;
  const at = Date.parse(asOf);
  if (validFrom !== null && Date.parse(validFrom) > at) return false;
  if (validTo !== null && Date.parse(validTo) <= at) return false;
  return true;
}

class MemoryTransaction implements KnowledgeTransaction {
  private readonly store: Store;
  private readonly tenantId: TenantId;

  constructor(store: Store, tenantId: TenantId) {
    this.store = store;
    this.tenantId = tenantId;
  }

  /* ------------------------------------------------------------------- objects */

  async insertObject(
    _input: CreateObjectInput,
    object: KnowledgeObject,
  ): Promise<KnowledgeObject> {
    this.store.objects.set(object.id, clone(object));
    return clone(object);
  }

  async findObject(id: ObjectId): Promise<KnowledgeObject | null> {
    const found = this.store.objects.get(id);
    // Tenant scoping. A hit on another tenant is treated as a miss (ADR-0016).
    if (found === undefined || found.tenantId !== this.tenantId) return null;
    return clone(found);
  }

  async updateObject(
    id: ObjectId,
    _patch: UpdateObjectInput,
    expectedVersion: number,
    next: KnowledgeObject,
  ): Promise<KnowledgeObject | null> {
    const current = this.store.objects.get(id);
    if (current === undefined || current.tenantId !== this.tenantId) return null;
    if (current.version !== expectedVersion) {
      throw new VersionConflictError(expectedVersion, current.version);
    }
    this.store.objects.set(id, clone(next));
    return clone(next);
  }

  async listObjects(query: ObjectQuery): Promise<Page<KnowledgeObject>> {
    const matches = [...this.store.objects.values()]
      .filter((object) => object.tenantId === this.tenantId)
      .filter((object) => (query.type === undefined ? true : object.type === query.type))
      .filter((object) => (query.status === undefined ? true : object.status === query.status))
      .filter((object) =>
        query.classification === undefined
          ? true
          : object.classification === query.classification,
      )
      .filter((object) =>
        query.owner === undefined ? true : object.ownership.owner === query.owner,
      )
      .filter((object) =>
        query.organization === undefined
          ? true
          : object.ownership.organization === query.organization,
      )
      // Lifecycle rule: retired objects are excluded from current state unless requested.
      .filter((object) => (query.includeRetired === true ? true : object.status !== 'retired'))
      .filter((object) => withinValidity(object.validFrom, object.validTo, query.asOf))
      .sort((a, b) => (a.createdAt === b.createdAt ? a.id.localeCompare(b.id) : a.createdAt.localeCompare(b.createdAt)));

    return paginate(matches, query.limit, query.offset);
  }

  /* ------------------------------------------------------------------ versions */

  async appendVersion(version: KnowledgeObjectVersion): Promise<void> {
    this.store.versions.push(clone(version));
  }

  async listVersions(
    id: ObjectId,
    limit: number,
    offset: number,
  ): Promise<Page<KnowledgeObjectVersion>> {
    const matches = this.store.versions
      .filter((version) => version.objectId === id && version.tenantId === this.tenantId)
      .sort((a, b) => b.version - a.version);
    return paginate(matches, limit, offset);
  }

  /* ------------------------------------------------------------- relationships */

  async insertRelationship(
    _input: CreateRelationshipInput,
    relationship: Relationship,
  ): Promise<Relationship> {
    this.store.relationships.set(relationship.id, clone(relationship));
    return clone(relationship);
  }

  async findRelationship(id: RelationshipId): Promise<Relationship | null> {
    const found = this.store.relationships.get(id);
    if (found === undefined || found.tenantId !== this.tenantId) return null;
    return clone(found);
  }

  async removeRelationship(id: RelationshipId): Promise<boolean> {
    const found = this.store.relationships.get(id);
    if (found === undefined || found.tenantId !== this.tenantId) return false;
    return this.store.relationships.delete(id);
  }

  async listRelationships(query: RelationshipQuery): Promise<Page<Relationship>> {
    const matches = [...this.store.relationships.values()]
      .filter((relationship) => relationship.tenantId === this.tenantId)
      .filter((relationship) =>
        query.fromId === undefined ? true : relationship.fromId === query.fromId,
      )
      .filter((relationship) => (query.toId === undefined ? true : relationship.toId === query.toId))
      .filter((relationship) =>
        query.eitherId === undefined
          ? true
          : relationship.fromId === query.eitherId || relationship.toId === query.eitherId,
      )
      .filter((relationship) => (query.type === undefined ? true : relationship.type === query.type))
      .filter((relationship) =>
        withinValidity(relationship.validFrom, relationship.validTo, query.asOf),
      )
      .sort((a, b) => (a.createdAt === b.createdAt ? a.id.localeCompare(b.id) : a.createdAt.localeCompare(b.createdAt)));

    return paginate(matches, query.limit, query.offset);
  }

  async relationshipExists(
    fromId: ObjectId,
    toId: ObjectId,
    type: Relationship['type'],
  ): Promise<boolean> {
    for (const relationship of this.store.relationships.values()) {
      if (
        relationship.tenantId === this.tenantId &&
        relationship.fromId === fromId &&
        relationship.toId === toId &&
        relationship.type === type
      ) {
        return true;
      }
    }
    return false;
  }

  /* ---------------------------------------------------------------- provenance */

  async appendProvenance(
    _input: CreateProvenanceInput,
    record: ProvenanceRecord,
  ): Promise<ProvenanceRecord> {
    this.store.provenance.push(clone(record));
    return clone(record);
  }

  async listProvenance(id: ObjectId): Promise<readonly ProvenanceRecord[]> {
    return this.store.provenance
      .filter((record) => record.objectId === id && record.tenantId === this.tenantId)
      .sort((a, b) => a.ingestedAt.localeCompare(b.ingestedAt))
      .map(clone);
  }

  /* --------------------------------------------------------------------- audit */

  async appendAudit(record: AuditRecord): Promise<void> {
    this.store.audit.push(clone(record));
  }

  async queryAudit(query: AuditQuery): Promise<Page<AuditRecord>> {
    const matches = this.store.audit
      .filter((record) => record.tenantId === this.tenantId)
      .filter((record) => (query.actorId === undefined ? true : record.actorId === query.actorId))
      .filter((record) => (query.targetId === undefined ? true : record.targetId === query.targetId))
      .filter((record) => (query.action === undefined ? true : record.action === query.action))
      .filter((record) =>
        query.correlationId === undefined ? true : record.correlationId === query.correlationId,
      )
      .filter((record) => (query.outcome === undefined ? true : record.outcome === query.outcome))
      .filter((record) => (query.from === undefined ? true : record.occurredAt >= query.from))
      .filter((record) => (query.to === undefined ? true : record.occurredAt <= query.to))
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));

    return paginate(matches, query.limit, query.offset);
  }

  /* -------------------------------------------------------------------- events */

  async appendEvent(envelope: EventEnvelope): Promise<void> {
    this.store.events.push(clone(envelope));
  }
}

export class MemoryKnowledgeRepository implements KnowledgeRepository {
  private readonly store: Store = emptyStore();

  /**
   * Transactions are simulated by snapshotting and restoring on failure.
   *
   * This is genuine rollback for the operations the kernel performs, but it does NOT model
   * concurrent transaction isolation. Concurrency behaviour is only meaningfully verified by
   * the PostgreSQL integration tier. See DISC-0002.
   */
  async withTransaction<T>(
    context: TenantContext,
    fn: (tx: KnowledgeTransaction) => Promise<T>,
  ): Promise<T> {
    const snapshot: Store = {
      objects: new Map(this.store.objects),
      versions: [...this.store.versions],
      relationships: new Map(this.store.relationships),
      provenance: [...this.store.provenance],
      audit: [...this.store.audit],
      events: [...this.store.events],
    };

    try {
      return await fn(new MemoryTransaction(this.store, context.tenantId));
    } catch (error) {
      this.store.objects = snapshot.objects;
      this.store.versions = snapshot.versions;
      this.store.relationships = snapshot.relationships;
      this.store.provenance = snapshot.provenance;
      this.store.audit = snapshot.audit;
      this.store.events = snapshot.events;
      throw error;
    }
  }

  async checkHealth(): Promise<{ reachable: boolean; latencyMs: number; detail?: string }> {
    return { reachable: true, latencyMs: 0, detail: 'in-memory store (non-production)' };
  }

  async close(): Promise<void> {
    // Nothing to release.
  }

  /* ------------------------------------------------- test-only inspection hooks */

  /** Events are persisted but not dispatched in WP-0001; tests assert on them directly. */
  allEvents(): readonly EventEnvelope[] {
    return this.store.events.map(clone);
  }

  allAudit(): readonly AuditRecord[] {
    return this.store.audit.map(clone);
  }

  reset(): void {
    this.store.objects = emptyStore().objects;
    this.store.versions = [];
    this.store.relationships = emptyStore().relationships;
    this.store.provenance = [];
    this.store.audit = [];
    this.store.events = [];
  }
}
