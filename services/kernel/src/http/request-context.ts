/**
 * Per-request context.
 *
 * Source: WP-0001 scope item 13 (structured logging and correlation IDs),
 *         docs/operations/observability.md "Required Correlation".
 */

import type { TenantContext } from '../domain/principal.ts';
import type { CorrelationId } from '../domain/identifiers.ts';

export type RequestContext = {
  readonly method: string;
  readonly path: string;
  readonly query: URLSearchParams;
  /** Lower-cased header names. */
  readonly headers: Readonly<Record<string, string>>;
  /** Parsed JSON body, or undefined for bodyless requests. */
  readonly body: unknown;
  readonly correlationId: CorrelationId;
  /** Null on public routes (health/readiness) and before authentication has run. */
  readonly tenantContext: TenantContext | null;
};
