/**
 * Deterministic input validation.
 *
 * Source: WP-0001 AC-07 — "Invalid object types, malformed relationships, missing required
 *         fields, and unauthorized operations are rejected deterministically."
 *
 * Determinism here means: the same input always produces the same issue list, in the same
 * order, with stable `rule` codes. Validation collects ALL issues rather than failing on the
 * first, so a caller can correct a request in one round trip.
 *
 * This module is pure. It performs no I/O and knows nothing about HTTP or storage.
 */

import type { FieldIssue } from './errors.ts';
import { ValidationError } from './errors.ts';
import {
  findAttributeShapeIssues,
  findSecretMaterial,
} from './secret-guard.ts';
import {
  canTransition,
  isClassification,
  isLifecycleState,
  isObjectType,
  isRelationshipType,
  isSourceType,
  isValidationState,
  LIFECYCLE_STATES,
  OBJECT_TYPES,
  CLASSIFICATIONS,
} from './vocabulary.ts';
import type { LifecycleState } from './vocabulary.ts';
import type { CreateObjectInput, Ownership, UpdateObjectInput } from './knowledge-object.ts';
import type { CreateRelationshipInput } from './relationship.ts';
import type { CreateProvenanceInput } from './provenance.ts';
import { isUuid } from './identifiers.ts';

const MAX_NAME_LENGTH = 512;
const MAX_IDENTIFIER_LENGTH = 256;

/* ------------------------------------------------------------------- primitives */

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Strict ISO-8601 instant check.
 *
 * `new Date(...)` alone is unacceptably permissive — it accepts "2026" and many locale
 * strings — so the format is pattern-checked first and then confirmed to be a real instant.
 */
const ISO_INSTANT =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;

export function isIsoInstant(value: unknown): value is string {
  if (typeof value !== 'string' || !ISO_INSTANT.test(value)) return false;
  return Number.isFinite(Date.parse(value));
}

function checkRequiredString(
  value: unknown,
  field: string,
  maxLength: number,
  issues: FieldIssue[],
): void {
  if (value === undefined || value === null) {
    issues.push({ field, rule: 'required', message: `${field} is required` });
    return;
  }
  if (typeof value !== 'string') {
    issues.push({ field, rule: 'type', message: `${field} must be a string` });
    return;
  }
  if (value.trim().length === 0) {
    issues.push({ field, rule: 'not_blank', message: `${field} must not be blank` });
    return;
  }
  if (value.length > maxLength) {
    issues.push({
      field,
      rule: 'max_length',
      message: `${field} must be at most ${maxLength} characters (got ${value.length})`,
    });
  }
}

function checkOptionalInstant(value: unknown, field: string, issues: FieldIssue[]): void {
  if (value === undefined || value === null) return;
  if (!isIsoInstant(value)) {
    issues.push({
      field,
      rule: 'iso_instant',
      message: `${field} must be an ISO-8601 instant, for example 2026-08-19T10:30:00Z`,
    });
  }
}

function checkValidityWindow(
  validFrom: unknown,
  validTo: unknown,
  issues: FieldIssue[],
): void {
  if (!isIsoInstant(validFrom) || !isIsoInstant(validTo)) return;
  if (Date.parse(validTo) <= Date.parse(validFrom)) {
    issues.push({
      field: 'validTo',
      rule: 'range',
      message: 'validTo must be strictly after validFrom',
    });
  }
}

function checkConfidence(value: unknown, field: string, issues: FieldIssue[]): void {
  if (value === undefined || value === null) return;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    issues.push({ field, rule: 'type', message: `${field} must be a finite number` });
    return;
  }
  if (value < 0 || value > 1) {
    issues.push({ field, rule: 'range', message: `${field} must be between 0 and 1 inclusive` });
  }
}

function checkOwnership(value: unknown, issues: FieldIssue[]): void {
  if (value === undefined || value === null) {
    issues.push({ field: 'ownership', rule: 'required', message: 'ownership is required' });
    return;
  }
  if (!isPlainObject(value)) {
    issues.push({ field: 'ownership', rule: 'type', message: 'ownership must be an object' });
    return;
  }
  checkRequiredString(
    value['organization'],
    'ownership.organization',
    MAX_IDENTIFIER_LENGTH,
    issues,
  );
  checkRequiredString(value['owner'], 'ownership.owner', MAX_IDENTIFIER_LENGTH, issues);
}

