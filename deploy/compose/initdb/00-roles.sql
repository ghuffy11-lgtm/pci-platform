-- Least-privilege runtime role.
--
-- Runs once, as the cluster superuser, via the postgres image's initdb entrypoint. Role
-- creation cannot live in a migration because migrations run as an ordinary owner role.
--
-- Sources: ADR-0016 (proposed) layer 3, docs/security/security-architecture.md (least
--          privilege, explicit service identities), SPEC-0010.
--
-- CRITICAL: pci_app must NOT hold SUPERUSER or BYPASSRLS. Either one makes the row-level
-- security policies in migration 0001 inert, silently removing tenant isolation.
--
-- ⚠ NEVER EXECUTED. See implementation/blockers/BLK-0001-no-execution-environment.md.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'pci_app') THEN
        -- The password comes from the environment; it is never written into this file.
        EXECUTE format(
            'CREATE ROLE pci_app WITH LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS',
            current_setting('pci.app_password', true)
        );
    END IF;
END
$$;

-- Fail loudly rather than creating a role with a null password.
DO $$
BEGIN
    IF current_setting('pci.app_password', true) IS NULL
       OR current_setting('pci.app_password', true) = '' THEN
        RAISE EXCEPTION
            'pci.app_password is not set. Start the container with PGOPTIONS="-c pci.app_password=..." '
            'or provision the role out of band. Refusing to create a passwordless role.';
    END IF;
END
$$;

-- Defence in depth: revoke the implicit PUBLIC create privilege on the public schema.
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

COMMENT ON SCHEMA public IS
    'PCI kernel schema. Runtime access is via the pci_app role, which must never hold BYPASSRLS.';
