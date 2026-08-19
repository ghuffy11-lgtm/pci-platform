/**
 * Composition root.
 *
 * The only file that decides which adapters are wired in. Everything below this point depends
 * on ports, which is what keeps the storage, identity, and policy implementations replaceable
 * (Constitution principle 6; SPEC-0005 Design Constraint).
 */

import { pathToFileURL } from 'node:url';

import { ConfigError, loadConfig, describeConfig } from './config/config.ts';
import type { KernelConfig } from './config/config.ts';
import { JsonLogger } from './observability/logger.ts';
import type { Logger } from './observability/logger.ts';
import { systemClock } from './ports/clock.ts';
import type { KnowledgeRepository } from './ports/knowledge-repository.ts';
import type { IdentityProvider } from './ports/identity.ts';
import { PostgresKnowledgeRepository } from './adapters/postgres/pg-repository.ts';
import { MemoryKnowledgeRepository } from './adapters/memory/memory-repository.ts';
import { StaticIdentityProvider } from './adapters/identity/static-identity-provider.ts';
import { OidcIdentityProvider } from './adapters/identity/oidc-identity-provider.ts';
import { StaticPolicyEngine } from './adapters/policy/static-policy-engine.ts';
import { KnowledgeService } from './application/knowledge-service.ts';
import { KernelServer } from './http/server.ts';

export const KERNEL_VERSION = '0.1.0';

export function buildRepository(config: KernelConfig): KnowledgeRepository {
  if (config.storeMode === 'memory') return new MemoryKnowledgeRepository();

  // config.ts guarantees databaseUrl is present when storeMode is 'postgres'.
  return new PostgresKnowledgeRepository({
    connectionString: config.databaseUrl as string,
    max: config.databasePoolMax,
    statementTimeoutMs: config.databaseStatementTimeoutMs,
  });
}

export function buildIdentity(config: KernelConfig): IdentityProvider {
  if (config.identityMode === 'oidc') {
    return new OidcIdentityProvider({
      issuer: config.oidcIssuer as string,
      audience: config.oidcAudience as string,
    });
  }
  return new StaticIdentityProvider(config.staticPrincipals);
}

export function buildServer(config: KernelConfig, logger: Logger): {
  server: KernelServer;
  repository: KnowledgeRepository;
} {
  const repository = buildRepository(config);
  const policy = new StaticPolicyEngine();
  const identity = buildIdentity(config);

  const service = new KnowledgeService({
    repository,
    policy,
    clock: systemClock,
    logger,
    environment: config.environment,
  });

  const server = new KernelServer({
    config,
    service,
    identity,
    policy,
    repository,
    logger,
    startedAt: Date.now(),
    version: KERNEL_VERSION,
  });

  return { server, repository };
}

async function main(): Promise<void> {
  let config: KernelConfig;
  try {
    config = loadConfig();
  } catch (error) {
    // Fail closed and loudly. A misconfigured kernel must not start in a degraded mode.
    if (error instanceof ConfigError) {
      process.stderr.write(`${error.message}\n`);
      process.exit(78); // EX_CONFIG
    }
    throw error;
  }

  const logger = new JsonLogger({
    level: config.logLevel,
    base: { service: config.serviceName, environment: config.environment, version: KERNEL_VERSION },
  });

  // describeConfig omits the database URL and all credential material (AC-08, ADR-0009).
  logger.info('kernel.starting', describeConfig(config));

  if (config.identityMode === 'static') {
    logger.warn('identity.development_adapter_active', {
      detail:
        'The static identity adapter is a development fixture and is prohibited in production ' +
        '(ADR-0007, SPEC-0004).',
    });
  }

  const { server, repository } = buildServer(config, logger);
  await server.listen();

  let shuttingDown = false;
  const shutdown = (signal: string): void => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info('kernel.shutdown_requested', { signal });

    const timer = setTimeout(() => {
      logger.error('kernel.shutdown_timeout', { graceMs: config.shutdownGraceMs });
      process.exit(1);
    }, config.shutdownGraceMs);
    timer.unref();

    void (async () => {
      try {
        await server.close();
        await repository.close();
        logger.info('kernel.stopped', {});
        process.exit(0);
      } catch (error) {
        logger.error('kernel.shutdown_failed', {
          detail: error instanceof Error ? error.message : String(error),
        });
        process.exit(1);
      }
    })();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

/**
 * True when this module was run directly rather than imported.
 *
 * `pathToFileURL` is required for correctness: hand-building the URL produces `file://D:/...`
 * on Windows where `import.meta.url` is `file:///D:/...`, so the comparison silently fails and
 * the process exits without starting. Do not replace this with string concatenation.
 */
const invokedDirectly =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main().catch((error: unknown) => {
    process.stderr.write(
      `kernel failed to start: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exit(1);
  });
}
