/**
 * Migration runner.
 *
 * Source: WP-0001 scope item 4 and AC-02 — "A clean environment can initialize the database
 *         from migrations without manual schema editing."
 *
 * Design
 * ------
 * Plain ordered SQL files, applied inside a transaction together with their ledger entry, so
 * the schema and `schema_migrations` can never disagree. No ORM generates the schema: the
 * committed DDL is the schema, which is what keeps a derived artifact from becoming the
 * canonical definition.
 *
 * A checksum is recorded for each applied file. Editing an already-applied migration is
 * reported as an error rather than ignored — silent drift between environments is the failure
 * mode this guards against.
 *
 * Usage:
 *   PCI_DATABASE_URL=postgres://... node src/cli/migrate.ts [--dry-run]
 *
 * ⚠ NEVER EXECUTED. See implementation/blockers/BLK-0001-no-execution-environment.md.
 */

import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import pg from 'pg';

const { Client } = pg;

const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'migrations');

type Migration = {
  version: string;
  path: string;
  sql: string;
  checksum: string;
};

function checksum(sql: string): string {
  // Normalise line endings so a checkout on Windows and one on Linux agree.
  return createHash('sha256').update(sql.replace(/\r\n/g, '\n'), 'utf8').digest('hex');
}

export async function loadMigrations(directory = MIGRATIONS_DIR): Promise<Migration[]> {
  const entries = await readdir(directory);
  const files = entries.filter((name) => name.endsWith('.sql')).sort();

  const migrations: Migration[] = [];
  for (const file of files) {
    const path = join(directory, file);
    const sql = await readFile(path, 'utf8');
    migrations.push({
      version: file.replace(/\.sql$/, ''),
      path,
      sql,
      checksum: checksum(sql),
    });
  }
  return migrations;
}

const LEDGER_DDL = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version    text        PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now(),
    checksum   text        NOT NULL
  )
`;

export async function migrate(options: {
  connectionString: string;
  dryRun: boolean;
  log?: (message: string) => void;
}): Promise<{ applied: string[]; skipped: string[] }> {
  const log = options.log ?? ((message: string) => process.stdout.write(message + '\n'));
  const client = new Client({ connectionString: options.connectionString });
  await client.connect();

  const applied: string[] = [];
  const skipped: string[] = [];

  try {
    await client.query(LEDGER_DDL);

    const existing = await client.query<{ version: string; checksum: string }>(
      'SELECT version, checksum FROM schema_migrations',
    );
    const alreadyApplied = new Map(existing.rows.map((row) => [row.version, row.checksum]));

    for (const migration of await loadMigrations()) {
      const previous = alreadyApplied.get(migration.version);

      if (previous !== undefined) {
        if (previous !== migration.checksum) {
          throw new Error(
            `Migration ${migration.version} has changed since it was applied.\n` +
              `  recorded checksum: ${previous}\n` +
              `  current checksum:  ${migration.checksum}\n` +
              'Applied migrations are immutable. Add a new migration instead of editing this one.',
          );
        }
        skipped.push(migration.version);
        continue;
      }

      if (options.dryRun) {
        log(`[dry-run] would apply ${migration.version}`);
        applied.push(migration.version);
        continue;
      }

      log(`applying ${migration.version} ...`);
      await client.query('BEGIN');
      try {
        await client.query(migration.sql);
        await client.query(
          'INSERT INTO schema_migrations (version, checksum) VALUES ($1, $2)',
          [migration.version, migration.checksum],
        );
        await client.query('COMMIT');
        applied.push(migration.version);
        log(`applied  ${migration.version}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw new Error(
          `Migration ${migration.version} failed and was rolled back: ${
            error instanceof Error ? error.message : String(error)
          }`,
          { cause: error },
        );
      }
    }

    return { applied, skipped };
  } finally {
    await client.end();
  }
}

/**
 * Run only when invoked directly, so tests can import the functions above.
 *
 * `pathToFileURL` is required: concatenating `file://` + the path yields `file://D:/...` on
 * Windows while `import.meta.url` is `file:///D:/...`, so the guard would never match and the
 * CLI would exit silently without migrating.
 */
if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const connectionString = process.env['PCI_DATABASE_URL'];
  if (connectionString === undefined || connectionString.trim() === '') {
    process.stderr.write('PCI_DATABASE_URL is required\n');
    process.exit(2);
  }

  const dryRun = process.argv.includes('--dry-run');

  migrate({ connectionString, dryRun })
    .then(({ applied, skipped }) => {
      process.stdout.write(
        `migrations complete: ${applied.length} applied, ${skipped.length} already present\n`,
      );
      process.exit(0);
    })
    .catch((error: unknown) => {
      // Never print the connection string: it contains a password.
      process.stderr.write(
        `migration failed: ${error instanceof Error ? error.message : String(error)}\n`,
      );
      process.exit(1);
    });
}
