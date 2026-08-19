# DISC-0007 — Database Init Refuses To Create a Passwordless Role, Then Creates One Anyway

**Status:** OPEN — defect found on first real execution; workaround applied, fix not yet made
**Raised:** 2026-08-19
**Severity:** High — the stack reports healthy while the least-privilege runtime role is unusable
**Work package:** WP-0001 — PCI Kernel Foundation
**Related:** ADR-0016 (tenant isolation), TASK-0001, DISC-0004

## Discovery

`deploy/compose/initdb/00-roles.sql` was executed for the first time on 2026-08-19. It does not
work, and it fails in a way that looks like success.

Three defects, in order of severity:

### 1. The guard runs after the thing it guards

```sql
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'pci_app') THEN
        EXECUTE format('CREATE ROLE pci_app WITH LOGIN PASSWORD %L ...',
                       current_setting('pci.app_password', true));   -- NULL when unset
    END IF;
END $$;

-- Fail loudly rather than creating a role with a null password.
DO $$ BEGIN
    IF current_setting('pci.app_password', true) IS NULL ... THEN RAISE EXCEPTION ...
END $$;
```

The comment says *"fail loudly rather than creating a role with a null password"* — but the role is
created **first**, so by the time the guard raises, the passwordless role already exists.

### 2. The exception does not stop initialisation

Observed in the container log:

```text
ERROR:  pci.app_password is not set. ... Refusing to create a passwordless role.
2026-08-19 16:06:55.341 UTC [1] LOG:  database system is ready to accept connections
```

The error was raised, initialisation continued, and the container reported **healthy**. The
`healthcheck` only runs `pg_isready`, which knows nothing about whether the roles were provisioned.

Result:

```text
pci_app | password_set=false | super=false | bypassrls=false
```

A role that cannot authenticate, in a stack that reports itself ready.

### 3. Nothing is granted to the runtime role

`00-roles.sql` creates `pci_app`, revokes `CREATE ON SCHEMA public FROM PUBLIC`, and stops. It never
grants `pci_app` any privilege on the schema or its tables. The integration tier failed with:

```text
error: permission denied for schema public   (code 42501)
```

Nor does anything create the `pci_test` database that the integration tier's own documented usage
refers to (`postgres://pci_app:<dev-password>@localhost:5432/pci_test`). The compose stack creates
only `pci`.

## Why this matters beyond the inconvenience

The security intent is sound and the *runtime* posture it produces is correct — `pci_app` is
`NOSUPERUSER NOBYPASSRLS`, which is what makes the ADR-0016 policies bite. The failure is that the
provisioning path silently does not achieve it.

The dangerous shape is the third one in this repository's collection of the same pattern: DISC-0005
(a test tier reporting success while running nothing), DISC-0006 (an edit reporting success while
changing nothing), and now a database stack reporting healthy while its access control was never
provisioned. In each case the exit status was fine and the substance was absent.

Had the role been reachable with a null password rather than unusable, this would have been a
security defect rather than an availability one.

## Workaround applied 2026-08-19 (not a fix)

To unblock TASK-0001 verification, and using the route the script's own error message offers
("or provision the role out of band"):

- `ALTER ROLE pci_app WITH PASSWORD <generated>` — password generated on the host, never printed,
  never committed; `pci_app` retains `NOSUPERUSER NOBYPASSRLS`.
- `CREATE DATABASE pci_test OWNER pci_app` — the integration tier migrates into its own database.
  Ownership does not weaken the test: migration 0001 sets **FORCE** row-level security, so the
  owner remains subject to the policies. The tier subsequently proved exactly that.

**These steps are manual and are not reproducible from the repository.** A clean
`docker compose up` still produces a broken stack.

## Required fix — not yet applied

1. Move the guard **before** the `CREATE ROLE`, so a missing password prevents creation rather than
   reporting on it afterwards.
2. Pass the password into the postgres service so a clean init succeeds, e.g.
   `PGOPTIONS: "-c pci.app_password=${PCI_APP_PASSWORD:?PCI_APP_PASSWORD is required}"` in the
   service environment.
3. Grant `pci_app` the privileges it actually needs, explicitly and minimally.
4. Provision the `pci_test` database, or change the integration tier's documented usage to match
   what the stack creates.
5. Make the health check meaningful, or accept that `pg_isready` says nothing about provisioning.

Verifying the fix requires re-initialising the volume — `initdb` scripts run only on first
initialisation — which is a destructive operation on `pci-kernel_postgres-data`. That volume
currently holds only data created during this verification, but destroying it is not authorized
under `CLAUDE.md` Rule 9 and is therefore proposed rather than done.
