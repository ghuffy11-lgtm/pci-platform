# DISC-0008 — Compose Kernel Service Cannot Start As Committed

**Status:** OPEN — defect found on first real execution; workaround applied, fix not yet made
**Raised:** 2026-08-19
**Severity:** Medium — the service cannot start from the committed stack; no security weakness
**Work package:** WP-0001 — PCI Kernel Foundation
**Related:** DISC-0003 (development identity adapter), DISC-0007

## Discovery

`docker compose up kernel` was executed for the first time on 2026-08-19. The container entered a
restart loop:

```text
pci-kernel-kernel-1  Restarting (78)

Invalid configuration:
  - PCI_IDENTITY_MODE=static requires at least one entry in PCI_STATIC_PRINCIPALS
```

The compose service supplies `PCI_IDENTITY_MODE=static` but never supplies
`PCI_STATIC_PRINCIPALS`, and the kernel's configuration validation is fail-closed, so it refuses to
start.

## The kernel behaved correctly

This is worth stating plainly, because the failure is the desired behaviour meeting an incomplete
caller. A service configured for static identity with **no principals defined** would either serve
requests it cannot authenticate or authenticate nobody. The kernel refuses to start, names the
exact missing variable, and exits non-zero.

It also logged, on eventual startup:

```json
{"level":"warn","message":"identity.development_adapter_active",
 "detail":"The static identity adapter is a development fixture and is prohibited in production (ADR-0007, SPEC-0004)."}
```

Fail-closed configuration and a loud development-fixture warning are both working as designed. The
defect is confined to the compose wiring.

## Workaround applied 2026-08-19 (not a fix)

A single development principal was generated **on the host** and appended to the uncommitted,
gitignored `.env`:

```text
PCI_STATIC_PRINCIPALS=[{"token":"<generated, never printed>","subject":"dev-verifier",
                        "tenantId":"acme","actorType":"service","roles":["admin"]}]
```

The service then started and reported healthy. As with DISC-0007, this step is manual and is not
reproducible from the repository: a clean checkout plus `docker compose up` still fails.

## Required fix — not yet applied

The awkwardness is that `PCI_STATIC_PRINCIPALS` carries a bearer token, so it cannot be committed
(ADR-0009). Options, for the architecture lead to choose between:

1. **Ship `.env.example`** with a clearly fake placeholder and document the generation step. The
   `.gitignore` already anticipates this — it carries a `!.env.example` negation for a file that
   does not yet exist.
2. **Generate a development principal in the bootstrap**, writing it to `.env` at provisioning
   time, so the stack is self-provisioning for development.
3. **Default the kernel to a no-principal development mode** that serves only the health endpoints.
   This is the least attractive: it moves a fail-closed guard toward fail-open to make a demo
   convenient.

Recommendation: option 1, with option 2 as a convenience layered on top. Neither weakens the
guard — the service keeps refusing to start when identity is configured but undefined.

## Evidence of the working end state

Once configured, the service verified correctly:

```text
GET /health/ready  -> 200
{"status":"ready","checks":{"store":{"status":"ok","latencyMs":2},
 "identity":{"status":"ok","mode":"static"},"policy":{"status":"ok","version":"kernel-static/1.0.0"}},
 "configuration":{"environment":"development","storeMode":"postgres","databaseConfigured":true,
 "staticPrincipalCount":1}}

GET /health/live   -> 200  {"status":"ok","uptimeSeconds":28}
```

Note for future sessions: the health routes are `/health/ready` and `/health/live`. There is no
`/health` — requesting it correctly returns an RFC 9457 problem document with `status: 404`.
