/**
 * HTTP route handlers for the Knowledge Object API.
 *
 * Source: SPEC-0005 (Core Operations), docs/architecture/api-and-event-standards.md,
 *         WP-0001 AC-03 … AC-08.
 *
 * Handlers translate HTTP to the application service and back. They contain no authorization
 * logic, no tenant filtering, and no persistence — all three live below this layer, so an
 * error here cannot become a security bypass.
 */

import {
  NotFoundError,
  UnauthenticatedError,
  ValidationError,
} from '../domain/errors.ts';
import { toObjectId, toRelationshipId } from '../domain/identifiers.ts';
import type { ObjectId } from '../domain/identifiers.ts';
import {
  isClassification,
  isLifecycleState,
  isObjectType,
  isRelationshipType,
} from '../domain/vocabulary.ts';
import {
  isIsoInstant,
  validateCreateObject,
  validateCreateRelationship,
  validateProvenanceArray,
  validateUpdateObject,
  validatePagination,
} from '../domain/validation.ts';
import type { ObjectQuery } from '../domain/knowledge-object.ts';
import type { RelationshipQuery } from '../domain/relationship.ts';
import type { AuditQuery } from '../domain/audit.ts';
import type { KnowledgeService } from '../application/knowledge-service.ts';
import type { HttpResult, RouteParams } from './router.ts';
import type { RequestContext } from './request-context.ts';

const API = '/api/v1';

/* --------------------------------------------------------------- representations */

/**
 * Project a Knowledge Object into its wire representation.
 *
 * The canonical envelope (docs/knowledge/canonical-object-schema.md) presents `provenance` and
 * `relationships` as arrays on the object. They are stored separately — invariant 5 requires
 * relationships to reference identifiers rather than duplicate records — and are projected in
 * only on the endpoints that fetch them, so a list response never implies it carries a whole
 * neighbourhood.
 */
function objectPayload(object: {
  id: string;
  type: string;
  name: string;
  status: string;
  ownership: { organization: string; owner: string };
  classification: string;
  createdAt: string;
  updatedAt: string;
  validFrom: string | null;
  validTo: string | null;
  version: number;
  attributes: Readonly<Record<string, unknown>>;
  createdBy: string;
  updatedBy: string;
}): Record<string, unknown> {
  return {
    id: object.id,
    type: object.type,
    name: object.name,
    status: object.status,
    ownership: object.ownership,
    classification: object.classification,
    createdAt: object.createdAt,
    updatedAt: object.updatedAt,
    validFrom: object.validFrom,
    validTo: object.validTo,
    version: object.version,
    attributes: object.attributes,
    createdBy: object.createdBy,
    updatedBy: object.updatedBy,
  };
}

/* ------------------------------------------------------------------ query parsing */

function requireContext(context: RequestContext): NonNullable<RequestContext['tenantContext']> {
  if (context.tenantContext === null) throw new UnauthenticatedError();
  return context.tenantContext;
}

function parseObjectQuery(query: URLSearchParams): ObjectQuery {
  const { limit, offset } = validatePagination(query.get('limit'), query.get('offset'));
  const issues: { field: string; rule: string; message: string }[] = [];

  const type = query.get('type');
  if (type !== null && !isObjectType(type)) {
    issues.push({ field: 'type', rule: 'enum', message: 'Unknown object type' });
  }
  const status = query.get('status');
  if (status !== null && !isLifecycleState(status)) {
    issues.push({ field: 'status', rule: 'enum', message: 'Unknown lifecycle state' });
  }
  const classification = query.get('classification');
  if (classification !== null && !isClassification(classification)) {
    issues.push({ field: 'classification', rule: 'enum', message: 'Unknown classification' });
  }
  const asOf = query.get('asOf');
  if (asOf !== null && !isIsoInstant(asOf)) {
    issues.push({ field: 'asOf', rule: 'iso_instant', message: 'asOf must be an ISO-8601 instant' });
  }

  if (issues.length > 0) throw new ValidationError(issues);

  const owner = query.get('owner');
  const organization = query.get('organization');

  return {
    ...(type !== null ? { type } : {}),
    ...(status !== null ? { status } : {}),
    ...(classification !== null ? { classification } : {}),
    ...(owner !== null ? { owner } : {}),
    ...(organization !== null ? { organization } : {}),
    ...(asOf !== null ? { asOf } : {}),
    includeRetired: query.get('includeRetired') === 'true',
    limit,
    offset,
  } as ObjectQuery;
}

