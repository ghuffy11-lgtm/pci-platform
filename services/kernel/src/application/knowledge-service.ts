/**
 * Knowledge Object application service.
 *
 * Source: SPEC-0005 (operations), SPEC-0006 (audit), SPEC-0007 (events),
 *         SPEC-0010 (tenancy), SPEC-0011 (authorization), ADR-0011 (agent authority),
 *         ADR-0016 (isolation strategy).
 *
 * This is the single place where a governed action is composed:
 *
 *     authorize -> transact -> mutate -> version -> provenance -> audit -> event
 *
 * Every mutation goes through `governed()`. That is deliberate: it makes it structurally
 * impossible to add a mutation that skips authorization or audit, which is the failure mode
 * SPEC-0011 and SPEC-0006 exist to prevent.
 */

import {
  ApprovalRequiredError,
  AuthorizationError,
  ConflictError,
  NotFoundError,
  ValidationError,
  VersionConflictError,
} from '../domain/errors.ts';
import type { FieldIssue } from '../domain/errors.ts';
import {
  newAuditId,
  newEventId,
  newObjectId,
  newProvenanceId,
  newRelationshipId,
} from '../domain/identifiers.ts';
import type { ObjectId, RelationshipId } from '../domain/identifiers.ts';
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
  Neighbourhood,
  Relationship,
  RelationshipQuery,
} from '../domain/relationship.ts';
import type { CreateProvenanceInput, ProvenanceRecord } from '../domain/provenance.ts';
import { normaliseValidationState } from '../domain/provenance.ts';
import type { AuditOutcome, AuditQuery, AuditRecord } from '../domain/audit.ts';
import { AUDIT_ACTIONS } from '../domain/audit.ts';
import type { EventEnvelope } from '../domain/event.ts';
import { EVENT_TYPES, KERNEL_PAYLOAD_VERSION, KERNEL_PRODUCER } from '../domain/event.ts';
import type { TenantContext } from '../domain/principal.ts';
import type { Classification } from '../domain/vocabulary.ts';
import { findSecretMaterial, redact } from '../domain/secret-guard.ts';
import type { KnowledgeRepository, KnowledgeTransaction } from '../ports/knowledge-repository.ts';
import type { PolicyDecision, PolicyEngine } from '../ports/policy.ts';
import type { Clock } from '../ports/clock.ts';
import type { Logger } from '../observability/logger.ts';

const RESOURCE_OBJECT = 'knowledge_object';
const RESOURCE_RELATIONSHIP = 'relationship';
const RESOURCE_AUDIT = 'audit_record';

type GovernedParams<T> = {
  readonly context: TenantContext;
  readonly action: string;
  readonly targetType: string;
  readonly targetId: string | null;
  readonly riskClass: 'low' | 'medium' | 'high';
  readonly resourceClassification: Classification | null;
  readonly resourceOwner: string | null;
  readonly changeSummary: Record<string, unknown>;
  readonly run: (tx: KnowledgeTransaction, decision: PolicyDecision) => Promise<GovernedResult<T>>;
};

type GovernedResult<T> = {
  readonly result: T;
  readonly resultingVersion: number | null;
  /** Allows the run function to refine what gets recorded, e.g. adding the new object id. */
  readonly changeSummary?: Record<string, unknown>;
  readonly targetId?: string;
};

export class KnowledgeService {
  private readonly repository: KnowledgeRepository;
  private readonly policy: PolicyEngine;
  private readonly clock: Clock;
  private readonly logger: Logger;
  private readonly environment: string;

  constructor(deps: {
    repository: KnowledgeRepository;
    policy: PolicyEngine;
    clock: Clock;
    logger: Logger;
    environment: string;
  }) {
    this.repository = deps.repository;
    this.policy = deps.policy;
    this.clock = deps.clock;
    this.logger = deps.logger;
    this.environment = deps.environment;
  }

  /* ================================================================== objects */

