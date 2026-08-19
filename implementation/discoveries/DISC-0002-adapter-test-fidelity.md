# DISC-0002 — In-Memory Adapter Test Fidelity Gap

**Status:** Recorded — mitigated, not eliminated
**Date:** 2026-08-19
**Work package:** WP-0001
**Related:** `implementation/blockers/BLK-0001-no-execution-environment.md`

## Discovery

With no PostgreSQL instance available, acceptance criteria AC-03 through AC-08 are verified
against an in-memory implementation of the `KnowledgeRepository` port.

An in-memory adapter is a second implementation of the same semantics. It can pass a test suite
that the PostgreSQL adapter would fail — for example on transaction isolation, optimistic
concurrency under genuine contention, foreign-key enforcement, `JSONB` round-tripping, timestamp
precision, or row-level-security behaviour.

**Passing tests therefore do not demonstrate that the PostgreSQL adapter is correct.**

## Mitigation

1. **Shared contract suite.** `test/contract/repository.contract.ts` exports a suite
   parameterised by a repository factory. It is executed against the in-memory adapter today and
   against PostgreSQL when a host exists — the same assertions, not a parallel suite.
2. **No behavioural branching.** The application layer contains no adapter-specific code paths.
3. **Explicit skip, never silent pass.** The integration tier prints a visible
   `SKIPPED — PCI_TEST_DATABASE_URL not set` notice and is reported as skipped rather than passed.
4. **Committed DDL.** Schema is plain SQL in `migrations/`, reviewable without executing it.

## Residual risk

The following remain entirely unverified and must not be described as working:

- migration application and idempotency;
- row-level-security policy behaviour (ADR-0016 layer 3);
- composite foreign-key rejection of cross-tenant relationships;
- optimistic-concurrency behaviour under real concurrent transactions;
- `JSONB` serialisation of attributes and provenance payloads.

## Recommendation

Treat AC-02 and the integration tier of AC-09 as **not met** until executed. Resolve MSG-0001.