function parseRelationshipQuery(query: URLSearchParams): RelationshipQuery {
  const { limit, offset } = validatePagination(query.get('limit'), query.get('offset'));
  const issues: { field: string; rule: string; message: string }[] = [];

  const parseId = (name: string): string | null => {
    const raw = query.get(name);
    if (raw === null) return null;
    if (toObjectId(raw) === null) {
      issues.push({ field: name, rule: 'format', message: `${name} must be a UUID` });
      return null;
    }
    return raw;
  };

  const fromId = parseId('fromId');
  const toId = parseId('toId');
  const eitherId = parseId('eitherId');

  const type = query.get('type');
  if (type !== null && !isRelationshipType(type)) {
    issues.push({ field: 'type', rule: 'enum', message: 'Unknown relationship type' });
  }
  const asOf = query.get('asOf');
  if (asOf !== null && !isIsoInstant(asOf)) {
    issues.push({ field: 'asOf', rule: 'iso_instant', message: 'asOf must be an ISO-8601 instant' });
  }

  if (issues.length > 0) throw new ValidationError(issues);

  return {
    ...(fromId !== null ? { fromId } : {}),
    ...(toId !== null ? { toId } : {}),
    ...(eitherId !== null ? { eitherId } : {}),
    ...(type !== null ? { type } : {}),
    ...(asOf !== null ? { asOf } : {}),
    limit,
    offset,
  } as RelationshipQuery;
}

/**
 * Read and validate the `If-Match` precondition carrying the expected object version.
 *
 * Required on every mutation. api-and-event-standards.md requires idempotency behaviour to be
 * explicit; without a precondition, a retried update would silently clobber a concurrent
 * change. Absence is 428 Precondition Required, not a permissive default.
 */
function requireExpectedVersion(context: RequestContext): number {
  const header = context.headers['if-match'];
  if (header === undefined || header.trim() === '') {
    throw new ValidationError([
      {
        field: 'If-Match',
        rule: 'required',
        message:
          'If-Match header carrying the current object version is required for mutations',
      },
    ]);
  }
  const normalised = header.trim().replace(/^W\//, '').replace(/^"|"$/g, '');
  const parsed = Number(normalised);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ValidationError([
      {
        field: 'If-Match',
        rule: 'format',
        message: 'If-Match must be the object version as a positive integer, e.g. "3"',
      },
    ]);
  }
  return parsed;
}

function objectIdParam(params: RouteParams): ObjectId {
  const raw = params['id'] ?? '';
  const id = toObjectId(raw);
  if (id === null) {
    // A malformed identifier is reported as absent rather than as a validation failure, so the
    // endpoint cannot be used to probe which identifier formats exist.
    throw new NotFoundError('knowledge_object', raw);
  }
  return id;
}

/* ------------------------------------------------------------------------ handlers */