  async createObject(
    context: TenantContext,
    input: CreateObjectInput,
    provenanceInputs: readonly CreateProvenanceInput[],
  ): Promise<{ object: KnowledgeObject; provenance: readonly ProvenanceRecord[] }> {
    return this.governed({
      context,
      action: AUDIT_ACTIONS.objectCreate,
      targetType: RESOURCE_OBJECT,
      targetId: null,
      riskClass: 'medium',
      resourceClassification: input.classification,
      resourceOwner: input.ownership.owner,
      changeSummary: {
        type: input.type,
        name: input.name,
        classification: input.classification,
        status: input.status ?? 'proposed',
      },
      run: async (tx) => {
        // Defence in depth. validateCreateObject already applies this guard at the HTTP
        // boundary, but the invariant belongs to the domain, not to one transport: an
        // ingestion connector or background job calling this service directly must be held
        // to the same rule (canonical-object-schema.md invariant 6, ADR-0009).
        this.assertNoSecretMaterial(input.attributes);

        const now = this.clock.nowIso();
        const id = newObjectId();

        const object: KnowledgeObject = {
          id,
          tenantId: context.tenantId,
          type: input.type,
          name: input.name,
          status: input.status ?? 'proposed',
          ownership: input.ownership,
          classification: input.classification,
          createdAt: now,
          updatedAt: now,
          validFrom: input.validFrom ?? null,
          validTo: input.validTo ?? null,
          version: 1,
          attributes: input.attributes ?? {},
          createdBy: context.principal.id,
          updatedBy: context.principal.id,
        };

        const stored = await tx.insertObject(input, object);

        await tx.appendVersion({
          objectId: stored.id,
          tenantId: context.tenantId,
          version: stored.version,
          recordedAt: now,
          recordedBy: context.principal.id,
          changeKind: 'created',
          snapshot: stored,
        });

        // canonical-object-schema.md invariant 4: provenance is required for externally
        // derived facts. When the caller supplies none we synthesise an actor-attributed
        // record so that every object can answer "where did this come from".
        const inputs =
          provenanceInputs.length > 0 ? provenanceInputs : [this.selfProvenance(context)];

        const provenance: ProvenanceRecord[] = [];
        for (const provenanceInput of inputs) {
          provenance.push(
            await tx.appendProvenance(provenanceInput, {
              id: newProvenanceId(),
              tenantId: context.tenantId,
              objectId: stored.id,
              objectVersion: stored.version,
              sourceId: provenanceInput.sourceId,
              sourceType: provenanceInput.sourceType,
              sourceLocation: provenanceInput.sourceLocation ?? null,
              observedAt: provenanceInput.observedAt ?? null,
              ingestedAt: now,
              transformation: provenanceInput.transformation ?? null,
              actorId: context.principal.id,
              connector: provenanceInput.connector ?? null,
              confidence: provenanceInput.confidence ?? null,
              validationState: normaliseValidationState(
                provenanceInput.sourceType,
                provenanceInput.validationState,
              ),
              evidenceRef: provenanceInput.evidenceRef ?? null,
            }),
          );
        }

        await tx.appendEvent(
          this.buildEvent(context, EVENT_TYPES.objectCreated, RESOURCE_OBJECT, stored.id, [], {
            type: stored.type,
            name: stored.name,
            status: stored.status,
            classification: stored.classification,
            version: stored.version,
          }),
        );

        return {
          result: { object: stored, provenance },
          resultingVersion: stored.version,
          targetId: stored.id,
          changeSummary: { objectId: stored.id, type: stored.type, version: stored.version },
        };
      },
    });
  }

  async getObject(context: TenantContext, id: ObjectId): Promise<KnowledgeObject> {
    return this.repository.withTransaction(context, async (tx) => {
      const object = await tx.findObject(id);
      // Cross-tenant reads land here as null and surface as 404, never 403 (ADR-0016).
      if (object === null) throw new NotFoundError(RESOURCE_OBJECT, id);

      const decision = await this.policy.authorize({
        subject: context.principal,
        action: AUDIT_ACTIONS.objectRead,
        resourceType: RESOURCE_OBJECT,
        resourceId: id,
        resourceClassification: object.classification,
        resourceOwner: object.ownership.owner,
        tenantId: context.tenantId,
        environment: this.environment,
        riskClass: 'low',
      });

      if (decision.effect !== 'allow') {
        await tx.appendAudit(
          this.buildAudit(context, {
            action: AUDIT_ACTIONS.objectRead,
            targetType: RESOURCE_OBJECT,
            targetId: id,
            decision,
            outcome: decision.effect === 'deny' ? 'denied' : 'approval_required',
            errorCode: decision.effect === 'deny' ? 'forbidden' : 'approval_required',
            changeSummary: {},
            resultingVersion: null,
          }),
        );
        throw new AuthorizationError(AUDIT_ACTIONS.objectRead, decision.policyVersion);
      }

      if (this.shouldAuditRead(context, object.classification)) {
        await tx.appendAudit(
          this.buildAudit(context, {
            action: AUDIT_ACTIONS.objectRead,
            targetType: RESOURCE_OBJECT,
            targetId: id,
            decision,
            outcome: 'success',
            errorCode: null,
            changeSummary: { classification: object.classification },
            resultingVersion: object.version,
          }),
        );
      }

      return object;
    });
  }

