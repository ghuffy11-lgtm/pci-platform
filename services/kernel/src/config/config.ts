/**
 * Configuration.
 *
 * Sources: ADR-0009 (secrets externalized, never in source control), SPEC-0026
 *          ("configuration as code where practical", "secure initial bootstrap"),
 *          docs/operations/installation-architecture.md ("Never store production secrets in
 *          deployment files").
 *
 * All configuration comes from the environment. Nothing here has a default that would be
 * unsafe in production, and validation is fail-closed: an invalid configuration terminates
 * startup rather than degrading to a permissive mode.
 */

import { isLogLevel } from '../observability/logger.ts';
import type { LogLevel } from '../observability/logger.ts';
import { isTenantSlug } from '../domain/identifiers.ts';

export const ENVIRONMENTS = ['development', 'test', 'staging', 'production'] as const;
export type Environment = (typeof ENVIRONMENTS)[number];

export const IDENTITY_MODES = ['static', 'oidc'] as const;
export type IdentityMode = (typeof IDENTITY_MODES)[number];

export const STORE_MODES = ['postgres', 'memory'] as const;
export type StoreMode = (typeof STORE_MODES)[number];

export type StaticPrincipalConfig = {
  readonly token: string;
  readonly subject: string;
  readonly tenantId: string;
  readonly actorType: 'human' | 'service' | 'agent';
  readonly displayName: string;
  readonly roles: readonly string[];
  readonly scopes: readonly string[];
  readonly delegatedBy: string | null;
};

export type KernelConfig = {
  readonly environment: Environment;
  readonly host: string;
  readonly port: number;
  readonly logLevel: LogLevel;
  readonly serviceName: string;
  readonly identityMode: IdentityMode;
  readonly storeMode: StoreMode;
  /** Absent when storeMode is 'memory'. Contains a password — never log this value. */
  readonly databaseUrl: string | null;
  readonly databasePoolMax: number;
  readonly databaseStatementTimeoutMs: number;
  readonly staticPrincipals: readonly StaticPrincipalConfig[];
  readonly oidcIssuer: string | null;
  readonly oidcAudience: string | null;
  readonly requestBodyLimitBytes: number;
  readonly shutdownGraceMs: number;
};

export class ConfigError extends Error {
  readonly problems: readonly string[];

  constructor(problems: readonly string[]) {
    super(`Invalid configuration:\n  - ${problems.join('\n  - ')}`);
    this.name = 'ConfigError';
    this.problems = problems;
  }
}

type Env = Record<string, string | undefined>;

function readInt(
  env: Env,
  key: string,
  fallback: number,
  problems: string[],
  bounds?: { min: number; max: number },
): number {
  const raw = env[key];
  if (raw === undefined || raw === '') return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed)) {
    problems.push(`${key} must be an integer`);
    return fallback;
  }
  if (bounds && (parsed < bounds.min || parsed > bounds.max)) {
    problems.push(`${key} must be between ${bounds.min} and ${bounds.max}`);
    return fallback;
  }
  return parsed;
}

/**
 * Parse `PCI_STATIC_PRINCIPALS`.
 *
 * Format is a JSON array. These are DEVELOPMENT credentials only; see the production guard
 * below and implementation/discoveries/DISC-0003-dev-identity-adapter.md.
 */
function parseStaticPrincipals(raw: string | undefined, problems: string[]): StaticPrincipalConfig[] {
  if (raw === undefined || raw.trim() === '') return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    problems.push('PCI_STATIC_PRINCIPALS must be valid JSON');
    return [];
  }

  if (!Array.isArray(parsed)) {
    problems.push('PCI_STATIC_PRINCIPALS must be a JSON array');
    return [];
  }

  const result: StaticPrincipalConfig[] = [];
  parsed.forEach((entry, index) => {
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
      problems.push(`PCI_STATIC_PRINCIPALS[${index}] must be an object`);
      return;
    }
    const record = entry as Record<string, unknown>;
    const token = record['token'];
    const subject = record['subject'];
    const tenantId = record['tenantId'];
    const actorType = record['actorType'];

    if (typeof token !== 'string' || token.length < 16) {
      problems.push(
        `PCI_STATIC_PRINCIPALS[${index}].token must be a string of at least 16 characters`,
      );
      return;
    }
    if (typeof subject !== 'string' || subject.trim() === '') {
      problems.push(`PCI_STATIC_PRINCIPALS[${index}].subject is required`);
      return;
    }
    if (typeof tenantId !== 'string' || !isTenantSlug(tenantId)) {
      problems.push(
        `PCI_STATIC_PRINCIPALS[${index}].tenantId must be a lowercase slug (a-z, 0-9, hyphen)`,
      );
      return;
    }
    if (actorType !== 'human' && actorType !== 'service' && actorType !== 'agent') {
      problems.push(
        `PCI_STATIC_PRINCIPALS[${index}].actorType must be one of: human, service, agent`,
      );
      return;
    }

    const roles = Array.isArray(record['roles'])
      ? (record['roles'] as unknown[]).filter((r): r is string => typeof r === 'string')
      : [];
    const scopes = Array.isArray(record['scopes'])
      ? (record['scopes'] as unknown[]).filter((s): s is string => typeof s === 'string')
      : [];
    const delegatedBy = record['delegatedBy'];

    result.push({
      token,
      subject: subject.trim(),
      tenantId,
      actorType,
      displayName: typeof record['displayName'] === 'string' ? record['displayName'] : subject,
      roles,
      scopes,
      delegatedBy: typeof delegatedBy === 'string' ? delegatedBy : null,
    });
  });

  return result;
}

