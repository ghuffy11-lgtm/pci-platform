# DISC-0003 — Development Identity Adapter Boundary

**Status:** Recorded
**Date:** 2026-08-19
**Work package:** WP-0001
**Source authority:** SPEC-0004, ADR-0007

## Discovery

WP-0001 places "production identity provider integration beyond an adapter boundary" out of
scope, but AC-03 requires an *authorized* API caller and AC-07 requires unauthorized operations
to be rejected. Authentication is therefore needed to demonstrate the kernel, while the real
OIDC integration is deliberately deferred.

## Resolution applied

An `IdentityProvider` port (`src/ports/identity.ts`) resolves a bearer credential to a
`Principal`. Two adapters exist:

- `OidcIdentityProvider` — **declared but not implemented.** Every method throws
  `NotImplementedError` with a message naming SPEC-0004 and the work package that must implement
  it. It exists to fix the seam, not to pretend coverage.
- `StaticIdentityProvider` — resolves tokens from a configuration-supplied table for development
  and testing only.

## Safety controls on the static adapter

ADR-0007 forbids PCI implementing authentication itself, so the development adapter is
constrained so it cannot become production authentication:

1. **Refuses to start in production.** If `PCI_ENV=production` and the identity mode is `static`,
   the process exits non-zero at startup with a fatal log. Tested in
   `test/unit/config.test.ts`.
2. **No password storage.** Tokens are opaque bearer strings, never passwords, and are never
   persisted — they exist only in injected configuration.
3. **Constant-time comparison** via `crypto.timingSafeEqual` to avoid teaching a timing-unsafe
   pattern that might later be copied.
4. **No token issuance.** The adapter verifies only; it cannot mint credentials.
5. **Synthetic fixtures only**, per `security-architecture.md:39`. Development tokens live in
   `deploy/compose/.env.example` and are clearly marked non-secret synthetic values.

## Residual note

`security-architecture.md:39` requires development fixtures to use synthetic credentials. The
values in `.env.example` are synthetic and carry an explicit warning header. No real credential
exists anywhere in this repository.

## Follow-up required

A future work package must implement `OidcIdentityProvider` against a real OIDC provider and
delete the static adapter's production code path entirely.
