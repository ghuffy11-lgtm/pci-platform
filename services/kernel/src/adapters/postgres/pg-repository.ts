/**
 * PostgreSQL repository adapter.
 *
 * Sources: WP-0001 scope item 3, SPEC-0010, ADR-0016 (proposed).
 *
 * ⚠ THIS ADAPTER HAS NEVER BEEN EXECUTED.
 *   No PostgreSQL instance was available during WP-0001 implementation. It typechecks and its
 *   SQL is reviewable, but it is unverified. See
 *   implementation/blockers/BLK-0001-no-execution-environment.md and
 *   implementation/discoveries/DISC-0002-adapter-test-fidelity.md.
 *
 * Tenant safety
 * -------------
 * `withTransaction` sets `pci.tenant_id` transaction-locally (the `true` third argument to
 * set_config) before any statement runs, which is what the row-level-security policies in
 * migration 0001 read. Every statement ALSO filters on tenant_id explicitly — belt and braces,
 * per ADR-0016 layers 2 and 3. Neither layer is load-bearing on its own.
 *
 * Every value reaches SQL as a bound parameter. There is no string interpolation into SQL
 * anywhere in this file, including in the ORDER BY and filter construction.
 */

import pg from 'pg';

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
import {
  mapAudit,
  mapObject,
  mapProvenance,
  mapRelationship,
  mapVersion,
} from './row-mapping.ts';

const { Pool } = pg;
type PoolClient = pg.PoolClient;

const OBJECT_COLUMNS = `
    tenant_id, id, type, name, status, ownership_org, ownership_owner, classification,
    created_at, updated_at, valid_from, valid_to, version, attributes, created_by, updated_by
`;

const RELATIONSHIP_COLUMNS = `
    tenant_id, id, from_id, to_id, type, created_at, created_by,
    valid_from, valid_to, confidence, attributes
`;

/**
 * Accumulates `WHERE` clauses and their bound parameters.
 *
 * Each clause is built through a `bind` callback that pushes the value and returns its
 * placeholder, so a clause can reference a value more than once, or wrap several bindings in
 * parentheses, without any value ever reaching the SQL string.
 */
class Filters {
  private readonly clauses: string[] = [];
  private readonly values: unknown[] = [];

  constructor(tenantId: TenantId) {
    this.push((bind) => `tenant_id = ${bind(tenantId)}`);
  }

  push(build: (bind: (value: unknown) => string) => string): void {
    const bind = (value: unknown): string => {
      this.values.push(value);
      return `$${this.values.length}`;
    };
    this.clauses.push(build(bind));
  }

  /** A clause with no bound values, e.g. a literal state exclusion. */
  pushLiteral(clause: string): void {
    this.clauses.push(clause);
  }

  get where(): string {
    return this.clauses.join(' AND ');
  }

  get params(): unknown[] {
    return [...this.values];
  }

