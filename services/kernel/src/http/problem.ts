/**
 * RFC 9457 "Problem Details for HTTP APIs" responses.
 *
 * Source: docs/architecture/api-and-event-standards.md — "Errors are structured and
 *         machine-readable"; WP-0001 AC-07 (deterministic rejection).
 *
 * A standard error format was chosen over a bespoke one per Constitution principle 4
 * (Integrate Before Invent) and ADR-0002.
 *
 * SECURITY: problem documents are returned to callers, so they must never contain stack
 * traces, SQL, connection details, or internal messages. Unexpected errors collapse to a
 * generic 500 whose detail is a fixed string; the real error goes to the log with the
 * correlation ID so an operator can still find it.
 */

import {
  ApprovalRequiredError,
  AuthorizationError,
  ConflictError,
  DomainError,
  NotFoundError,
  NotImplementedError,
  UnauthenticatedError,
  ValidationError,
  VersionConflictError,
} from '../domain/errors.ts';
import { ConfigError } from '../config/config.ts';

export const PROBLEM_CONTENT_TYPE = 'application/problem+json';

/** Problem type URIs are stable identifiers, not resolvable URLs (RFC 9457 permits this). */
const TYPE_BASE = 'https://pci.dev/problems';

export type Problem = {
  readonly type: string;
  readonly title: string;
  readonly status: number;
  readonly detail: string;
  readonly instance: string;
  readonly correlationId: string;
  readonly code: string;
  readonly errors?: readonly { field: string; rule: string; message: string }[];
  readonly expectedVersion?: number;
  readonly actualVersion?: number;
  readonly policyVersion?: string;
};

export type ProblemResult = {
  readonly problem: Problem;
  readonly headers: Record<string, string>;
  /** Non-null when the error should be logged at error level with its original message. */
  readonly internalDetail: string | null;
};

export function toProblem(
  error: unknown,
  instance: string,
  correlationId: string,
): ProblemResult {
  const base = { instance, correlationId };

  if (error instanceof ValidationError) {
    return {
      problem: {
        ...base,
        type: `${TYPE_BASE}/validation-failed`,
        title: 'Request validation failed',
        status: 400,
        detail: error.message,
        code: error.code,
        errors: error.issues,
      },
      headers: {},
      internalDetail: null,
    };
  }

  if (error instanceof UnauthenticatedError) {
    return {
      problem: {
        ...base,
        type: `${TYPE_BASE}/unauthenticated`,
        title: 'Authentication required',
        status: 401,
        // Deliberately uniform: distinguishing "absent" from "invalid" from "expired" would
        // turn this endpoint into a credential oracle.
        detail: 'A valid bearer credential is required.',
        code: error.code,
      },
      headers: { 'WWW-Authenticate': 'Bearer realm="pci-kernel"' },
      internalDetail: null,
    };
  }

  if (error instanceof ApprovalRequiredError) {
    return {
      problem: {
        ...base,
        type: `${TYPE_BASE}/approval-required`,
        title: 'Explicit approval required',
        status: 403,
        detail: error.message,
        code: error.code,
        policyVersion: error.policyVersion,
      },
      headers: {},
      internalDetail: null,
    };
  }

  if (error instanceof AuthorizationError) {
    return {
      problem: {
        ...base,
        type: `${TYPE_BASE}/forbidden`,
        title: 'Action not permitted',
        status: 403,
        detail: error.message,
        code: error.code,
        policyVersion: error.policyVersion,
      },
      headers: {},
      internalDetail: null,
    };
  }

  if (error instanceof NotFoundError) {
    return {
      problem: {
        ...base,
        type: `${TYPE_BASE}/not-found`,
        title: 'Resource not found',
        status: 404,
        // ADR-0016: a cross-tenant hit reaches this branch too. The response must be
        // indistinguishable from a genuinely absent resource.
        detail: `The requested ${error.resourceType} does not exist.`,
        code: error.code,
      },
      headers: {},
      internalDetail: null,
    };
  }

  if (error instanceof VersionConflictError) {
    return {
      problem: {
        ...base,
        type: `${TYPE_BASE}/version-conflict`,
        title: 'Version conflict',
        status: 409,
        detail:
          'The object was modified by another request. Re-read it and retry with the current version.',
        code: error.code,
        expectedVersion: error.expectedVersion,
        actualVersion: error.actualVersion,
      },
      headers: {},
      internalDetail: null,
    };
  }

  if (error instanceof ConflictError) {
    return {
      problem: {
        ...base,
        type: `${TYPE_BASE}/conflict`,
        title: 'Conflicting request',
        status: 409,
        detail: error.message,
        code: error.code,
      },
      headers: {},
      internalDetail: null,
    };
  }

  if (error instanceof NotImplementedError) {
    return {
      problem: {
        ...base,
        type: `${TYPE_BASE}/not-implemented`,
        title: 'Not implemented',
        status: 501,
        detail: error.message,
        code: error.code,
      },
      headers: {},
      internalDetail: error.message,
    };
  }

  if (error instanceof ConfigError) {
    // Reaching here at request time means startup validation was bypassed. Never echo the
    // configuration problems to a caller.
    return {
      problem: {
        ...base,
        type: `${TYPE_BASE}/internal-error`,
        title: 'Internal server error',
        status: 500,
        detail: 'The request could not be completed.',
        code: 'internal_error',
      },
      headers: {},
      internalDetail: error.message,
    };
  }

  if (error instanceof DomainError) {
    return {
      problem: {
        ...base,
        type: `${TYPE_BASE}/${error.code.replace(/_/g, '-')}`,
        title: 'Request could not be completed',
        status: 400,
        detail: error.message,
        code: error.code,
      },
      headers: {},
      internalDetail: null,
    };
  }

  return {
    problem: {
      ...base,
      type: `${TYPE_BASE}/internal-error`,
      title: 'Internal server error',
      status: 500,
      detail: 'The request could not be completed.',
      code: 'internal_error',
    },
    headers: {},
    internalDetail: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
  };
}

/** Build a problem for a condition detected in the transport layer. */
export function transportProblem(
  status: number,
  code: string,
  title: string,
  detail: string,
  instance: string,
  correlationId: string,
): Problem {
  return {
    type: `${TYPE_BASE}/${code.replace(/_/g, '-')}`,
    title,
    status,
    detail,
    instance,
    correlationId,
    code,
  };
}
