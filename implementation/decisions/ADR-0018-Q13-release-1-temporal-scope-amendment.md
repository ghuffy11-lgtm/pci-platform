# ADR-0018 Q13 — Release 1 temporal-scope amendment

**Status:** **ACCEPTED AND APPLIED IN PLACE** — 2026-08-24, **MSG-0133**
**Amends:** `docs/decisions/ADR-0018-approved-document-authority-and-lifecycle.md`
**Related:** EPA-0006 §4.13 Q13; MSG-0132

## Decision

Release 1 supports the **current/“now” temporal frame only**.

Historical and future temporal frames are not required for Release 1 and are outside the supported
Release 1 answer path. If a request requires a temporal frame outside the supported current/“now” frame,
the system **MUST ABSTAIN** rather than answer using an incorrect, stale, or otherwise inapplicable
interval.

This amendment does not remove or weaken ADR-0018's requirement to capture effective-date and
supersession data. Those data remain required so a later historical/future capability can be introduced
without losing the underlying history.

Historical and future temporal support is **not authorized by this amendment**; it requires a separately
authorized product/architecture capability.

## Application

The authoritative ADR-0018 copy was updated in place under MSG-0133. The amendment is retained here as
the implementation decision record, following the repository's established amendment pattern used for
ADR-0020 AMD-01.

## Non-effects

- No retrieval engine or technology selected.
- No implementation task authorized or marked READY.
- No retrieval/security gate weakened.
- No candidate verdict changed.
- Fail-closed behavior preserved.
