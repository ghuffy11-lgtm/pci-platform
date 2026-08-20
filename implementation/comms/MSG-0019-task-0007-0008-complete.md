# MSG-0019 — TASK-0007 and TASK-0008 Complete: WP-0001 Ready for the Completion Decision

**Status:** **CLOSED** — TASK-0009 decided 2026-08-19; WP-0001 declared COMPLETE (MSG-0020(b), MSG-0022, MSG-0023).
**Raised:** 2026-08-19
**Raised by:** Claude Code (implementation agent)
**Type:** Record — task completion
**Authority:** MSG-0018 (TASK-0007 authorized; continuation to TASK-0008 permitted; TASK-0009 excluded)

## TASK-0007 — full re-verification — COMPLETE (gate G4)

Run against the clean-room stack TASK-0006 built, confirmed unchanged by its volume creation
timestamp (`2026-08-19T18:25:02Z`). Non-destructive: no volume re-initialisation, no manual SQL.

| Tier | Result |
|---|---|
| Unit | **102 pass / 0 fail** |
| Contract | **101 pass / 0 fail** |
| Integration (clean-room PostgreSQL) | **26 pass / 0 fail / 0 skipped / 0 cancelled** |
| **Total** | **229 pass / 0 fail** — every tier non-zero |

ADR-0016 re-proven live: `super=false bypassrls=false`, FORCE RLS on **6 of 6** RLS-enabled tables,
6 policies, and the named tests for cross-tenant reads, unset tenant context returning no rows,
cross-tenant relationship rejection, and audit append-only all passing.

**What changed is the basis of the evidence, not the verdicts.** All ten acceptance criteria were
already MET. They now rest on a database the repository built itself rather than one I repaired by
hand in TASK-0001. That was the whole point of the TASK-0006 → TASK-0007 sequence.

## TASK-0008 — record reconciliation — COMPLETE (gate G5)

Executed under MSG-0018's continuation clause, without stopping in between.

| Record | State |
|---|---|
| WP-0001 report | Sections 13 and 14 added; sections 11–12 left intact, so the progression from "written" to "verified" to "reproducible" stays visible |
| `implementation/status/current.md` | Headline **VERIFIED AND REPRODUCIBLE**; tiers, AC verdicts, queue board, discoveries, and communications updated |
| Queue board + ledger | TASK-0006/0007/0008 COMPLETE; MSG-0018 and MSG-0019 recorded |
| Discoveries | DISC-0007 and DISC-0008 carry clean-room confirmations; DISC-0009 raised |
| Blockers | none open |
| Checkpoints | TASK-0006 (2) and TASK-0007 (1) written after verification, never in anticipation |

## One boundary finding — DISC-0009

The routine `/data` check reported 18 paths under `/home/claude`. Three are OS-provided shell
dotfiles. The rest are `/home/claude/.docker/buildx/*` — **Docker CLI client state created by the
image builds**: builder refs, a lock file, a node id. No source, no build output, no configuration,
no data, no credential.

It is still outside `/data`, and contract v0.2 forbids that with only a named `~/.ssh` exception.
`~/.docker` sits in the same category — account-level tool state rather than project content — but
I will not widen an explicit exception by inference.

**Not deleted.** Tidying the operator's account so a check reports clean would be exactly the wrong
instinct: it would make the record look better while changing nothing real.

Two options, in DISC-0009: extend the exception to tool state, or keep the boundary literal and set
`DOCKER_CONFIG=/data/pci-platform/.docker`. The second is stricter and keeps the rule trivially
checkable — "nothing of ours outside `/data`, full stop" is far easier to verify than a list of
tolerated exceptions.

## WP-0001 completion criteria — where each stands

From ROADMAP section I:

| # | Criterion | State |
|---|---|---|
| 1 | All ten acceptance criteria met | **MET** — report §11, re-based in §14 |
| 2 | Stack reproducible from a clean checkout | **MET** — §13, gate G3 |
| 3 | All three tiers pass with non-zero counts | **MET** — §14, 229 pass |
| 4 | ADR-0016 proven against a live database | **MET** — §14.2 |
| 5 | Security requirements checked | **MET** — no credential in the repository; runtime role without SUPERUSER/BYPASSRLS; audit append-only; no secret in health output |
| 6 | Migrations and configuration documented | **MET** — `.env.example`, compose header, `services/kernel/README.md` |
| 7 | Operational impact considered | **MET** — bootstrap contract, `/data` boundary, DISC-0009 |
| 8 | Records reconciled | **MET** — gate G5 |
| 9 | Unresolved limitations recorded | **MET** — below |
| 10 | **Architecture lead declares it complete** | **OUTSTANDING — TASK-0009** |

## Unresolved limitations, stated plainly

- **DISC-0009** — Docker CLI state outside `/data`; boundary scope needs a ruling.
- **DISC-0006** — record files acquire CRLF, which silently defeats anchored edits. TASK-0003 would
  fix it; not authorized.
- Images are **tag-pinned, not digest-pinned**. Recorded since the original report; unchanged.
- The **static identity adapter is a development fixture**, prohibited in production, warning loudly
  at startup (ADR-0003, DISC-0003).
- **DISC-0002** — the in-memory adapter's test-fidelity gap is mitigated, not eliminated.
- The Execution Supervisor is built and tested but **not installed or enabled** (MSG-0011).

## Decision required — TASK-0009

Every criterion except the last is met, with evidence recorded and reconciled. The remaining one is
yours by definition: **Claude Code does not self-certify completion.**

Either declare WP-0001 complete, or name the gaps that prevent it and I will record them as tasks.

Also open: DISC-0009's boundary ruling, MSG-0011 (supervisor install), TASK-0003 (line endings).
