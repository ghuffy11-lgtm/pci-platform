/**
 * HTTP transport.
 *
 * Source: WP-0001 scope items 10, 11, 13; AC-08 (health without secret disclosure);
 *         docs/architecture/api-and-event-standards.md.
 *
 * Responsibilities, and nothing else: read the request, authenticate, dispatch, serialise the
 * result, emit an access log. Authorization, tenancy, and persistence all live below.
 */

import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';

import { UnauthenticatedError } from '../domain/errors.ts';
import { newCorrelationId, isUuid } from '../domain/identifiers.ts';
import type { CorrelationId } from '../domain/identifiers.ts';
import { TenantContext } from '../domain/principal.ts';
import type { KnowledgeService } from '../application/knowledge-service.ts';
import type { IdentityProvider } from '../ports/identity.ts';
import type { PolicyEngine } from '../ports/policy.ts';
import type { KnowledgeRepository } from '../ports/knowledge-repository.ts';
import type { Logger } from '../observability/logger.ts';
import type { KernelConfig } from '../config/config.ts';
import { describeConfig } from '../config/config.ts';
import { MatchKind, Router } from './router.ts';
import type { HttpResult } from './router.ts';
import { PROBLEM_CONTENT_TYPE, toProblem, transportProblem } from './problem.ts';
import type { Problem } from './problem.ts';
import type { RequestContext } from './request-context.ts';
import { API_BASE, createRouteHandlers } from './routes.ts';

const JSON_CONTENT_TYPE = 'application/json';

export type KernelServerDeps = {
  readonly config: KernelConfig;
  readonly service: KnowledgeService;
  readonly identity: IdentityProvider;
  readonly policy: PolicyEngine;
  readonly repository: KnowledgeRepository;
  readonly logger: Logger;
  readonly startedAt: number;
  readonly version: string;
};

/**
 * Correlation IDs are accepted from the caller so a trace can span services, but only when the
 * supplied value is a UUID. An unvalidated header would let a caller inject arbitrary text
 * into every log line and audit record for the request.
 */
function resolveCorrelationId(headers: Readonly<Record<string, string>>): CorrelationId {
  const supplied = headers['x-correlation-id'];
  if (supplied !== undefined && isUuid(supplied)) return supplied as CorrelationId;
  return newCorrelationId();
}

function normaliseHeaders(message: IncomingMessage): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(message.headers)) {
    if (value === undefined) continue;
    headers[key.toLowerCase()] = Array.isArray(value) ? value.join(', ') : value;
  }
  return headers;
}

/** Read the body with a hard byte cap, destroying the socket if the cap is exceeded. */
async function readBody(
  message: IncomingMessage,
  limitBytes: number,
): Promise<{ ok: true; raw: string } | { ok: false; reason: 'too_large' }> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let total = 0;
    let settled = false;

    message.on('data', (chunk: Buffer) => {
      if (settled) return;
      total += chunk.length;
      if (total > limitBytes) {
        settled = true;
        resolve({ ok: false, reason: 'too_large' });
        message.destroy();
        return;
      }
      chunks.push(chunk);
    });

    message.on('end', () => {
      if (settled) return;
      settled = true;
      resolve({ ok: true, raw: Buffer.concat(chunks).toString('utf8') });
    });

    message.on('error', () => {
      if (settled) return;
      settled = true;
      resolve({ ok: true, raw: '' });
    });
  });
}

export function buildRouter(service: KnowledgeService): Router<RequestContext> {
  const handlers = createRouteHandlers(service);
  const router = new Router<RequestContext>();

  router
    .add('POST', `${API_BASE}/objects`, handlers.createObject)
    .add('GET', `${API_BASE}/objects`, handlers.listObjects)
    .add('GET', `${API_BASE}/objects/:id`, handlers.getObject)
    .add('PATCH', `${API_BASE}/objects/:id`, handlers.updateObject)
    .add('POST', `${API_BASE}/objects/:id/retire`, handlers.retireObject)
    .add('GET', `${API_BASE}/objects/:id/history`, handlers.getObjectHistory)
    .add('GET', `${API_BASE}/objects/:id/provenance`, handlers.getObjectProvenance)
    .add('GET', `${API_BASE}/objects/:id/neighbourhood`, handlers.getObjectNeighbourhood)
    .add('POST', `${API_BASE}/relationships`, handlers.createRelationship)
    .add('GET', `${API_BASE}/relationships`, handlers.listRelationships)
    .add('DELETE', `${API_BASE}/relationships/:id`, handlers.deleteRelationship)
    .add('GET', `${API_BASE}/audit`, handlers.queryAudit);

  return router;
}

