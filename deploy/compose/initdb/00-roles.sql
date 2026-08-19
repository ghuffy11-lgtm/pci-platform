-- Least-privilege runtime role.
--
-- Runs once, as the cluster superuser, via the postgres image's initdb entrypoint. Role
-- creation cannot live in a migration because migrations run as an ordinary owner role.
--
-- Sources: ADR-0016 (accepted) layer 3, docs/security/security-architecture.md (least
--          privilege, explicit service identities), SPEC-0010.
--
-- CRITICAL: pci_app must NOT hold SUPERUSER or BYPASSRLS. Either one makes the row-level
-- security policies in migration 0001 inert, silently removing tenant isolation.
--
-- The password arrives as the GUC pci.app_password, set from PCI_APP_PASSWORD via PGOPTIONS
-- on the postgres service. It is never written into this file.
--
-- TASK-0004 / DISC-0007: on first execution this script created the role BEFORE checking for
-- a password, and the resulting exception did not stop initialisation. The stack came up
-- reporting healthy with a pci_app role that could not authenticate. The guard is now first,
-- and psql runs with ON_ERROR_STOP so a failure actually fails.

\set ON_ERROR_STOP on

-- ---------------------------------------------------------------------------
-- 1. Guard FIRST. Refuse to proceed at all without a password.
-- ---------------------------------------------------------------------------
DO $$
BEGIN
    IF coalesce(current_setting('pci.app_password', true), '') = '' THEN
        RAISE EXCEPTION
            'pci.app_password is not set. Start the postgres service with '
            'PGOPTIONS="-c pci.app_password=..." (deploy/compose supplies this from '
            'PCI_APP_PASSWORD). Refusing to initialise without a runtime role password.';
    END IF;

    IF length(current_setting('pci.app_password', true)) < 16 THEN
        RAISE EXCEPTION
            'pci.app_password is shorter than 16 characters. Refusing to create a runtime '
            'role with a weak password.';
    END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- 2. Create or update the role. Only reached when a password exists.
-- ---------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'pci_app') THEN
        EXECUTE format(
            'CREATE ROLE pci_app WITH LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS',
            current_setting('pci.app_password', true)
        );
    ELSE
        -- Idempotent re-run: keep the password in step without touching the posture.
        EXECUTE format(
            'ALTER ROLE pci_app WITH LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS',
            current_setting('pci.app_password', true)
        );
    END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- 3. Verify the posture that ADR-0016 depends on, rather than assuming it.
--    SUPERUSER or BYPASSRLS here would make every RLS policy inert.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    r record;
BEGIN
    SELECT rolsuper, rolbypassrls, rolcanlogin, rolpassword IS NOT NULL AS has_password
      INTO r
      FROM pg_authid
     WHERE rolname = 'pci_app';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'pci_app was not created';
    END IF;
    IF r.rolsuper OR r.rolbypassrls THEN
        RAISE EXCEPTION
            'pci_app holds SUPERUSER or BYPASSRLS, which makes row-level security inert (ADR-0016)';
    END IF;
    IF NOT r.has_password OR NOT r.rolcanlogin THEN
        RAISE EXCEPTION 'pci_app cannot authenticate: has_password=%, canlogin=%',
            r.has_password, r.rolcanlogin;
    END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- 4. Defence in depth: revoke the implicit PUBLIC create privilege.
-- ---------------------------------------------------------------------------
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- ---------------------------------------------------------------------------
-- 5. Grants for the runtime role.
--
--    The kernel's migration runner applies schema changes using this role, so it needs
--    CREATE on the schema. It does NOT get CREATEDB, CREATEROLE, SUPERUSER, or BYPASSRLS,
--    which is what keeps ADR-0016 intact. Tables created by the migration are owned by
--    pci_app; migration 0001 sets FORCE ROW LEVEL SECURITY precisely so ownership does not
--    become an escape from the policies.
-- ---------------------------------------------------------------------------
GRANT CONNECT ON DATABASE :"POSTGRES_DB" TO pci_app;
GRANT USAGE, CREATE ON SCHEMA public TO pci_app;

-- ---------------------------------------------------------------------------
-- 6. The integration tier's database.
--
--    test/integration/postgres-repository.test.ts runs the migrations itself against
--    PCI_TEST_DATABASE_URL, whose documented form targets pci_test. That database did not
--    previously exist anywhere in the stack (DISC-0007). It is owned by pci_app so the tier
--    can migrate into it while remaining subject to FORCE RLS.
-- ---------------------------------------------------------------------------
SELECT 'CREATE DATABASE pci_test OWNER pci_app'
 WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'pci_test') \gexec

COMMENT ON SCHEMA public IS
    'PCI kernel schema. Runtime access is via the pci_app role, which must never hold BYPASSRLS.';
