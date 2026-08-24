# MSG-0133 — Architecture Lead ruling: Q13 / Release 1 temporal scope

**Status:** **DECIDED** — 2026-08-24
**Ruling:** **Release 1 supports the current/“now” temporal frame only.** Historical and future temporal frames are out of scope for Release 1.
**Authority:** Architecture Lead decision supplied for Q13, following MSG-0132 §9 / EPA-0006 §4.13 Q13
**Related:** MSG-0132, MSG-0129, ADR-0018, EPA-0006 §3 and §4.13

## Decision

Q13 is **DECIDED: Release 1 temporal scope is A — current/“now” only.**

Release 1 retrieval and answerability are scoped to the current temporal frame (`T = now`). Historical
and future temporal frames are **not required** for Release 1 and are not a supported answer path.

The existing fail-closed behavior remains mandatory: if a request requires a temporal frame outside the
Release 1 supported “now” frame, the system **MUST ABSTAIN** rather than answer using an incorrect, stale,
or otherwise inapplicable interval.

Historical and future temporal support may be considered later as a separately authorized product /
architecture capability. This ruling does not authorize that later capability, change any retrieval-engine
selection authority, weaken AMD-01 / strict Shape-1, or clear any candidate or gate.

## Effect on the referred question

Q13 is no longer open. GAP-D in EPA-0006 §4.13 is discharged as a scope decision: the topology need only
serve the Release 1 current/“now” frame. I7 remains a structural pattern and remains **NEVER MEASURED**;
its broader arbitrary-`T` implications are not a Release 1 requirement.

The fail-closed default recorded before the ruling is preserved, not relaxed: a non-now temporal request
is outside the supported Release 1 answer path and must abstain.

## ADR / architecture application

ADR-0018’s Release-1 boundary is clarified in place to state that Release 1 answers are restricted to the
current/“now” temporal frame, while the effective-date and supersession data remain captured so a future
separately authorized capability can be added without losing historical information.

EPA-0006 §4.13 Q13 is updated from **Surfaced, NOT decided** to **DECIDED**, with this message as the
ruling authority. No other verdict, gate, candidate status, or engine-selection authority changes.

## Traceability

- **Q13 surfaced:** MSG-0132 §9 / EPA-0006 §4.13
- **Historical questions already out of scope:** ADR-0018 §7 / MSG-0056a D11
- **Effectivity semantics:** ADR-0018 §4
- **Release 1 decision:** this message
- **Fail-closed behavior:** EPA-0006 Q13 default; retained unchanged

## What this does not authorize

- No retrieval engine, vector store, index technology, model, runtime, provider, or framework selection.
- No implementation task is authorized or marked READY by this ruling.
- No historical/future temporal capability is authorized.
- No gate is weakened and no prior verdict changes.
