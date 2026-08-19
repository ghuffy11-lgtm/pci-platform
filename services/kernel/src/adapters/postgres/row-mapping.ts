/**
 * Row <-> domain mapping for the PostgreSQL adapter.
 *
 * Kept separate from query code so the conversions are individually reviewable — several of
 * them are easy to get subtly wrong:
 *
 *   * `timestamptz` arrives as a JS Date; the domain uses ISO strings throughout.
 *   * `numeric` arrives as a STRING (node-postgres does not coerce, to avoid precision loss),
 *     so `confidence` must be parsed explicitly rather than trusted to be a number.
 *   * `integer` arrives as a number, but `bigint` would arrive as a string — count(*) is cast
 *     to int in the queries for that reason.
 */

import type { KnowledgeObject, KnowledgeObjectVersion } from '../../domain/knowledge-object.ts';
import type { Relationship } from '../../domain/relationship.ts';
import type { ProvenanceRecord } from '../../domain/provenance.ts';
import type { AuditRecord } from '../../domain/audit.ts';
import type { EventEnvelope } from '../../domain/event.ts';

export function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return new Date(value).toISOString();
  throw new TypeError(`Expected a timestamp, received ${typeof value}`);
}

export function toIsoOrNull(value: unknown): string | null {
  return value === null || value === undefined ? null : toIso(value);
}

/** node-postgres returns `numeric` as a string to preserve precision. */
export function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

type Row = Record<string, unknown>;

export function mapObject(row: Row): KnowledgeObject {
  return {
    id: row['id'] as KnowledgeObject['id'],
    tenantId: row['tenant_id'] as KnowledgeObject['tenantId'],
    type: row['type'] as KnowledgeObject['type'],
    name: row['name'] as string,
    status: row['status'] as KnowledgeObject['status'],
    ownership: {
      organization: row['ownership_org'] as string,
      owner: row['ownership_owner'] as string,
    },
    classification: row['classification'] as KnowledgeObject['classification'],
    createdAt: toIso(row['created_at']),
    updatedAt: toIso(row['updated_at']),
    validFrom: toIsoOrNull(row['valid_from']),
    validTo: toIsoOrNull(row['valid_to']),
    version: row['version'] as number,
    attributes: (row['attributes'] as Record<string, unknown>) ?? {},
    createdBy: row['created_by'] as KnowledgeObject['createdBy'],
    updatedBy: row['updated_by'] as KnowledgeObject['updatedBy'],
  };
}

export function mapVersion(row: Row): KnowledgeObjectVersion {
  return {
    objectId: row['object_id'] as KnowledgeObjectVersion['objectId'],
    tenantId: row['tenant_id'] as KnowledgeObjectVersion['tenantId'],
    version: row['version'] as number,
    recordedAt: toIso(row['recorded_at']),
    recordedBy: row['recorded_by'] as KnowledgeObjectVersion['recordedBy'],
    changeKind: row['change_kind'] as KnowledgeObjectVersion['changeKind'],
    snapshot: row['snapshot'] as KnowledgeObject,
  };
}

export function mapRelationship(row: Row): Relationship {
  return {
    id: row['id'] as Relationship['id'],
    tenantId: row['tenant_id'] as Relationship['tenantId'],
    fromId: row['from_id'] as Relationship['fromId'],
    toId: row['to_id'] as Relationship['toId'],
    type: row['type'] as Relationship['type'],
    createdAt: toIso(row['created_at']),
    createdBy: row['created_by'] as Relationship['createdBy'],
    validFrom: toIsoOrNull(row['valid_from']),
    validTo: toIsoOrNull(row['valid_to']),
    confidence: toNumberOrNull(row['confidence']),
    attributes: (row['attributes'] as Record<string, unknown>) ?? {},
  };
}

export function mapProvenance(row: Row): ProvenanceRecord {
  return {
    id: row['id'] as ProvenanceRecord['id'],
    tenantId: row['tenant_id'] as ProvenanceRecord['tenantId'],
    objectId: row['object_id'] as ProvenanceRecord['objectId'],
    objectVersion: row['object_version'] as number,
    sourceId: row['source_id'] as string,
    sourceType: row['source_type'] as ProvenanceRecord['sourceType'],
    sourceLocation: (row['source_location'] as string | null) ?? null,
    observedAt: toIsoOrNull(row['observed_at']),
    ingestedAt: toIso(row['ingested_at']),
    transformation: (row['transformation'] as string | null) ?? null,
    actorId: row['actor_id'] as ProvenanceRecord['actorId'],
    connector: (row['connector'] as string | null) ?? null,
    confidence: toNumberOrNull(row['confidence']),
    validationState: row['validation_state'] as ProvenanceRecord['validationState'],
    evidenceRef: (row['evidence_ref'] as string | null) ?? null,
  };
}

export function mapAudit(row: Row): AuditRecord {
  return {
    id: row['id'] as AuditRecord['id'],
    tenantId: row['tenant_id'] as AuditRecord['tenantId'],
    occurredAt: toIso(row['occurred_at']),
    actorId: row['actor_id'] as AuditRecord['actorId'],
    actorType: row['actor_type'] as AuditRecord['actorType'],
    delegatedBy: (row['delegated_by'] as AuditRecord['delegatedBy']) ?? null,
    action: row['action'] as string,
    targetType: row['target_type'] as string,
    targetId: (row['target_id'] as string | null) ?? null,
    policyDecision: row['policy_decision'] as string,
    policyVersion: row['policy_version'] as string,
    policyReason: row['policy_reason'] as string,
    correlationId: row['correlation_id'] as AuditRecord['correlationId'],
    causationId: (row['causation_id'] as string | null) ?? null,
    outcome: row['outcome'] as AuditRecord['outcome'],
    errorCode: (row['error_code'] as string | null) ?? null,
    changeSummary: (row['change_summary'] as Record<string, unknown>) ?? {},
    resultingVersion: (row['resulting_version'] as number | null) ?? null,
  };
}

export function mapEvent(row: Row): EventEnvelope {
  return {
    id: row['id'] as EventEnvelope['id'],
    type: row['type'] as string,
    occurredAt: toIso(row['occurred_at']),
    producer: row['producer'] as string,
    producedBy: row['produced_by'] as EventEnvelope['producedBy'],
    tenantId: row['tenant_id'] as EventEnvelope['tenantId'],
    subjectType: row['subject_type'] as string,
    subjectId: row['subject_id'] as string,
    relatedIds: (row['related_ids'] as string[]) ?? [],
    correlationId: row['correlation_id'] as EventEnvelope['correlationId'],
    causationId: (row['causation_id'] as string | null) ?? null,
    payloadVersion: row['payload_version'] as number,
    payload: (row['payload'] as Record<string, unknown>) ?? {},
  };
}