export class KernelServer {
  private readonly deps: KernelServerDeps;
  private readonly router: Router<RequestContext>;
  private server: Server | null = null;

  constructor(deps: KernelServerDeps) {
    this.deps = deps;
    this.router = buildRouter(deps.service);
  }

  /** Exposed so tests can exercise the full pipeline without binding a socket. */
  async handle(message: IncomingMessage, response: ServerResponse): Promise<void> {
    const started = Date.now();
    const headers = normaliseHeaders(message);
    const correlationId = resolveCorrelationId(headers);

    // `message.url` is a path, not an absolute URL; the base is required and discarded.
    const url = new URL(message.url ?? '/', 'http://kernel.invalid');
    const method = (message.method ?? 'GET').toUpperCase();
    const log = this.deps.logger.child({ correlationId, method, path: url.pathname });

    let status = 500;
    try {
      const result = await this.dispatch({
        message,
        method,
        url,
        headers,
        correlationId,
        log,
      });
      status = result.status;
      this.send(response, result, correlationId);
    } catch (error) {
      // Anything reaching here is a defect in dispatch itself.
      const { problem, headers: problemHeaders, internalDetail } = toProblem(
        error,
        url.pathname,
        correlationId,
      );
      status = problem.status;
      log.error('request.unhandled_error', { internalDetail });
      this.sendProblem(response, problem, problemHeaders, correlationId);
    } finally {
      log.info('request.completed', { status, durationMs: Date.now() - started });
    }
  }

  private async dispatch(input: {
    message: IncomingMessage;
    method: string;
    url: URL;
    headers: Record<string, string>;
    correlationId: CorrelationId;
    log: Logger;
  }): Promise<HttpResult> {
    const { message, method, url, headers, correlationId, log } = input;

    /* ------------------------------------------------------ operational routes */

    if (url.pathname === '/health/live') return this.liveness();
    if (url.pathname === '/health/ready') return this.readiness();

    /* ---------------------------------------------------------------- routing */

    const match = this.router.match(method, url.pathname);

    if (match.kind === MatchKind.NotFound) {
      return this.problemResult(
        transportProblem(
          404,
          'no_route',
          'Not found',
          'No route matches this path.',
          url.pathname,
          correlationId,
        ),
      );
    }

    if (match.kind === MatchKind.MethodNotAllowed) {
      return {
        status: 405,
        headers: { Allow: match.allowed.join(', '), 'Content-Type': PROBLEM_CONTENT_TYPE },
        body: transportProblem(
          405,
          'method_not_allowed',
          'Method not allowed',
          `Allowed methods: ${match.allowed.join(', ')}`,
          url.pathname,
          correlationId,
        ),
      };
    }

    /* ------------------------------------------------------------------- body */

    let body: unknown = undefined;
    if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
      const contentType = (headers['content-type'] ?? '').split(';')[0]?.trim() ?? '';
      const read = await readBody(message, this.deps.config.requestBodyLimitBytes);

      if (!read.ok) {
        return this.problemResult(
          transportProblem(
            413,
            'payload_too_large',
            'Payload too large',
            `Request body exceeds ${this.deps.config.requestBodyLimitBytes} bytes.`,
            url.pathname,
            correlationId,
          ),
        );
      }

      if (read.raw.length > 0) {
        if (contentType !== JSON_CONTENT_TYPE) {
          return this.problemResult(
            transportProblem(
              415,
              'unsupported_media_type',
              'Unsupported media type',
              `Content-Type must be ${JSON_CONTENT_TYPE}.`,
              url.pathname,
              correlationId,
            ),
          );
        }
        try {
          body = JSON.parse(read.raw);
        } catch {
          return this.problemResult(
            transportProblem(
              400,
              'malformed_json',
              'Malformed JSON',
              'The request body could not be parsed as JSON.',
              url.pathname,
              correlationId,
            ),
          );
        }
      }
    }

    /* --------------------------------------------------------- authentication */

    let tenantContext: TenantContext | null = null;
    if (match.route.requiresAuth) {
      const authorization = headers['authorization'] ?? '';
      const [scheme, credential] = authorization.split(' ');

      if (scheme?.toLowerCase() !== 'bearer' || credential === undefined || credential === '') {
        return this.errorResult(new UnauthenticatedError(), url.pathname, correlationId, log);
      }

      const principal = await this.deps.identity.verify(credential);
      if (principal === null) {
        return this.errorResult(new UnauthenticatedError(), url.pathname, correlationId, log);
      }

      tenantContext = TenantContext.forPrincipal(principal, correlationId);
    }

    /* --------------------------------------------------------------- dispatch */

