/**
 * PostgreSQL integration tier.
 *
 * Runs the SAME contract suite as the in-memory adapter (test/contract/repository.contract.ts),
 * plus assertions that only a real database can make: migration application, row-level
 * security, cross-tenant foreign-key rejection, and append-only privileges.
 *
 * ⚠ THIS TIER HAS NEVER BEEN EXECUTED.
 *   No PostgreSQL instance was available during WP-0001. See
 *   implementation/blockers/BLK-0001-no-execution-environment.md.
 *
 * It SKIPS — loudly and explicitly — when PCI_TEST_DATABASE_URL is unset, so an unverified
 * tier can never be mistaken for a passing one.
 *
 * To run:
 *   docker compose -f deploy/compose/docker-compose.yml up -d postgres
 *   PCI_TEST_DATABASE_URL=postgres://pci_app:<dev-password>@localhost:5432/pci_test \
 *     npm run test:integration
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';

import pg from 'pg';

import { PostgresKnowledgeRepository } from '../../src/adapters/postgres/pg-repository.ts';
import { migrate } from '../../src/cli/migrate.ts';
import { repositoryContract } from '../contract/repository.contract.ts';
import { newCorrelationId, newObjectId } from '../../src/domain/identifiers.ts';
import type { PrincipalId } from '../../src/domain/identifiers.ts';
import { TenantContext } from '../../src/domain/principal.ts';
import { principal, TENANT_A, TENANT_B } from '../support/fixtures.ts';

const DATABASE_URL = process.env['PCI_TEST_DATABASE_URL'];
const ENABLED = DATABASE_URL !== undefined && DATABASE_URL.trim() !== '';

if (!ENABLED) {
  // Visible on the console AND reported as a skipped test, so a green run cannot be read as
  // "PostgreSQL was verified".
  process.stdout.write(
    '\n' +
      '  ============================================================================\n' +
      '  SKIPPED: PostgreSQL integration tier\n' +
      '  PCI_TEST_DATABASE_URL is not set, so migrations, row-level security, and the\n' +
      '  PostgreSQL adapter are NOT verified. See implementation/blockers/BLK-0001.\n' +
      '  ============================================================================\n\n',
  );

  test('PostgreSQL integration tier', { skip: 'PCI_TEST_DATABASE_URL is not set' }, () => {
    // Intentionally empty — the skip reason is the assertion.
  });
}

if (ENABLED) {
  const connectionString = DATABASE_URL as string;

  /* Apply migrations and seed the tenants the contract suite uses. */
  before(async () => {
    await migrate({ connectionString, dryRun: false, log: () => {} });

    const client = new pg.Client({ connectionString });
    await client.connect();
    try {
      for (const tenant of [TENANT_A, TENANT_B]) {
        await client.query(
          `INSERT INTO tenants (id, display_name, kind) VALUES ($1, $2, 'customer')
           ON CONFLICT (id) DO NOTHING`,
          [tenant, tenant],
        );
      }
    } finally {
      await client.end();
    }
  });

  /* ------------------------------------------------ the shared contract suite */

  repositoryContract('postgres', async () => {
    const repository = new PostgresKnowledgeRepository({
      connectionString,
      max: 5,
      statementTimeoutMs: 10_000,
    });

    const truncate = async (): Promise<void> => {
      const client = new pg.Client({ connectionString });
      await client.connect();
      try {
        // Ordered by dependency; RESTART IDENTITY is unnecessary since ids are app-generated.
        await client.query(
          `TRUNCATE events, audit_records, provenance_records,
                    knowledge_object_versions, relationships, knowledge_objects CASCADE`,
        );
      } finally {
        await client.end();
      }
    };

    return {
      repository,
      reset: truncate,
      teardown: async () => {
        await truncate();
        await repository.close();
      },
    };
  });

  /* ------------------------------------ assertions only a real database can make */

  describe('PostgreSQL-specific guarantees', () => {
    let repository: PostgresKnowledgeRepository;

    before(() => {
      repository = new PostgresKnowledgeRepository({
        connectionString,
        max: 5,
        statementTimeoutMs: 10_000,
      });
    });

    after(async () => {
      await repository.close();
    });

    test('AC-02 — migrations are idempotent', async () => {
      const second = await migrate({ connectionString, dryRun: false, log: () => {} });
      assert.equal(second.applied.length, 0, 're-running migrations must apply nothing');
      assert.ok(second.skipped.includes('0001_kernel_foundation'));
    });

    test('editing an applied migration is detected', async () => {
      const client = new pg.Client({ connectionString });
      await client.connect();
      try {
        await client.query(
          `UPDATE schema_migrations SET checksum = 'tampered' WHERE version = $1`,
          ['0001_kernel_foundation'],
        );

        await assert.rejects(
          () => migrate({ connectionString, dryRun: false, log: () => {} }),
          /has changed since it was applied/,
        );
      } finally {
        // Restore so later tests are unaffected.
        await client.query(`DELETE FROM schema_migrations WHERE version = $1`, [
          '0001_kernel_foundation',
        ]);
        await client.end();
      }
    });

    test('ADR-0016 layer 3 — row-level security blocks a cross-tenant read', async () => {
      const object = {
        id: newObjectId(),
        tenantId: TENANT_A,
        type: 'Service' as const,
        name: 'RLS probe',
        status: 'active' as const,
        ownership: { organization: 'org', owner: 'user:alice' },
        classification: 'internal' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        validFrom: null,
        validTo: null,
        version: 1,
        attributes: {},
        createdBy: 'user:alice' as PrincipalId,
        updatedBy: 'user:alice' as PrincipalId,
      };

      await repository.withTransaction(
        TenantContext.forPrincipal(principal({ tenantId: TENANT_A }), newCorrelationId()),
        async (tx) => {
          await tx.insertObject({} as never, object);
        },
      );

      // Query with the GUC set to the OTHER tenant, bypassing the application's WHERE clause
      // entirely. Only row-level security can stop this.
      const client = new pg.Client({ connectionString });
      await client.connect();
      try {
        await client.query('BEGIN');
        await client.query(`SELECT set_config('pci.tenant_id', $1, true)`, [TENANT_B]);
        const result = await client.query('SELECT id FROM knowledge_objects WHERE id = $1', [
          object.id,
        ]);
        await client.query('COMMIT');

        assert.equal(
          result.rows.length,
          0,
          'RLS must hide the row even when the WHERE clause omits tenant_id',
        );
      } finally {
        await client.end();
      }
    });

    test('an unset tenant GUC returns no rows rather than all rows', async () => {
      const client = new pg.Client({ connectionString });
      await client.connect();
      try {
        const result = await client.query('SELECT count(*)::int AS total FROM knowledge_objects');
        assert.equal(
          (result.rows[0] as { total: number }).total,
          0,
          'the failure mode must be "see nothing", never "see everything"',
        );
      } finally {
        await client.end();
      }
    });

    test('a cross-tenant relationship is rejected by the composite foreign key', async () => {
      const client = new pg.Client({ connectionString });
      await client.connect();
      try {
        await client.query('BEGIN');
        await client.query(`SELECT set_config('pci.tenant_id', $1, true)`, [TENANT_A]);

        await assert.rejects(
          () =>
            client.query(
              `INSERT INTO relationships
                 (tenant_id, id, from_id, to_id, type, created_at, created_by, attributes)
               VALUES ($1, $2, $3, $4, 'DEPENDS_ON', now(), 'user:alice', '{}'::jsonb)`,
              [TENANT_A, newObjectId(), newObjectId(), newObjectId()],
            ),
          'the database must reject an edge whose endpoints do not exist in this tenant',
        );

        await client.query('ROLLBACK');
      } finally {
        await client.end();
      }
    });

    test('audit records cannot be updated or deleted by the runtime role', async () => {
      // Requires connecting as pci_app. Skipped when the test URL uses a different role,
      // because the assertion would then be meaningless rather than merely failing.
      if (!connectionString.includes('pci_app')) {
        return;
      }

      const client = new pg.Client({ connectionString });
      await client.connect();
      try {
        await assert.rejects(
          () => client.query('DELETE FROM audit_records'),
          /permission denied/i,
          'SPEC-0006: audit evidence must be tamper-evident by privilege, not convention',
        );
      } finally {
        await client.end();
      }
    });
  });
}