  async updateObject(
    context: TenantContext,
    id: ObjectId,
    patch: UpdateObjectInput,
    expectedVersion: number,
  ): Promise<KnowledgeObject> {
    const current = await this.requireObject(context, id);
    const stateChanged = patch.status !== undefined && patch.status !== current.status;

    return this.governed({
      context,
      action: stateChanged ? AUDIT_ACTIONS.objectUpdate : AUDIT_ACTIONS.objectUpdate,
      targetType: RESOURCE_OBJECT,
      targetId: id,
      riskClass: 'medium',
      // Authorize against the higher of the current and requested classification so a caller
      // cannot escape a restricted-data rule by downgrading in the same request.
      resourceClassification: this.effectiveClassification(current, patch),
      resourceOwner: current.ownership.owner,
      changeSummary: { fields: Object.keys(patch).sort(), expectedVersion },
      run: async (tx) => {
        this.assertNoSecretMaterial(patch.attributes);

        const now = this.clock.nowIso();
        const next: KnowledgeObject = {
          ...current,
          name: patch.name ?? current.name,
          status: patch.status ?? current.status,
          ownership: patch.ownership ?? current.ownership,
          classification: patch.classification ?? current.classification,
          validFrom: patch.validFrom !== undefined ? patch.validFrom : current.validFrom,
          validTo: patch.validTo !== undefined ? patch.validTo : current.validTo,
          attributes: patch.attributes ?? current.attributes,
          updatedAt: now,
          updatedBy: context.principal.id,
          version: current.version + 1,
        };

        const stored = await tx.updateObject(id, patch, expectedVersion, next);
        if (stored === null) throw new NotFoundError(RESOURCE_OBJECT, id);

        await tx.appendVersion({
          objectId: stored.id,
          tenantId: context.tenantId,
          version: stored.version,
          recordedAt: now,
          recordedBy: context.principal.id,
          changeKind: stateChanged ? 'state_changed' : 'updated',
          snapshot: stored,
        });

        await tx.appendEvent(
          this.buildEvent(
            context,
            stateChanged ? EVENT_TYPES.objectStateChanged : EVENT_TYPES.objectUpdated,
            RESOURCE_OBJECT,
            stored.id,
            [],
            {
              version: stored.version,
              previousVersion: current.version,
              previousStatus: current.status,
              status: stored.status,
              changedFields: Object.keys(patch).sort(),
            },
          ),
        );

        return {
          result: stored,
          resultingVersion: stored.version,
          changeSummary: {
            fields: Object.keys(patch).sort(),
            fromVersion: current.version,
            toVersion: stored.version,
            ...(stateChanged ? { fromStatus: current.status, toStatus: stored.status } : {}),
          },
        };
      },
    });
  }

