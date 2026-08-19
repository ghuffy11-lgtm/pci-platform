/**
 * Domain error taxonomy.
 *
 * Source: WP-0001 AC-07 (deterministic rejection),
 *         docs/architecture/api-and-event-standards.md ("Errors are structured and machine-readable").
 *
 * Every error carries a stable machine-readable `code`. The HTTP layer maps codes to
 * RFC 9457 problem documents; no other layer knows about HTTP status codes.
 */

export type FieldIssue = {
  readonly field: string;
  readonly rule: string;
  readonly message: string;
};

export class DomainError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = new.target.name;
    this.code = code;
  }
}

/** Input failed schema or invariant validation. */
export class ValidationError extends DomainError {
  readonly issues: readonly FieldIssue[];

  constructor(issues: readonly FieldIssue[]) {
    super('validation_failed', `Request failed validation (${issues.length} issue(s))`);
    this.issues = issues;
  }
}

/**
 * The resource does not exist *within the caller's tenant*.
 *
 * Per ADR-0016 this is also raised when the resource exists in another tenant: reporting
 * "forbidden" would confirm the identifier exists and leak cross-tenant information.
 */
export class NotFoundError extends DomainError {
  readonly resourceType: string;
  readonly resourceId: string;

  constructor(resourceType: string, resourceId: string) {
    super('not_found', `${resourceType} not found`);
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }
}

/** Authentication was absent, malformed, or unverifiable. */
export class UnauthenticatedError extends DomainError {
  constructor(message = 'Authentication required') {
    super('unauthenticated', message);
  }
}

/** Authenticated, but policy denied the action. */
export class AuthorizationError extends DomainError {
  readonly action: string;
  readonly policyVersion: string;

  constructor(action: string, policyVersion: string, message = 'Action not permitted') {
    super('forbidden', message);
    this.action = action;
    this.policyVersion = policyVersion;
  }
}

/**
 * Policy requires explicit human approval before this action may proceed.
 * Source: SPEC-0011 ("auditable allow, deny, or approval-required decision"), ADR-0011.
 */
export class ApprovalRequiredError extends DomainError {
  readonly action: string;
  readonly policyVersion: string;

  constructor(action: string, policyVersion: string) {
    super('approval_required', `Action '${action}' requires explicit approval`);
    this.action = action;
    this.policyVersion = policyVersion;
  }
}

/** Optimistic concurrency failure: the object changed since the caller read it. */
export class VersionConflictError extends DomainError {
  readonly expectedVersion: number;
  readonly actualVersion: number;

  constructor(expectedVersion: number, actualVersion: number) {
    super('version_conflict', 'Object was modified by another request');
    this.expectedVersion = expectedVersion;
    this.actualVersion = actualVersion;
  }
}

/** An invariant that is legal to express but illegal in the current state. */
export class ConflictError extends DomainError {
  constructor(code: string, message: string) {
    super(code, message);
  }
}

/** A declared seam that is deliberately not implemented in this work package. */
export class NotImplementedError extends DomainError {
  constructor(what: string, reference: string) {
    super('not_implemented', `${what} is not implemented. See ${reference}.`);
  }
}