export function loadConfig(env: Env = process.env): KernelConfig {
  const problems: string[] = [];

  const rawEnvironment = env['PCI_ENV'] ?? 'development';
  if (!(ENVIRONMENTS as readonly string[]).includes(rawEnvironment)) {
    problems.push(`PCI_ENV must be one of: ${ENVIRONMENTS.join(', ')}`);
  }
  const environment = rawEnvironment as Environment;

  const rawLogLevel = env['PCI_LOG_LEVEL'] ?? 'info';
  if (!isLogLevel(rawLogLevel)) {
    problems.push('PCI_LOG_LEVEL must be one of: debug, info, warn, error');
  }

  const rawIdentityMode = env['PCI_IDENTITY_MODE'] ?? 'static';
  if (!(IDENTITY_MODES as readonly string[]).includes(rawIdentityMode)) {
    problems.push(`PCI_IDENTITY_MODE must be one of: ${IDENTITY_MODES.join(', ')}`);
  }
  const identityMode = rawIdentityMode as IdentityMode;

  const rawStoreMode = env['PCI_STORE_MODE'] ?? 'postgres';
  if (!(STORE_MODES as readonly string[]).includes(rawStoreMode)) {
    problems.push(`PCI_STORE_MODE must be one of: ${STORE_MODES.join(', ')}`);
  }
  const storeMode = rawStoreMode as StoreMode;

  const databaseUrl = env['PCI_DATABASE_URL'] ?? null;
  if (storeMode === 'postgres' && (databaseUrl === null || databaseUrl.trim() === '')) {
    problems.push('PCI_DATABASE_URL is required when PCI_STORE_MODE=postgres');
  }

  const staticPrincipals = parseStaticPrincipals(env['PCI_STATIC_PRINCIPALS'], problems);

  /* ------------------------------------------------- fail-closed production guards */

  // ADR-0007 forbids PCI implementing authentication itself. The static adapter exists for
  // development only and must never be reachable in production.
  if (environment === 'production' && identityMode === 'static') {
    problems.push(
      'PCI_IDENTITY_MODE=static is prohibited when PCI_ENV=production. ' +
        'The static identity adapter is a development fixture; production requires an OIDC ' +
        'provider (ADR-0007, SPEC-0004).',
    );
  }

  // An in-memory store loses all data on restart and has no tenant enforcement in the
  // database. It must never back a production deployment.
  if (environment === 'production' && storeMode === 'memory') {
    problems.push(
      'PCI_STORE_MODE=memory is prohibited when PCI_ENV=production. ' +
        'The in-memory store is a test double and provides no durability or row-level security.',
    );
  }

  if (identityMode === 'static' && staticPrincipals.length === 0 && environment !== 'test') {
    problems.push(
      'PCI_IDENTITY_MODE=static requires at least one entry in PCI_STATIC_PRINCIPALS',
    );
  }

  if (identityMode === 'oidc') {
    if (!env['PCI_OIDC_ISSUER']) problems.push('PCI_OIDC_ISSUER is required when PCI_IDENTITY_MODE=oidc');
    if (!env['PCI_OIDC_AUDIENCE']) problems.push('PCI_OIDC_AUDIENCE is required when PCI_IDENTITY_MODE=oidc');
  }

  // Port 0 asks the OS for any free port. Tests rely on it to avoid collisions, and it is a
  // legitimate deployment choice behind a service mesh that discovers the bound port.
  const port = readInt(env, 'PCI_PORT', 8080, problems, { min: 0, max: 65535 });
  const databasePoolMax = readInt(env, 'PCI_DATABASE_POOL_MAX', 10, problems, { min: 1, max: 200 });
  const databaseStatementTimeoutMs = readInt(
    env,
    'PCI_DATABASE_STATEMENT_TIMEOUT_MS',
    15_000,
    problems,
    { min: 100, max: 600_000 },
  );
  const requestBodyLimitBytes = readInt(env, 'PCI_REQUEST_BODY_LIMIT_BYTES', 1_048_576, problems, {
    min: 1024,
    max: 16 * 1024 * 1024,
  });
  const shutdownGraceMs = readInt(env, 'PCI_SHUTDOWN_GRACE_MS', 10_000, problems, {
    min: 0,
    max: 120_000,
  });

  if (problems.length > 0) throw new ConfigError(problems);

  return {
    environment,
    host: env['PCI_HOST'] ?? '0.0.0.0',
    port,
    logLevel: rawLogLevel as LogLevel,
    serviceName: env['PCI_SERVICE_NAME'] ?? 'pci-kernel',
    identityMode,
    storeMode,
    databaseUrl,
    databasePoolMax,
    databaseStatementTimeoutMs,
    staticPrincipals,
    oidcIssuer: env['PCI_OIDC_ISSUER'] ?? null,
    oidcAudience: env['PCI_OIDC_AUDIENCE'] ?? null,
    requestBodyLimitBytes,
    shutdownGraceMs,
  };
}

/**
 * Configuration summary safe to log at startup and expose on the health endpoint.
 *
 * AC-08: health/readiness must not reveal secrets or sensitive configuration. The database
 * URL, static tokens, and principal identifiers are all omitted — only the *shape* of the
 * configuration is described.
 */
export function describeConfig(config: KernelConfig): Readonly<Record<string, unknown>> {
  return Object.freeze({
    environment: config.environment,
    serviceName: config.serviceName,
    port: config.port,
    logLevel: config.logLevel,
    identityMode: config.identityMode,
    storeMode: config.storeMode,
    databaseConfigured: config.databaseUrl !== null,
    staticPrincipalCount: config.staticPrincipals.length,
  });
}
