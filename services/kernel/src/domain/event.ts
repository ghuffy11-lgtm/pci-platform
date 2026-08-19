/**
 * Event envelope.
 *
 * Source: SPEC-0007 "Event Envelope", docs/architecture/api-and-event-standards.md
 *
 * Scope note: WP-0001 implements the envelope and durable persistence (a transactional
 * outbox written in the same transaction as the mutation). It does NOT implement a broker,
 * dispatcher, or subscription mechanism — those are not in the work package's scope, and
 * building them now would be the speculative feature CLAUDE.md prohibits.
 *
 * Persisting the envelope now is not speculative: without it, "what changed and what caused
 * it" cannot be reconstructed later for records written today, and SPEC-0007 requires events
 * to be retained as historical evidence.
 */

import type {
  CorrelationId,
  EventId,
  PrincipalId,
  TenantId,
} from './identifiers.ts';

export type EventEnvelope = {
  /** SPEC-0007: event ID. */
  readonly id: EventId;
  /** SPEC-0007: event type. Namespaced and versioned independently of the payload. */
  readonly type: string;
  /** SPEC-0007: occurrence time. */
  readonly occurredAt: string;
  /** SPEC-0007: producer identity. */
  readonly producer: string;
  readonly producedBy: PrincipalId;

  readonly tenantId: TenantId;

  /** SPEC-0007: subject object. */
  readonly subjectType: string;
  readonly subjectId: string;
  /** SPEC-0007: related objects. */
  readonly relatedIds: readonly string[];

  /** SPEC-0007: correlation ID, causation ID where known. */
  readonly correlationId: CorrelationId;
  readonly causationId: string | null;

  /** SPEC-0007: payload version. Consumers must tolerate unknown fields and future types. */
  readonly payloadVersion: number;
  readonly payload: Readonly<Record<string, unknown>>;
};

export const EVENT_TYPES = {
  objectCreated: 'pci.knowledge.object.created',
  objectUpdated: 'pci.knowledge.object.updated',
  objectStateChanged: 'pci.knowledge.object.state_changed',
  objectRetired: 'pci.knowledge.object.retired',
  relationshipCreated: 'pci.knowledge.relationship.created',
  relationshipRemoved: 'pci.knowledge.relationship.removed',
} as const;

/** Current payload schema version for kernel-emitted events. */
export const KERNEL_PAYLOAD_VERSION = 1;

export const KERNEL_PRODUCER = 'pci.kernel';