  /**
   * Retire an object.
   *
   * Retirement is a lifecycle transition, not a delete. There is no delete path for Knowledge
   * Objects anywhere in the kernel: canonical-object-schema.md invariant 1 requires IDs to be
   * stable and never reused, and claude-code-rules.md:38 forbids deleting data to make a task
   * look clean.
   */
  async retireObject(
    context: TenantContext,
    id: ObjectId,
    expectedVersion: number,
  ): Promise<KnowledgeObject> {
    const current = await this.requireObject(context, id);

    if (current.status === 'retired') {
      throw new ConflictError('already_retired', 'Object is already retired');
    }

    return this.governed({
      context,
      action: AUDIT_ACTIONS.objectRetire,
      targetType: RESOURCE_OBJECT,
      targetId: id,
      riskClass: 'high',
      resourceClassification: current.classification,
      resourceOwner: current.ownership.owner,
      changeSummary: { fromStatus: current.status, expectedVersion },
      run: async (tx) => {
        const now = this.clock.nowIso();
        const next: KnowledgeObject = {
          ...current,
          status: 'retired',
          updatedAt: now,
          updatedBy: context.principal.id,
          version: current.version + 1,
        };

        const stored = await tx.updateObject(id, { status: 'retired' }, expectedVersion, next);
        if (stored === null) throw new NotFoundError(RESOURCE_OBJECT, id);

        await tx.appendVersion({
          objectId: stored.id,
          tenantId: context.tenantId,
          version: stored.version,
          recordedAt: now,
          recordedBy: context.principal.id,
          changeKind: 'retired',
          snapshot: stored,
        });

        await tx.appendEvent(
          this.buildEvent(context, EVENT_TYPES.objectRetired, RESOURCE_OBJECT, stored.id, [], {
            previousStatus: current.status,
            version: stored.version,
          }),
        );

        return {
          result: stored,
          resultingVersion: stored.version,
          changeSummary: { fromStatus: current.status, toStatus: 'retired' },
        };
      },
    });
  }

  async listObjects(context: TenantContext, query: ObjectQuery): Promise<Page<KnowledgeObject>> {
    await this.requireAllow(context, {
      action: AUDIT_ACTIONS.objectQuery,
      resourceType: RESOURCE_OBJECT,
      resourceId: null,
      resourceClassification: null,
      resourceOwner: null,
      riskClass: 'low',
    });
    return this.repository.withTransaction(context, (tx) => tx.listObjects(query));
  }

  async getHistory(
    context: TenantContext,
    id: ObjectId,
    limit: number,
    offset: number,
  ): Promise<Page<KnowledgeObjectVersion>> {
    const object = await this.requireObject(context, id);
    await this.requireAllow(context, {
      action: AUDIT_ACTIONS.objectHistory,
      resourceType: RESOURCE_OBJECT,
      resourceId: id,
      resourceClassification: object.classification,
      resourceOwner: object.ownership.owner,
      riskClass: 'low',
    });
    return this.repository.withTransaction(context, (tx) => tx.listVersions(id, limit, offset));
  }

  async getProvenance(
    context: TenantContext,
    id: ObjectId,
  ): Promise<readonly ProvenanceRecord[]> {
    const object = await this.requireObject(context, id);
    await this.requireAllow(context, {
      action: AUDIT_ACTIONS.objectRead,
      resourceType: RESOURCE_OBJECT,
      resourceId: id,
      resourceClassification: object.classification,
      resourceOwner: object.ownership.owner,
      riskClass: 'low',
    });
    return this.repository.withTransaction(context, (tx) => tx.listProvenance(id));
  }

  /* ============================================================ relationships */

