# MSG-0015 — TASK-0004 and TASK-0005 Complete; TASK-0006 Authorization Required

**Status:** **CLOSED** — TASK-0006 authorized by MSG-0016 and completed 2026-08-19 (gate G3 passed). See MSG-0017.
**Raised:** 2026-08-19
**Raised by:** Claude Code (implementation agent)
**Type:** Record — task completion
**Authority:** MSG-0012 (authorization), MSG-0013 / MSG-0014 (queue reconciliation)

## Queue reconciliation, first

Per MSG-0013 and MSG-0014, the queue was reconciled to READY **from MSG-0012** before any work
began, in its own commit (`de35bf4`), so the authorization state is discoverable independently of
the work it permitted. Authorization was not inferred from conversation.

Then the continuation rule was applied: both tasks ran without stopping in between.

## TASK-0004 — database role provisioning — COMPLETE

Fixed in `deploy/compose/initdb/00-roles.sql` and the compose postgres service:

| Defect (DISC-0007) | Fix |
|---|---|
| Guard ran *after* `CREATE ROLE` | Guard is now first; a missing password prevents creation |
| The exception did not stop initialisation | `\set ON_ERROR_STOP on` — a failure now exits non-zero |
| Nothing granted to `pci_app`; no `pci_test` | `CONNECT`, `USAGE` + `CREATE` on `public`, and `pci_test` owned by `pci_app` |

Plus a 16-character minimum password length, an idempotent `ALTER ROLE` path, and an explicit
post-creation assertion that `pci_app` holds neither SUPERUSER nor BYPASSRLS — because either would
make every ADR-0016 policy inert, and that is worth failing the build over.

### Gate G1 — passed, without touching the protected volume

TASK-0004's constraints forbid destroying `pci-kernel_postgres-data`, and `initdb` only runs on
first initialisation — so the fix was verified against a **throwaway container with its own
ephemeral volume**. That proves the clean path without consuming TASK-0006's authorization:

```text
NEGATIVE (no pci.app_password):
  exited exit=3, guard message x3
  -> initialisation FAILS instead of reporting healthy with an unusable role

POSITIVE (PGOPTIONS supplied):
  role: password_set=true  super=false  bypassrls=false  login=true
  CREATE on public: true      USAGE on public: true
  pci_test: exists=true  owner=pci_app
  no ERROR/FATAL in the init log
```

**No manual SQL in either case** — which is the point, since manual SQL is what DISC-0007 was about.

## TASK-0005 — compose kernel service — COMPLETE

`.env.example` shipped per MSG-0012's selection of DISC-0008 option 1, with generation instructions
and the instruction to generate values on the machine that will use them. **The fail-closed guard
was not weakened.**

### Gate G2 — passed

```text
G2a  no principals      -> refused
G2b  placeholder token  -> refused ("token must be a string of at least 16 characters")
G2c  documented setup   -> kernel Up (healthy), /health/ready HTTP 200
```

## Two defects found in my own fixes, both while verifying

Recorded because they are the substance of why verification is not a formality:

1. **`GRANT CONNECT ON DATABASE :"POSTGRES_DB"`** referenced a psql variable the postgres entrypoint
   does not define, aborting initialisation. Fixed in `a259888`. The abort was itself proof the
   `ON_ERROR_STOP` fix works — before it, that error would have been ignored.

2. **The first placeholder token was 35 characters**, which *passes* the 16-character minimum. A
   user copying `.env.example` unedited would have got a **running service authenticating against a
   token published in a public repository**, while the file claimed all placeholders were rejected.
   Fixed in `4519dfa` to a 10-character value the guard refuses.

The second is the more serious: it would have shipped a working credential in a public repository
and called it a placeholder. It was caught only because the guard was *run* rather than read.

## What is still not proven

**A full `docker compose up` from a fresh volume.** The live `pci-kernel_postgres-data` still
carries the manual workaround from 2026-08-19 and will never re-run `initdb`, so its state is not
evidence of these fixes. Both checkpoints say so explicitly, so a resuming session cannot mistake
one for the other.

Until that clean-room run happens, WP-0001 remains **verified but not reproducible** — the same
qualifier as before, now with the defects fixed rather than merely recorded.

## Decision required — TASK-0006

Its dependencies are now met; its status is `WAITING_FOR_ARCHITECTURE_LEAD` on one thing:

> **Explicit authorization to destroy the `pci-kernel_postgres-data` volume** (`docker compose down
> -v`) so the stack can be rebuilt from scratch and gate G3 evaluated.

The volume holds only data created during TASK-0001 verification — no customer data, nothing
irreplaceable. But it is a destructive, irreversible operation, and `CLAUDE.md` Rule 9 requires the
authorization to be explicit rather than inferred from the fact that it is obviously the next step.

Granting it unblocks TASK-0006 → TASK-0007 → TASK-0008 as one continuous authorized run, ending at
TASK-0009, which is yours to decide.
