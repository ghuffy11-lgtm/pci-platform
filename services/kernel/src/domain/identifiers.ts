/**
 * Branded identifier types.
 *
 * Source: docs/knowledge/canonical-object-schema.md invariant 1 ("IDs are stable and never
 *         reused"), SPEC-0010, ADR-0016 layer 1.
 *
 * Branding makes it a compile-time error to pass an arbitrary string where a TenantId is
 * required, so no persistence call can be reached without a tenant that came from a verified
 * principal.
 */

import { randomUUID } from 'node:crypto';

declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };

export type ObjectId = Brand<string, 'ObjectId'>;
export type RelationshipId = Brand<string, 'RelationshipId'>;
export type TenantId = Brand<string, 'TenantId'>;
export type PrincipalId = Brand<string, 'PrincipalId'>;
export type CorrelationId = Brand<string, 'CorrelationId'>;
export type ProvenanceId = Brand<string, 'ProvenanceId'>;
export type AuditId = Brand<string, 'AuditId'>;
export type EventId = Brand<string, 'EventId'>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

/**
 * Tenant identifiers are operator-assigned slugs rather than UUIDs so that deployment
 * configuration, logs, and database GUC values stay human-readable.
 */
const TENANT_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export function isTenantSlug(value: string): boolean {
  return TENANT_PATTERN.test(value);
}

/**
 * Reserved tenant for platform-owned objects.
 * SPEC-0010: "System-level objects are explicitly classified and separately governed."
 * No ordinary principal may be issued a context for this tenant.
 */
export const SYSTEM_TENANT = 'system' as TenantId;

export function newObjectId(): ObjectId {
  return randomUUID() as ObjectId;
}

export function newRelationshipId(): RelationshipId {
  return randomUUID() as RelationshipId;
}

export function newProvenanceId(): ProvenanceId {
  return randomUUID() as ProvenanceId;
}

export function newAuditId(): AuditId {
  return randomUUID() as AuditId;
}

export function newEventId(): EventId {
  return randomUUID() as EventId;
}

export function newCorrelationId(): CorrelationId {
  return randomUUID() as CorrelationId;
}

/** Parse an untrusted string into an ObjectId, or return null. */
export function toObjectId(value: string): ObjectId | null {
  return isUuid(value) ? (value as ObjectId) : null;
}

export function toRelationshipId(value: string): RelationshipId | null {
  return isUuid(value) ? (value as RelationshipId) : null;
}

export function toTenantId(value: string): TenantId | null {
  return isTenantSlug(value) ? (value as TenantId) : null;
}