export function createRouteHandlers(service: KnowledgeService) {
  return {
    /* ------------------------------------------------------------- objects */

    async createObject(context: RequestContext): Promise<HttpResult> {
      const tenantContext = requireContext(context);
      const body = context.body;
      const input = validateCreateObject(body);
      const provenance = validateProvenanceArray(
        typeof body === 'object' && body !== null
          ? (body as Record<string, unknown>)['provenance']
          : undefined,
      );

      const created = await service.createObject(tenantContext, input, provenance);

      return {
        status: 201,
        headers: {
          Location: `${API}/objects/${created.object.id}`,
          ETag: `"${created.object.version}"`,
        },
        body: {
          ...objectPayload(created.object),
          provenance: created.provenance,
        },
      };
    },

    async getObject(context: RequestContext, params: RouteParams): Promise<HttpResult> {
      const tenantContext = requireContext(context);
      const object = await service.getObject(tenantContext, objectIdParam(params));
      return {
        status: 200,
        headers: { ETag: `"${object.version}"` },
        body: objectPayload(object),
      };
    },

    async listObjects(context: RequestContext): Promise<HttpResult> {
      const tenantContext = requireContext(context);
      const page = await service.listObjects(tenantContext, parseObjectQuery(context.query));
      return {
        status: 200,
        body: {
          items: page.items.map(objectPayload),
          total: page.total,
          limit: page.limit,
          offset: page.offset,
        },
      };
    },

    async updateObject(context: RequestContext, params: RouteParams): Promise<HttpResult> {
      const tenantContext = requireContext(context);
      const id = objectIdParam(params);
      const expectedVersion = requireExpectedVersion(context);

      // The current status is needed to validate the lifecycle transition, so it is read
      // before validation rather than after.
      const current = await service.getObject(tenantContext, id);
      const patch = validateUpdateObject(context.body, current.status);

      const updated = await service.updateObject(tenantContext, id, patch, expectedVersion);
      return {
        status: 200,
        headers: { ETag: `"${updated.version}"` },
        body: objectPayload(updated),
      };
    },

    async retireObject(context: RequestContext, params: RouteParams): Promise<HttpResult> {
      const tenantContext = requireContext(context);
      const id = objectIdParam(params);
      const expectedVersion = requireExpectedVersion(context);
      const retired = await service.retireObject(tenantContext, id, expectedVersion);
      return {
        status: 200,
        headers: { ETag: `"${retired.version}"` },
        body: objectPayload(retired),
      };
    },

    async getObjectHistory(context: RequestContext, params: RouteParams): Promise<HttpResult> {
      const tenantContext = requireContext(context);
      const { limit, offset } = validatePagination(
        context.query.get('limit'),
        context.query.get('offset'),
      );
      const page = await service.getHistory(tenantContext, objectIdParam(params), limit, offset);
      return {
        status: 200,
        body: {
          items: page.items.map((version) => ({
            version: version.version,
            recordedAt: version.recordedAt,
            recordedBy: version.recordedBy,
            changeKind: version.changeKind,
            snapshot: objectPayload(version.snapshot),
          })),
          total: page.total,
          limit: page.limit,
          offset: page.offset,
        },
      };
    },

    async getObjectProvenance(context: RequestContext, params: RouteParams): Promise<HttpResult> {
      const tenantContext = requireContext(context);
      const records = await service.getProvenance(tenantContext, objectIdParam(params));
      return { status: 200, body: { items: records, total: records.length } };
    },

    async getObjectNeighbourhood(
      context: RequestContext,
      params: RouteParams,
    ): Promise<HttpResult> {
      const tenantContext = requireContext(context);
      const { limit } = validatePagination(context.query.get('limit'), null);
      const neighbourhood = await service.getNeighbourhood(
        tenantContext,
        objectIdParam(params),
        limit,
      );
      return { status: 200, body: neighbourhood };
    },

    /* -------------------------------------------------------- relationships */

    async createRelationship(context: RequestContext): Promise<HttpResult> {
      const tenantContext = requireContext(context);
      const input = validateCreateRelationship(context.body);
      const relationship = await service.createRelationship(tenantContext, input);
      return {
        status: 201,
        headers: { Location: `${API}/relationships/${relationship.id}` },
        body: relationship,
      };
    },

    async listRelationships(context: RequestContext): Promise<HttpResult> {
      const tenantContext = requireContext(context);
      const page = await service.listRelationships(
        tenantContext,
        parseRelationshipQuery(context.query),
      );
      return { status: 200, body: page };
    },

    async deleteRelationship(context: RequestContext, params: RouteParams): Promise<HttpResult> {
      const tenantContext = requireContext(context);
      const raw = params['id'] ?? '';
      const id = toRelationshipId(raw);
      if (id === null) throw new NotFoundError('relationship', raw);
      await service.removeRelationship(tenantContext, id);
      return { status: 204 };
    },

    /* ----------------------------------------------------------------- audit */

    async queryAudit(context: RequestContext): Promise<HttpResult> {
      const tenantContext = requireContext(context);
      const { limit, offset } = validatePagination(
        context.query.get('limit'),
        context.query.get('offset'),
      );

      const query: AuditQuery = {
        ...(context.query.get('action') !== null
          ? { action: context.query.get('action') as string }
          : {}),
        ...(context.query.get('targetId') !== null
          ? { targetId: context.query.get('targetId') as string }
          : {}),
        limit,
        offset,
      };

      const page = await service.queryAudit(tenantContext, query);
      return { status: 200, body: page };
    },
  };
}

export const API_BASE = API;