  async createRelationship(
    context: TenantContext,
    input: CreateRelationshipInput,
  ): Promise<Relationship> {
    return this.governed({
      context,
      action: AUDIT_ACTIONS.relationshipCreate,
      targetType: RESOURCE_RELATIONSHIP,
      targetId: null,
      riskClass: 'medium',
      resourceClassification: null,
      resourceOwner: null,
      changeSummary: { type: input.type, fromId: input.fromId, toId: input.toId },
      run: async (tx) => {
        // Both endpoints must exist within this tenant. A missing endpoint is reported as a
        // validation issue rather than a 404 so the caller learns which end was wrong (AC-07).
        const issues: FieldIssue[] = [];
        const from = await tx.findObject(input.fromId);
        if (from === null) {
          issues.push({
            field: 'fromId',
            rule: 'unknown_reference',
            message: 'fromId does not reference an existing object',
          });
        }
        const to = await tx.findObject(input.toId);
        if (to === null) {
          issues.push({
            field: 'toId',
            rule: 'unknown_reference',
            message: 'toId does not reference an existing object',
          });
        }
        if (issues.length > 0) throw new ValidationError(issues);

        if (await tx.relationshipExists(input.fromId, input.toId, input.type)) {
          throw new ConflictError(
            'duplicate_relationship',
            `A '${input.type}' relationship already exists between these objects`,
          );
        }

        const now = this.clock.nowIso();
        const relationship: Relationship = {
          id: newRelationshipId(),
          tenantId: context.tenantId,
          fromId: input.fromId,
          toId: input.toId,
          type: input.type,
          createdAt: now,
          createdBy: context.principal.id,
          validFrom: input.validFrom ?? null,
          validTo: input.validTo ?? null,
          confidence: input.confidence ?? null,
          attributes: input.attributes ?? {},
        };

        const stored = await tx.insertRelationship(input, relationship);

        await tx.appendEvent(
          this.buildEvent(
            context,
            EVENT_TYPES.relationshipCreated,
            RESOURCE_RELATIONSHIP,
            stored.id,
            [stored.fromId, stored.toId],
            { type: stored.type, fromId: stored.fromId, toId: stored.toId },
          ),
        );

        return {
          result: stored,
          resultingVersion: null,
          targetId: stored.id,
          changeSummary: {
            relationshipId: stored.id,
            type: stored.type,
            fromId: stored.fromId,
            toId: stored.toId,
          },
        };
      },
    });
  }

  async removeRelationship(context: TenantContext, id: RelationshipId): Promise<void> {
    return this.governed({
      context,
      action: AUDIT_ACTIONS.relationshipDelete,
      targetType: RESOURCE_RELATIONSHIP,
      targetId: id,
      riskClass: 'high',
      resourceClassification: null,
      resourceOwner: null,
      changeSummary: { relationshipId: id },
      run: async (tx) => {
        const existing = await tx.findRelationship(id);
        if (existing === null) throw new NotFoundError(RESOURCE_RELATIONSHIP, id);

        const removed = await tx.removeRelationship(id);
        if (!removed) throw new NotFoundError(RESOURCE_RELATIONSHIP, id);

        await tx.appendEvent(
          this.buildEvent(
            context,
            EVENT_TYPES.relationshipRemoved,
            RESOURCE_RELATIONSHIP,
            id,
            [existing.fromId, existing.toId],
            { type: existing.type, fromId: existing.fromId, toId: existing.toId },
          ),
        );

        return {
          result: undefined,
          resultingVersion: null,
          changeSummary: {
            relationshipId: id,
            type: existing.type,
            fromId: existing.fromId,
            toId: existing.toId,
          },
        };
      },
    });
  }

  async listRelationships(
    context: TenantContext,
    query: RelationshipQuery,
  ): Promise<Page<Relationship>> {
    await this.requireAllow(context, {
      action: AUDIT_ACTIONS.relationshipQuery,
      resourceType: RESOURCE_RELATIONSHIP,
      resourceId: null,
      resourceClassification: null,
      resourceOwner: null,
      riskClass: 'low',
    });
    return this.repository.withTransaction(context, (tx) => tx.listRelationships(query));
  }

  /** SPEC-0005: "query its neighborhood". */
  async getNeighbourhood(
    context: TenantContext,
    id: ObjectId,
    limit: number,
  ): Promise<Neighbourhood> {
    await this.requireObject(context, id);
    await this.requireAllow(context, {
      action: AUDIT_ACTIONS.relationshipQuery,
      resourceType: RESOURCE_RELATIONSHIP,
      resourceId: id,
      resourceClassification: null,
      resourceOwner: null,
      riskClass: 'low',
    });

    return this.repository.withTransaction(context, async (tx) => {
      const outbound = await tx.listRelationships({ fromId: id, limit, offset: 0 });
      const inbound = await tx.listRelationships({ toId: id, limit, offset: 0 });
      return { objectId: id, outbound: outbound.items, inbound: inbound.items };
    });
  }

  /* =================================================================== audit */

  async queryAudit(context: TenantContext, query: AuditQuery): Promise<Page<AuditRecord>> {
    await this.requireAllow(context, {
      action: 'audit.query',
      resourceType: RESOURCE_AUDIT,
      resourceId: null,
      resourceClassification: 'confidential',
      resourceOwner: null,
      riskClass: 'medium',
    });
    return this.repository.withTransaction(context, (tx) => tx.queryAudit(query));
  }