function checkAttributes(value: unknown, issues: FieldIssue[]): void {
  if (value === undefined || value === null) return;
  const shapeIssues = findAttributeShapeIssues(value, 'attributes');
  if (shapeIssues.length > 0) {
    issues.push(...shapeIssues);
    return;
  }
  issues.push(...findSecretMaterial(value as Record<string, unknown>, 'attributes'));
}

/* --------------------------------------------------------------- object: create */

export type ValidatedCreateObject = CreateObjectInput & {
  readonly status: LifecycleState;
  readonly ownership: Ownership;
};

export function validateCreateObject(body: unknown): ValidatedCreateObject {
  const issues: FieldIssue[] = [];

  if (!isPlainObject(body)) {
    throw new ValidationError([
      { field: '(body)', rule: 'type', message: 'Request body must be a JSON object' },
    ]);
  }

  // Type — controlled by the registry (canonical-object-schema invariant 2).
  if (body['type'] === undefined || body['type'] === null) {
    issues.push({ field: 'type', rule: 'required', message: 'type is required' });
  } else if (!isObjectType(body['type'])) {
    issues.push({
      field: 'type',
      rule: 'enum',
      message: `type must be one of: ${OBJECT_TYPES.join(', ')}`,
    });
  }

  checkRequiredString(body['name'], 'name', MAX_NAME_LENGTH, issues);

  // Status defaults to the first lifecycle state when omitted.
  if (body['status'] !== undefined && body['status'] !== null) {
    if (!isLifecycleState(body['status'])) {
      issues.push({
        field: 'status',
        rule: 'enum',
        message: `status must be one of: ${LIFECYCLE_STATES.join(', ')}`,
      });
    } else if (body['status'] === 'retired') {
      issues.push({
        field: 'status',
        rule: 'illegal_initial_state',
        message: 'An object cannot be created in the retired state',
      });
    }
  }

  checkOwnership(body['ownership'], issues);

  if (body['classification'] === undefined || body['classification'] === null) {
    issues.push({
      field: 'classification',
      rule: 'required',
      message: 'classification is required',
    });
  } else if (!isClassification(body['classification'])) {
    issues.push({
      field: 'classification',
      rule: 'enum',
      message: `classification must be one of: ${CLASSIFICATIONS.join(', ')}`,
    });
  }

  checkOptionalInstant(body['validFrom'], 'validFrom', issues);
  checkOptionalInstant(body['validTo'], 'validTo', issues);
  checkValidityWindow(body['validFrom'], body['validTo'], issues);
  checkAttributes(body['attributes'], issues);

  if (issues.length > 0) throw new ValidationError(issues);

  const status = (body['status'] as LifecycleState | undefined) ?? 'proposed';

  return {
    type: body['type'] as ValidatedCreateObject['type'],
    name: (body['name'] as string).trim(),
    status,
    ownership: {
      organization: (
        (body['ownership'] as Record<string, unknown>)['organization'] as string
      ).trim(),
      owner: ((body['ownership'] as Record<string, unknown>)['owner'] as string).trim(),
    },
    classification: body['classification'] as ValidatedCreateObject['classification'],
    validFrom: (body['validFrom'] as string | undefined) ?? null,
    validTo: (body['validTo'] as string | undefined) ?? null,
    attributes: (body['attributes'] as Record<string, unknown> | undefined) ?? {},
  };
}

/* --------------------------------------------------------------- object: update */