    const context: RequestContext = {
      method,
      path: url.pathname,
      query: url.searchParams,
      headers,
      body,
      correlationId,
      tenantContext,
    };

    try {
      return await match.route.handler(context, match.route.params);
    } catch (error) {
      return this.errorResult(error, url.pathname, correlationId, log);
    }
  }

  /* ---------------------------------------------------------------- health */

  /**
   * Liveness: is the process running? Deliberately does not touch the database — a database
   * outage must not cause an orchestrator to kill an otherwise healthy process.
   */
  private liveness(): HttpResult {
    return {
      status: 200,
      body: {
        status: 'ok',
        service: this.deps.config.serviceName,
        version: this.deps.version,
        uptimeSeconds: Math.floor((Date.now() - this.deps.startedAt) / 1000),
      },
    };
  }

  /**
   * Readiness: can the service serve traffic?
   *
   * AC-08 requires health information without revealing secrets or sensitive configuration.
   * `describeConfig` emits only the shape of the configuration — never the database URL,
   * static tokens, hostnames, or driver error text.
   */
  private async readiness(): Promise<HttpResult> {
    const store = await this.deps.repository.checkHealth();
    const ready = store.reachable;

    return {
      status: ready ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
      body: {
        status: ready ? 'ready' : 'not_ready',
        service: this.deps.config.serviceName,
        version: this.deps.version,
        checks: {
          store: {
            status: store.reachable ? 'ok' : 'unavailable',
            latencyMs: store.latencyMs,
            ...(store.detail !== undefined ? { detail: store.detail } : {}),
          },
          identity: { status: 'ok', mode: this.deps.identity.mode },
          policy: { status: 'ok', version: this.deps.policy.version },
        },
        configuration: describeConfig(this.deps.config),
      },
    };
  }

  /* --------------------------------------------------------------- helpers */

  private problemResult(problem: Problem): HttpResult {
    return {
      status: problem.status,
      headers: { 'Content-Type': PROBLEM_CONTENT_TYPE },
      body: problem,
    };
  }

  private errorResult(
    error: unknown,
    instance: string,
    correlationId: CorrelationId,
    log: Logger,
  ): HttpResult {
    const { problem, headers, internalDetail } = toProblem(error, instance, correlationId);
    if (internalDetail !== null) {
      log.error('request.failed', { code: problem.code, internalDetail });
    }
    return {
      status: problem.status,
      headers: { ...headers, 'Content-Type': PROBLEM_CONTENT_TYPE },
      body: problem,
    };
  }

  private send(response: ServerResponse, result: HttpResult, correlationId: string): void {
    const headers: Record<string, string> = {
      'X-Correlation-Id': correlationId,
      // Conservative defaults for an API that serves no HTML.
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
      ...(result.headers ?? {}),
    };

    if (result.body === undefined) {
      response.writeHead(result.status, headers);
      response.end();
      return;
    }

    if (headers['Content-Type'] === undefined) headers['Content-Type'] = JSON_CONTENT_TYPE;
    const payload = JSON.stringify(result.body);
    headers['Content-Length'] = String(Buffer.byteLength(payload, 'utf8'));

    response.writeHead(result.status, headers);
    response.end(payload);
  }

  private sendProblem(
    response: ServerResponse,
    problem: Problem,
    extraHeaders: Record<string, string>,
    correlationId: string,
  ): void {
    this.send(
      response,
      {
        status: problem.status,
        headers: { ...extraHeaders, 'Content-Type': PROBLEM_CONTENT_TYPE },
        body: problem,
      },
      correlationId,
    );
  }

  /* ------------------------------------------------------------- lifecycle */

  async listen(): Promise<void> {
    const server = createServer((message, response) => {
      void this.handle(message, response);
    });

    // Bound header and request time so a slow-loris client cannot hold connections open.
    server.headersTimeout = 20_000;
    server.requestTimeout = 60_000;

    this.server = server;

    await new Promise<void>((resolve) => {
      server.listen(this.deps.config.port, this.deps.config.host, resolve);
    });

    this.deps.logger.info('server.listening', {
      port: this.boundPort,
      host: this.deps.config.host,
    });
  }

  /**
   * The port actually bound. Differs from the configured port when the configuration requests
   * port 0, which tests use to avoid collisions on a shared machine.
   */
  get boundPort(): number {
    const address = this.server?.address();
    return typeof address === 'object' && address !== null ? address.port : this.deps.config.port;
  }

  async close(): Promise<void> {
    const server = this.server;
    if (server === null) return;
    await new Promise<void>((resolve) => server.close(() => resolve()));
    this.server = null;
  }
}