  /* ================================================================ internals */

  /**
   * Reject attribute bags carrying credential material.
   *
   * Throws inside the governed transaction so the attempt is audited as an error and rolled
   * back. The audit change summary never includes the attribute bag, so the rejected secret
   * is not written anywhere.
   */
  private assertNoSecretMaterial(
    attributes: Readonly<Record<string, unknown>> | undefined,
  ): void {
    if (attributes === undefined) return;
    const issues = findSecretMaterial(attributes, 'attributes');
    if (issues.length > 0) throw new ValidationError(issues);
  }

  private async requireObject(context: TenantContext, id: ObjectId): Promise<KnowledgeObject> {
    const object = await this.repository.withTransaction(context, (tx) => tx.findObject(id));
    if (object === null) throw new NotFoundError(RESOURCE_OBJECT, id);
    return object;
  }

  private effectiveClassification(
    current: KnowledgeObject,
    patch: UpdateObjectInput,
  ): Classification {
    const requested = patch.classification;
    if (requested === undefined) return current.classification;
    // Higher of the two, so a downgrade in the same request cannot dodge a restricted rule.
    const rank: Record<Classification, number> = {
      public: 0,
      internal: 1,
      confidential: 2,
      restricted: 3,
    };
    return rank[requested] > rank[current.classification] ? requested : current.classification;
  }

  /**
   * Reads are not audited wholesale — SPEC-0006 scopes audit to security-sensitive,
   * administrative, and agent-driven activity, and auditing every read would bury that signal.
   *
   * Reads ARE audited when the actor is an agent (ADR-0011 requires agent activity to be
   * auditable) or the resource is Restricted (data-classification.md).
   */
  private shouldAuditRead(context: TenantContext, classification: Classification): boolean {
    return context.actorType === 'agent' || classification === 'restricted';
  }

  private selfProvenance(context: TenantContext): CreateProvenanceInput {
    const sourceType =
      context.actorType === 'agent'
        ? 'agent_proposal'
        : context.actorType === 'service'
          ? 'service'
          : 'human_input';
    return {
      sourceId: context.principal.id,
      sourceType,
      sourceLocation: null,
      observedAt: null,
      transformation: null,
      connector: null,
      confidence: null,
      validationState: 'unvalidated',
      evidenceRef: context.correlationId,
    };
  }

  private buildEvent(
    context: TenantContext,
    type: string,
    subjectType: string,
    subjectId: string,
    relatedIds: readonly string[],
    payload: Record<string, unknown>,
  ): EventEnvelope {
    return {
      id: newEventId(),
      type,
      occurredAt: this.clock.nowIso(),
      producer: KERNEL_PRODUCER,
      producedBy: context.principal.id,
      tenantId: context.tenantId,
      subjectType,
      subjectId,
      relatedIds,
      correlationId: context.correlationId,
      causationId: null,
      payloadVersion: KERNEL_PAYLOAD_VERSION,
      payload: redact(payload) as Record<string, unknown>,
    };
  }

  private buildAudit(
    context: TenantContext,
    params: {
      action: string;
      targetType: string;
      targetId: string | null;
      decision: PolicyDecision;
      outcome: AuditOutcome;
      errorCode: string | null;
      changeSummary: Record<string, unknown>;
      resultingVersion: number | null;
    },
  ): AuditRecord {
    return {
      id: newAuditId(),
      tenantId: context.tenantId,
      occurredAt: this.clock.nowIso(),
      actorId: context.principal.id,
      actorType: context.principal.actorType,
      delegatedBy: context.principal.delegatedBy,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      policyDecision: params.decision.effect,
      policyVersion: params.decision.policyVersion,
      policyReason: params.decision.reason,
      correlationId: context.correlationId,
      causationId: null,
      outcome: params.outcome,
      errorCode: params.errorCode,
      // Redaction is applied here, at the boundary, so no caller can forget it.
      changeSummary: redact(params.changeSummary) as Record<string, unknown>,
      resultingVersion: params.resultingVersion,
    };
  }