export function validateUpdateObject(
  body: unknown,
  currentStatus: LifecycleState,
): UpdateObjectInput {
  const issues: FieldIssue[] = [];

  if (!isPlainObject(body)) {
    throw new ValidationError([
      { field: '(body)', rule: 'type', message: 'Request body must be a JSON object' },
    ]);
  }

  // Reject attempts to mutate immutable fields explicitly rather than ignoring them.
  // Silently discarding a caller's `type` change would be a correctness trap.
  for (const immutable of ['id', 'tenantId', 'type', 'version', 'createdAt', 'createdBy']) {
    if (immutable in body) {
      issues.push({
        field: immutable,
        rule: 'immutable',
        message: `${immutable} cannot be modified after creation`,
      });
    }
  }

  if ('name' in body) {
    checkRequiredString(body['name'], 'name', MAX_NAME_LENGTH, issues);
  }

  if ('status' in body) {
    if (!isLifecycleState(body['status'])) {
      issues.push({
        field: 'status',
        rule: 'enum',
        message: `status must be one of: ${LIFECYCLE_STATES.join(', ')}`,
      });
    } else if (!canTransition(currentStatus, body['status'])) {
      issues.push({
        field: 'status',
        rule: 'illegal_transition',
        message: `Cannot transition from '${currentStatus}' to '${body['status']}'`,
      });
    }
  }

  if ('ownership' in body) checkOwnership(body['ownership'], issues);

  if ('classification' in body && !isClassification(body['classification'])) {
    issues.push({
      field: 'classification',
      rule: 'enum',
      message: `classification must be one of: ${CLASSIFICATIONS.join(', ')}`,
    });
  }

  checkOptionalInstant(body['validFrom'], 'validFrom', issues);
  checkOptionalInstant(body['validTo'], 'validTo', issues);
  checkValidityWindow(body['validFrom'], body['validTo'], issues);
  if ('attributes' in body) checkAttributes(body['attributes'], issues);

  if (issues.length > 0) throw new ValidationError(issues);

  const patch: Record<string, unknown> = {};
  if ('name' in body) patch['name'] = (body['name'] as string).trim();
  if ('status' in body) patch['status'] = body['status'];
  if ('ownership' in body) {
    const ownership = body['ownership'] as Record<string, unknown>;
    patch['ownership'] = {
      organization: (ownership['organization'] as string).trim(),
      owner: (ownership['owner'] as string).trim(),
    };
  }
  if ('classification' in body) patch['classification'] = body['classification'];
  if ('validFrom' in body) patch['validFrom'] = body['validFrom'] ?? null;
  if ('validTo' in body) patch['validTo'] = body['validTo'] ?? null;
  if ('attributes' in body) patch['attributes'] = body['attributes'];

  return patch as UpdateObjectInput;
}

/* ----------------------------------------------------------------- relationship */

export function validateCreateRelationship(body: unknown): CreateRelationshipInput {
  const issues: FieldIssue[] = [];

  if (!isPlainObject(body)) {
    throw new ValidationError([
      { field: '(body)', rule: 'type', message: 'Request body must be a JSON object' },
    ]);
  }

  for (const field of ['fromId', 'toId'] as const) {
    const value = body[field];
    if (value === undefined || value === null) {
      issues.push({ field, rule: 'required', message: `${field} is required` });
    } else if (typeof value !== 'string' || !isUuid(value)) {
      issues.push({ field, rule: 'format', message: `${field} must be a UUID` });
    }
  }

  if (body['type'] === undefined || body['type'] === null) {
    issues.push({ field: 'type', rule: 'required', message: 'type is required' });
  } else if (!isRelationshipType(body['type'])) {
    issues.push({
      field: 'type',
      rule: 'enum',
      message:
        'type must be a relationship type from docs/knowledge/relationship-taxonomy.md',
    });
  }

  // A self-referential relationship carries no meaning in the taxonomy and is almost always
  // a client defect, so it is rejected rather than stored.
  if (
    typeof body['fromId'] === 'string' &&
    body['fromId'] === body['toId']
  ) {
    issues.push({
      field: 'toId',
      rule: 'self_reference',
      message: 'A relationship must connect two distinct objects',
    });
  }

  checkOptionalInstant(body['validFrom'], 'validFrom', issues);
  checkOptionalInstant(body['validTo'], 'validTo', issues);
  checkValidityWindow(body['validFrom'], body['validTo'], issues);
  checkConfidence(body['confidence'], 'confidence', issues);
  checkAttributes(body['attributes'], issues);

  if (issues.length > 0) throw new ValidationError(issues);

  return {
    fromId: body['fromId'] as CreateRelationshipInput['fromId'],
    toId: body['toId'] as CreateRelationshipInput['toId'],
    type: body['type'] as CreateRelationshipInput['type'],
    validFrom: (body['validFrom'] as string | undefined) ?? null,
    validTo: (body['validTo'] as string | undefined) ?? null,
    confidence: (body['confidence'] as number | undefined) ?? null,
    attributes: (body['attributes'] as Record<string, unknown> | undefined) ?? {},
  };
}

