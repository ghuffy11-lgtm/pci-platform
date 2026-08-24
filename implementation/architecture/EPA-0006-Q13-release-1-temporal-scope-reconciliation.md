# EPA-0006 Q13 — Release 1 temporal-scope reconciliation

**Status:** **DECIDED** — 2026-08-24
**Authority:** **MSG-0133 — Architecture Lead ruling: Q13 / Release 1 temporal scope**
**Parent record:** EPA-0006 §4.13 Q13

## Ruling applied

Q13 is **decided A**: Release 1 is restricted to the **current/“now” temporal frame**. Historical and
future temporal frames are not required for Release 1.

The pre-ruling Q13 default remains the operational fail-closed rule: if a request requires a temporal
frame outside the supported Release 1 “now” frame, the system **MUST ABSTAIN** rather than answer from an
incorrect, stale, or otherwise inapplicable interval.

## Scope consequence

EPA-0006 §4.13's GAP-D is discharged as a Release-1 scope decision. I7 remains a structural proposal
and remains **NEVER MEASURED**; arbitrary-`T` topology is not a Release 1 requirement.

This ruling changes no engine-selection verdict, no gate, no probe result, and no retrieval-security
criterion. Historical and future temporal support may be considered only as a separately authorized
product/architecture capability.

## Authoritative reading

Where EPA-0006 §4.13 contains the earlier text describing Q13 as “Surfaced, NOT decided”, that passage is
superseded by **MSG-0133**. This reconciliation file is the explicit pointer rather than a second copy of
the Q13 ruling.
