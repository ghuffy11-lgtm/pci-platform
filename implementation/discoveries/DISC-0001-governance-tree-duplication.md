# DISC-0001 — Duplicated Governance Documents Across `knowledge/` and `docs/`

**Status:** Recorded — no action taken
**Date:** 2026-08-19
**Work package:** WP-0001
**Communication:** `implementation/comms/MSG-0003-repository-layout-and-document-corrections.md` (Issue 4)

## Discovery

Six governance/architecture concerns exist as separate files in both `knowledge/` and `docs/`
with differing content. `AGENTS.md:9-12` directs agents to read the `knowledge/` copies;
`README.md:19-25` and `CLAUDE.md` direct them to the `docs/` copies.

## Impact

An implementation agent following `AGENTS.md` and one following `CLAUDE.md` read different
documents. `knowledge/engineering/repository-map.md` and `docs/architecture/repository-map.md`
in particular could yield different conclusions about permitted directories.

Constitution principle 13 (No Silent Architecture Changes) is harder to enforce when two
divergent copies of the same architecture statement exist.

## Action taken

None. I implemented against the `docs/` tree because WP-0001's Source Authority section names
`docs/` artifacts (SPEC-0004 … SPEC-0012, Platform Kernel Architecture, Canonical Knowledge
Object Schema).

I did not reconcile, merge, or delete anything — that is an architecture-ownership decision.

## Recommendation

Designate one tree authoritative and make the other a generated projection or remove it. If
`knowledge/` is intended as the canonical semantic store (per `ADR-0004 Git Source of Truth` and
the Knowledge Fabric design), the `docs/` tree may be the rendering — but that relationship is
currently undocumented in either direction.