/* ------------------------------------------------------------------- provenance */

export function validateProvenance(
  value: unknown,
  fieldPrefix: string,
): CreateProvenanceInput {
  const issues: FieldIssue[] = [];

  if (!isPlainObject(value)) {
    throw new ValidationError([
      { field: fieldPrefix, rule: 'type', message: `${fieldPrefix} must be an object` },
    ]);
  }

  checkRequiredString(value['sourceId'], `${fieldPrefix}.sourceId`, MAX_IDENTIFIER_LENGTH, issues);

  if (value['sourceType'] === undefined || value['sourceType'] === null) {
    issues.push({
      field: `${fieldPrefix}.sourceType`,
      rule: 'required',
      message: 'sourceType is required',
    });
  } else if (!isSourceType(value['sourceType'])) {
    issues.push({
      field: `${fieldPrefix}.sourceType`,
      rule: 'enum',
      message: 'sourceType must be a source type from docs/knowledge/provenance-model.md',
    });
  }

  if (
    value['validationState'] !== undefined &&
    value['validationState'] !== null &&
    !isValidationState(value['validationState'])
  ) {
    issues.push({
      field: `${fieldPrefix}.validationState`,
      rule: 'enum',
      message: 'validationState must be one of: unvalidated, validated, rejected, superseded',
    });
  }

  checkOptionalInstant(value['observedAt'], `${fieldPrefix}.observedAt`, issues);
  checkConfidence(value['confidence'], `${fieldPrefix}.confidence`, issues);

  if (issues.length > 0) throw new ValidationError(issues);

  return {
    sourceId: (value['sourceId'] as string).trim(),
    sourceType: value['sourceType'] as CreateProvenanceInput['sourceType'],
    sourceLocation: (value['sourceLocation'] as string | undefined) ?? null,
    observedAt: (value['observedAt'] as string | undefined) ?? null,
    transformation: (value['transformation'] as string | undefined) ?? null,
    connector: (value['connector'] as string | undefined) ?? null,
    confidence: (value['confidence'] as number | undefined) ?? null,
    validationState: (value['validationState'] as CreateProvenanceInput['validationState']) ??
      'unvalidated',
    evidenceRef: (value['evidenceRef'] as string | undefined) ?? null,
  };
}

/**
 * Validate the optional `provenance` array on a create request.
 * Returns an empty array when absent — the service then synthesises an actor-attributed record,
 * so every object always carries provenance.
 */
export function validateProvenanceArray(value: unknown): CreateProvenanceInput[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new ValidationError([
      { field: 'provenance', rule: 'type', message: 'provenance must be an array' },
    ]);
  }
  return value.map((entry, index) => validateProvenance(entry, `provenance[${index}]`));
}

/* ------------------------------------------------------------------- pagination */

export const DEFAULT_PAGE_LIMIT = 50;
export const MAX_PAGE_LIMIT = 200;

export function validatePagination(
  rawLimit: string | null,
  rawOffset: string | null,
): { limit: number; offset: number } {
  const issues: FieldIssue[] = [];

  let limit = DEFAULT_PAGE_LIMIT;
  if (rawLimit !== null) {
    const parsed = Number(rawLimit);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_PAGE_LIMIT) {
      issues.push({
        field: 'limit',
        rule: 'range',
        message: `limit must be an integer between 1 and ${MAX_PAGE_LIMIT}`,
      });
    } else {
      limit = parsed;
    }
  }

  let offset = 0;
  if (rawOffset !== null) {
    const parsed = Number(rawOffset);
    if (!Number.isInteger(parsed) || parsed < 0) {
      issues.push({
        field: 'offset',
        rule: 'range',
        message: 'offset must be a non-negative integer',
      });
    } else {
      offset = parsed;
    }
  }

  if (issues.length > 0) throw new ValidationError(issues);
  return { limit, offset };
}