  /** Authorize a non-mutating action, throwing on anything but allow. */
  private async requireAllow(
    context: TenantContext,
    params: {
      action: string;
      resourceType: string;
      resourceId: string | null;
      resourceClassification: Classification | null;
      resourceOwner: string | null;
      riskClass: 'low' | 'medium' | 'high';
    },
  ): Promise<PolicyDecision> {
    const decision = await this.policy.authorize({
      subject: context.principal,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      resourceClassification: params.resourceClassification,
      resourceOwner: params.resourceOwner,
      tenantId: context.tenantId,
      environment: this.environment,
      riskClass: params.riskClass,
    });

    if (decision.effect === 'deny') {
      throw new AuthorizationError(params.action, decision.policyVersion, decision.reason);
    }
    if (decision.effect === 'approval_required') {
      throw new ApprovalRequiredError(params.action, decision.policyVersion);
    }
    return decision;
  }

  /**
   * Run a governed mutation.
   *
   * Audit is written on every path — allow, deny, approval-required, and error. Denials and
   * errors are audited in their OWN transaction, because the transaction carrying the failed
   * mutation is rolled back and would take the evidence with it. SPEC-0006 requires the
   * evidence to survive the failure.
   */
  private async governed<T>(params: GovernedParams<T>): Promise<T> {
    const { context } = params;

    const decision = await this.policy.authorize({
      subject: context.principal,
      action: params.action,
      resourceType: params.targetType,
      resourceId: params.targetId,
      resourceClassification: params.resourceClassification,
      resourceOwner: params.resourceOwner,
      tenantId: context.tenantId,
      environment: this.environment,
      riskClass: params.riskClass,
    });

    if (decision.effect !== 'allow') {
      const outcome: AuditOutcome =
        decision.effect === 'deny' ? 'denied' : 'approval_required';
      await this.writeStandaloneAudit(context, {
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        decision,
        outcome,
        errorCode: decision.effect,
        changeSummary: params.changeSummary,
        resultingVersion: null,
      });

      this.logger.warn('authorization.denied', {
        action: params.action,
        effect: decision.effect,
        matchedRule: decision.matchedRule,
        ...context.describe(),
      });

      throw decision.effect === 'deny'
        ? new AuthorizationError(params.action, decision.policyVersion, decision.reason)
        : new ApprovalRequiredError(params.action, decision.policyVersion);
    }

    try {
      return await this.repository.withTransaction(context, async (tx) => {
        const outcome = await params.run(tx, decision);

        await tx.appendAudit(
          this.buildAudit(context, {
            action: params.action,
            targetType: params.targetType,
            targetId: outcome.targetId ?? params.targetId,
            decision,
            outcome: 'success',
            errorCode: null,
            changeSummary: outcome.changeSummary ?? params.changeSummary,
            resultingVersion: outcome.resultingVersion,
          }),
        );

        return outcome.result;
      });
    } catch (error) {
      await this.auditFailure(context, params, decision, error);
      throw error;
    }
  }

  private async auditFailure<T>(
    context: TenantContext,
    params: GovernedParams<T>,
    decision: PolicyDecision,
    error: unknown,
  ): Promise<void> {
    const errorCode =
      error instanceof VersionConflictError
        ? error.code
        : error instanceof ValidationError
          ? error.code
          : error instanceof NotFoundError
            ? error.code
            : error instanceof ConflictError
              ? error.code
              : 'internal_error';

    try {
      await this.writeStandaloneAudit(context, {
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        decision,
        outcome: 'error',
        errorCode,
        changeSummary: params.changeSummary,
        resultingVersion: null,
      });
    } catch (auditError) {
      // Never let an audit-write failure mask the original error. Log loudly instead:
      // a silent gap in the audit trail is itself a security event.
      this.logger.error('audit.write_failed', {
        action: params.action,
        originalErrorCode: errorCode,
        auditError: auditError instanceof Error ? auditError.message : String(auditError),
        ...context.describe(),
      });
    }
  }

  private async writeStandaloneAudit(
    context: TenantContext,
    params: Parameters<KnowledgeService['buildAudit']>[1],
  ): Promise<void> {
    const record = this.buildAudit(context, params);
    await this.repository.withTransaction(context, (tx) => tx.appendAudit(record));
  }
}