  /** Append limit/offset and return the full parameter list. */
  withPaging(limit: number, offset: number): { suffix: string; params: unknown[] } {
    const params = [...this.values, limit, offset];
    return {
      suffix: `LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    };
  }
}

class PgTransaction implements KnowledgeTransaction {
  private readonly client: PoolClient;
  private readonly tenantId: TenantId;

  constructor(client: PoolClient, tenantId: TenantId) {
    this.client = client;
    this.tenantId = tenantId;
  }

  /* ------------------------------------------------------------------- objects */

  async insertObject(
    _input: CreateObjectInput,
    object: KnowledgeObject,
  ): Promise<KnowledgeObject> {
    const result = await this.client.query(
      `INSERT INTO knowledge_objects (${OBJECT_COLUMNS})
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       RETURNING ${OBJECT_COLUMNS}`,
      [
        object.tenantId,
        object.id,
        object.type,
        object.name,
        object.status,
        object.ownership.organization,
        object.ownership.owner,
        object.classification,
        object.createdAt,
        object.updatedAt,
        object.validFrom,
        object.validTo,
        object.version,
        JSON.stringify(object.attributes),
        object.createdBy,
        object.updatedBy,
      ],
    );
    return mapObject(result.rows[0] as Record<string, unknown>);
  }

  async findObject(id: ObjectId): Promise<KnowledgeObject | null> {
    const result = await this.client.query(
      `SELECT ${OBJECT_COLUMNS} FROM knowledge_objects WHERE tenant_id = $1 AND id = $2`,
      [this.tenantId, id],
    );
    const row = result.rows[0];
    return row === undefined ? null : mapObject(row as Record<string, unknown>);
  }

  async updateObject(
    id: ObjectId,
    _patch: UpdateObjectInput,
    expectedVersion: number,
    next: KnowledgeObject,
  ): Promise<KnowledgeObject | null> {
    // Lock the row first so the version check and the write cannot interleave with a
    // concurrent updater. Checking versions with a bare UPDATE ... WHERE version = $n cannot
    // distinguish "not found" from "version conflict", and both need distinct responses.
    const current = await this.client.query(
      `SELECT version FROM knowledge_objects WHERE tenant_id = $1 AND id = $2 FOR UPDATE`,
      [this.tenantId, id],
    );

    const row = current.rows[0] as { version: number } | undefined;
    if (row === undefined) return null;
    if (row.version !== expectedVersion) {
      throw new VersionConflictError(expectedVersion, row.version);
    }

    const result = await this.client.query(
      `UPDATE knowledge_objects
          SET name            = $3,
              status          = $4,
              ownership_org   = $5,
              ownership_owner = $6,
              classification  = $7,
              updated_at      = $8,
              valid_from      = $9,
              valid_to        = $10,
              version         = $11,
              attributes      = $12,
              updated_by      = $13
        WHERE tenant_id = $1 AND id = $2
        RETURNING ${OBJECT_COLUMNS}`,
      [
        this.tenantId,
        id,
        next.name,
        next.status,
        next.ownership.organization,
        next.ownership.owner,
        next.classification,
        next.updatedAt,
        next.validFrom,
        next.validTo,
        next.version,
        JSON.stringify(next.attributes),
        next.updatedBy,
      ],
    );

    const updated = result.rows[0];
    return updated === undefined ? null : mapObject(updated as Record<string, unknown>);
  }

  async listObjects(query: ObjectQuery): Promise<Page<KnowledgeObject>> {
    const filters = new Filters(this.tenantId);
    if (query.type !== undefined) filters.push((bind) => `type = ${bind(query.type)}`);
    if (query.status !== undefined) filters.push((bind) => `status = ${bind(query.status)}`);
    if (query.classification !== undefined) {
      filters.push((bind) => `classification = ${bind(query.classification)}`);
    }
    if (query.owner !== undefined) {
      filters.push((bind) => `ownership_owner = ${bind(query.owner)}`);
    }
    if (query.organization !== undefined) {
      filters.push((bind) => `ownership_org = ${bind(query.organization)}`);
    }
    // Lifecycle rule: retired objects are excluded from current state unless requested.
    if (query.includeRetired !== true) filters.pushLiteral(`status <> 'retired'`);
    if (query.asOf !== undefined) {
      filters.push(
        (bind) =>
          `(valid_from IS NULL OR valid_from <= ${bind(query.asOf)}) ` +
          `AND (valid_to IS NULL OR valid_to > ${bind(query.asOf)})`,
      );
    }

    const countResult = await this.client.query(
      `SELECT count(*)::int AS total FROM knowledge_objects WHERE ${filters.where}`,
      filters.params,
    );

    const { suffix, params } = filters.withPaging(query.limit, query.offset);
    const rows = await this.client.query(
      `SELECT ${OBJECT_COLUMNS} FROM knowledge_objects
        WHERE ${filters.where}
        ORDER BY created_at ASC, id ASC
        ${suffix}`,
      params,
    );

    return {
      items: rows.rows.map((row) => mapObject(row as Record<string, unknown>)),
      total: (countResult.rows[0] as { total: number }).total,
      limit: query.limit,
      offset: query.offset,
    };
  }

  /* ------------------------------------------------------------------ versions */

  async appendVersion(version: KnowledgeObjectVersion): Promise<void> {
    await this.client.query(
      `INSERT INTO knowledge_object_versions
           (tenant_id, object_id, version, recorded_at, recorded_by, change_kind, snapshot)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        version.tenantId,
        version.objectId,
        version.version,
        version.recordedAt,
        version.recordedBy,
        version.changeKind,
        JSON.stringify(version.snapshot),
      ],
    );
  }

  async listVersions(
    id: ObjectId,
    limit: number,
    offset: number,
  ): Promise<Page<KnowledgeObjectVersion>> {
    const countResult = await this.client.query(
      `SELECT count(*)::int AS total FROM knowledge_object_versions
        WHERE tenant_id = $1 AND object_id = $2`,
      [this.tenantId, id],
    );

    const rows = await this.client.query(
      `SELECT tenant_id, object_id, version, recorded_at, recorded_by, change_kind, snapshot
         FROM knowledge_object_versions
        WHERE tenant_id = $1 AND object_id = $2
        ORDER BY version DESC
        LIMIT $3 OFFSET $4`,
      [this.tenantId, id, limit, offset],
    );

    return {
      items: rows.rows.map((row) => mapVersion(row as Record<string, unknown>)),
      total: (countResult.rows[0] as { total: number }).total,
      limit,
      offset,
    };
  }

  /* ------------------------------------------------------------- relationships */

  async insertRelationship(
    _input: CreateRelationshipInput,
    relationship: Relationship,
  ): Promise<Relationship> {
    const result = await this.client.query(
      `INSERT INTO relationships (${RELATIONSHIP_COLUMNS})
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING ${RELATIONSHIP_COLUMNS}`,
      [
        relationship.tenantId,
        relationship.id,
        relationship.fromId,
        relationship.toId,
        relationship.type,
        relationship.createdAt,
        relationship.createdBy,
        relationship.validFrom,
        relationship.validTo,
        relationship.confidence,
        JSON.stringify(relationship.attributes),
      ],
    );
    return mapRelationship(result.rows[0] as Record<string, unknown>);
  }

  async findRelationship(id: RelationshipId): Promise<Relationship | null> {
    const result = await this.client.query(
      `SELECT ${RELATIONSHIP_COLUMNS} FROM relationships WHERE tenant_id = $1 AND id = $2`,
      [this.tenantId, id],
    );
    const row = result.rows[0];
    return row === undefined ? null : mapRelationship(row as Record<string, unknown>);
  }

  async removeRelationship(id: RelationshipId): Promise<boolean> {
    const result = await this.client.query(
      `DELETE FROM relationships WHERE tenant_id = $1 AND id = $2`,
      [this.tenantId, id],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async listRelationships(query: RelationshipQuery): Promise<Page<Relationship>> {
    const filters = new Filters(this.tenantId);
    if (query.fromId !== undefined) filters.push((bind) => `from_id = ${bind(query.fromId)}`);
    if (query.toId !== undefined) filters.push((bind) => `to_id = ${bind(query.toId)}`);
    if (query.eitherId !== undefined) {
      filters.push(
        (bind) => `(from_id = ${bind(query.eitherId)} OR to_id = ${bind(query.eitherId)})`,
      );
    }
    if (query.type !== undefined) filters.push((bind) => `type = ${bind(query.type)}`);
    if (query.asOf !== undefined) {
      filters.push(
        (bind) =>
          `(valid_from IS NULL OR valid_from <= ${bind(query.asOf)}) ` +
          `AND (valid_to IS NULL OR valid_to > ${bind(query.asOf)})`,
      );
    }

    const countResult = await this.client.query(
      `SELECT count(*)::int AS total FROM relationships WHERE ${filters.where}`,
      filters.params,
    );

    const { suffix, params } = filters.withPaging(query.limit, query.offset);
    const rows = await this.client.query(
      `SELECT ${RELATIONSHIP_COLUMNS} FROM relationships
        WHERE ${filters.where}
        ORDER BY created_at ASC, id ASC
        ${suffix}`,
      params,
    );

    return {
      items: rows.rows.map((row) => mapRelationship(row as Record<string, unknown>)),
      total: (countResult.rows[0] as { total: number }).total,
      limit: query.limit,
      offset: query.offset,
    };
  }

  async relationshipExists(
    fromId: ObjectId,
    toId: ObjectId,
    type: Relationship['type'],
  ): Promise<boolean> {
    const result = await this.client.query(
      `SELECT 1 FROM relationships
        WHERE tenant_id = $1 AND from_id = $2 AND to_id = $3 AND type = $4
        LIMIT 1`,
      [this.tenantId, fromId, toId, type],
    );
    return result.rows.length > 0;
  }

  /* ---------------------------------------------------------------- provenance */

  async appendProvenance(
    _input: CreateProvenanceInput,
    record: ProvenanceRecord,
  ): Promise<ProvenanceRecord> {
    const result = await this.client.query(
      `INSERT INTO provenance_records
           (tenant_id, id, object_id, object_version, source_id, source_type, source_location,
            observed_at, ingested_at, transformation, actor_id, connector, confidence,
            validation_state, evidence_ref)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [
        record.tenantId,
        record.id,
        record.objectId,
        record.objectVersion,
        record.sourceId,
        record.sourceType,
        record.sourceLocation,
        record.observedAt,
        record.ingestedAt,
        record.transformation,
        record.actorId,
        record.connector,
        record.confidence,
        record.validationState,
        record.evidenceRef,
      ],
    );
    return mapProvenance(result.rows[0] as Record<string, unknown>);
  }

  async listProvenance(id: ObjectId): Promise<readonly ProvenanceRecord[]> {
    const result = await this.client.query(
      `SELECT * FROM provenance_records
        WHERE tenant_id = $1 AND object_id = $2
        ORDER BY ingested_at ASC, id ASC`,
      [this.tenantId, id],
    );
    return result.rows.map((row) => mapProvenance(row as Record<string, unknown>));
  }

  /* --------------------------------------------------------------------- audit */

  async appendAudit(record: AuditRecord): Promise<void> {
    await this.client.query(
      `INSERT INTO audit_records
           (tenant_id, id, occurred_at, actor_id, actor_type, delegated_by, action,
            target_type, target_id, policy_decision, policy_version, policy_reason,
            correlation_id, causation_id, outcome, error_code, change_summary, resulting_version)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [
        record.tenantId,
        record.id,
        record.occurredAt,
        record.actorId,
        record.actorType,
        record.delegatedBy,
        record.action,
        record.targetType,
        record.targetId,
        record.policyDecision,
        record.policyVersion,
        record.policyReason,
        record.correlationId,
        record.causationId,
        record.outcome,
        record.errorCode,
        JSON.stringify(record.changeSummary),
        record.resultingVersion,
      ],
    );
  }

  async queryAudit(query: AuditQuery): Promise<Page<AuditRecord>> {
    const filters = new Filters(this.tenantId);
    if (query.actorId !== undefined) filters.push((bind) => `actor_id = ${bind(query.actorId)}`);
    if (query.targetId !== undefined) filters.push((bind) => `target_id = ${bind(query.targetId)}`);
    if (query.action !== undefined) filters.push((bind) => `action = ${bind(query.action)}`);
    if (query.correlationId !== undefined) {
      filters.push((bind) => `correlation_id = ${bind(query.correlationId)}`);
    }
    if (query.outcome !== undefined) filters.push((bind) => `outcome = ${bind(query.outcome)}`);
    if (query.from !== undefined) filters.push((bind) => `occurred_at >= ${bind(query.from)}`);
    if (query.to !== undefined) filters.push((bind) => `occurred_at <= ${bind(query.to)}`);

    const countResult = await this.client.query(
      `SELECT count(*)::int AS total FROM audit_records WHERE ${filters.where}`,
      filters.params,
    );

    const { suffix, params } = filters.withPaging(query.limit, query.offset);
    const rows = await this.client.query(
      `SELECT * FROM audit_records
        WHERE ${filters.where}
        ORDER BY occurred_at DESC, id DESC
        ${suffix}`,
      params,
    );

    return {
      items: rows.rows.map((row) => mapAudit(row as Record<string, unknown>)),
      total: (countResult.rows[0] as { total: number }).total,
      limit: query.limit,
      offset: query.offset,
    };
  }

  /* -------------------------------------------------------------------- events */

  async appendEvent(envelope: EventEnvelope): Promise<void> {
    await this.client.query(
      `INSERT INTO events
           (tenant_id, id, type, occurred_at, producer, produced_by, subject_type, subject_id,
            related_ids, correlation_id, causation_id, payload_version, payload)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        envelope.tenantId,
        envelope.id,
        envelope.type,
        envelope.occurredAt,
        envelope.producer,
        envelope.producedBy,
        envelope.subjectType,
        envelope.subjectId,
        envelope.relatedIds,
        envelope.correlationId,
        envelope.causationId,
        envelope.payloadVersion,
        JSON.stringify(envelope.payload),
      ],
    );
  }
}

export class PostgresKnowledgeRepository implements KnowledgeRepository {
  private readonly pool: pg.Pool;

  constructor(options: {
    connectionString: string;
    max: number;
    statementTimeoutMs: number;
  }) {
    this.pool = new Pool({
      connectionString: options.connectionString,
      max: options.max,
      // Bound every statement so a pathological query cannot hold a connection indefinitely.
      statement_timeout: options.statementTimeoutMs,
      idle_in_transaction_session_timeout: options.statementTimeoutMs,
      application_name: 'pci-kernel',
    });
  }

  async withTransaction<T>(
    context: TenantContext,
    fn: (tx: KnowledgeTransaction) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // ADR-0016 layer 3. The third argument makes the setting transaction-local, so it cannot
      // leak to the next borrower of this pooled connection — which would be a cross-tenant
      // data leak of exactly the kind SPEC-0010 prohibits.
      await client.query(`SELECT set_config('pci.tenant_id', $1, true)`, [context.tenantId]);

      const result = await fn(new PgTransaction(client, context.tenantId));
      await client.query('COMMIT');
      return result;
    } catch (error) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // A rollback failure means the connection is unusable; releasing it with an error
        // below removes it from the pool. Do not mask the original error.
      }
      throw error;
    } finally {
      client.release();
    }
  }

  async checkHealth(): Promise<{ reachable: boolean; latencyMs: number; detail?: string }> {
    const started = Date.now();
    try {
      await this.pool.query('SELECT 1');
      return { reachable: true, latencyMs: Date.now() - started };
    } catch {
      // AC-08: never surface the connection string, host, or driver error text — those can
      // contain credentials and topology detail.
      return {
        reachable: false,
        latencyMs: Date.now() - started,
        detail: 'database unreachable',
      };
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
