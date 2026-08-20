# MSG-0040 — TASK-0015 execution record: discoveries index reconciled

**Status:** RECORD — applied and verified; **no decision requested**
**From:** Claude Code
**To:** Architecture Lead
**Related task:** TASK-0015
**Authorization:** MSG-0039 (a) and MSG-0039 (b) — both DECIDED
**Date:** 2026-08-20

## 1. What was authorized

MSG-0039 authorized a narrowly scoped reconciliation of `implementation/discoveries/README.md`
against the actual `DISC-*.md` records: enumerate the records, represent each exactly once with an
accurate title and current status, preserve the records unchanged, record execution evidence in
COMMS, and commit and push.

The authorization exists **twice under the same number**. See §6.

## 2. What was found

The index carried **three** rows. **Nine** `DISC-*.md` records exist.

```text
$ ls implementation/discoveries/
DISC-0001-governance-tree-duplication.md
DISC-0002-adapter-test-fidelity.md
DISC-0003-dev-identity-adapter.md
DISC-0004-compose-storage-boundary.md
DISC-0005-test-glob-false-green.md
DISC-0006-crlf-defeats-anchored-edits.md
DISC-0007-initdb-role-provisioning-defect.md
DISC-0008-compose-kernel-service-incomplete.md
DISC-0009-docker-client-state-outside-data.md
README.md
```

**Six records were missing from the index: DISC-0004 through DISC-0009.** Every one of them was
raised during or after host verification, and they include the two defects that made a clean checkout
plus `docker compose up` produce a broken stack (DISC-0007, DISC-0008) and the one that touches the
hard `/data` boundary rule (DISC-0009). A reader of the index alone would have seen none of them.

**Zero index rows were stale, and zero index rows lacked a record.** The drift was purely omission.

## 3. What was changed

| File | Change |
|---|---|
| `implementation/discoveries/README.md` | Six missing rows added (DISC-0004…DISC-0009); DISC-0002 wording aligned to its record; ID column linked to the records; a reconciliation note added |
| `implementation/comms/MSG-0040-task-0015-execution-record.md` | This record |
| `implementation/comms/README.md` | Two missing MSG-0039 rows + the MSG-0040 row |
| `implementation/operations/CLAUDE-TASKS.md` | TASK-0015 COMPLETE; result section; MSG-0039 (a)/(b) and MSG-0040 ledger rows |
| `implementation/status/current.md` | Reconciled, including the stale DISC-0009 row — see §5 |
| `implementation/operations/checkpoints/TASK-0015.md` | Checkpoints 1 and 2 |

**No `DISC-*.md` record was modified.** Direct evidence, not an assertion — the pre-commit
`git status --porcelain` in checkpoint 2 shows no `DISC-*.md` file among the changes.

Every status in the index is transcribed from the record's own header line:

| ID | Record header status (verbatim, condensed) |
|---|---|
| DISC-0001 | "Recorded — no action taken" |
| DISC-0002 | "Recorded — mitigated, not eliminated" |
| DISC-0003 | "Recorded" |
| DISC-0004 | "RESOLVED — 2026-08-19. The daemon `data-root` question is answered by a pre-staged `/data/docker/daemon.json`…" |
| DISC-0005 | "CORRECTED 2026-08-19 — the target-platform claim was WRONG and is disproven by measurement… confined to Git Bash / MSYS on Windows" |
| DISC-0006 | "RESOLVED (2026-08-20, TASK-0003)… tracked `*.md` with CRLF went 150 -> 0" |
| DISC-0007 | "RESOLVED 2026-08-19 by TASK-0004 (MSG-0012)" |
| DISC-0008 | "RESOLVED 2026-08-19 by TASK-0005 (MSG-0012, option 1)" |
| DISC-0009 | "CLOSED — ACCEPTED, NOT A VIOLATION. Ruled 2026-08-19 by MSG-0020(b) / MSG-0022 / MSG-0023" |

## 4. Stop conditions — checked, none fired

| Stop condition | Result |
|---|---|
| A discovery record has ambiguous or contradictory status/title information | **No.** All nine carry a single unambiguous status header. The one apparent exception was checked and is not one: `grep "Status:.*OPEN"` hits `DISC-0006` line 17, but reading lines 15–21 shows that line is **quoted `grep` output inside a fenced example block** — the file's own status (line 3) is RESOLVED |
| An index entry has no corresponding record and cannot be safely resolved | **No.** All three pre-existing rows have records |
| A record materially conflicts with its index entry in a way needing architectural judgment | **No.** The three pre-existing rows agree with their records |
| Anything outside the exact index-reconciliation scope is required | **No** — with one judgment call declared in §5 |

## 5. One judgment call, declared

`implementation/status/current.md` §*Discoveries* keeps its own nine-row discovery table, and one row
contradicted its record:

```text
| DISC-0009 | Docker CLI writes client state to `/home/claude`, outside `/data` | **OPEN** |
```

The DISC-0009 record reads **"CLOSED — ACCEPTED, NOT A VIOLATION"**, ruled by MSG-0020(b) /
MSG-0022 / MSG-0023. It was corrected to match.

**Why this was judged in scope rather than reported and left:**

- MSG-0039 (a) §4 authorizes correcting stale index rows "only where the underlying discovery record
  provides unambiguous current information". The DISC-0009 record is unambiguous and its ruling is
  cited in three separate messages.
- MSG-0039 (a) §7 authorizes updating "the task/status documentation required to keep the repository
  consistent", and CLAUDE.md Rule 12 requires reconciling `current.md` before reporting. Leaving the
  row would have **created** a fresh contradiction at the moment the discoveries index became
  correct — the opposite of what this task exists to do.
- It changes no discovery substance and no architectural decision; it makes a second index agree with
  a record that has been settled since 2026-08-19.

The same table also had a structural defect: it was declared with two columns (`| ID | Subject |`)
while DISC-0006 through DISC-0009 supplied three cells, so the rendered page silently dropped the
status of those four rows. The header was widened to three columns to match the data already there.

Both changes are called out here rather than folded in quietly, because "index reconciliation" was
authorized for `discoveries/README.md` by name and this is a second file. If the lead reads either as
outside the grant, say so and it will be reverted.

## 6. Duplicate MSG-0039 — reported, not renumbered

**The authorization for this task exists twice under the same number.** This is the third
duplicate-numbered message in the project, after MSG-0020 (a)/(b) and MSG-0033 (a)/(b).

| | File | Commit |
|---|---|---|
| MSG-0039 (a) | `MSG-0039-architecture-decision-discoveries-index-reconciliation.md` | `b123361` "Authorize discoveries index reconciliation" |
| MSG-0039 (b) | `MSG-0039-architecture-decision-discovery-index.md` | `dc307fa` "docs(comms): authorize discoveries index reconciliation" |

**They do not conflict.** Both are DECIDED, from the Architecture Lead, related to TASK-0015, and
authorize the same work with the same forbidden list and materially the same stop conditions. A
clause-by-clause comparison is in `checkpoints/TASK-0015.md` §*Duplicate MSG-0039*. This task executed
the **stricter reading of both**, so every obligation in either file is satisfied.

Handling, per MSG-0035 decision 2 (which forbids renumbering existing duplicates): **both are
retained, registered as MSG-0039 (a) and (b), and neither is renumbered.** The numbering convention's
"on a collision, stop and report" clause governs *Claude allocating a number before creating a
message* — it forbids creating a further duplicate. This collision was already on disk and authored by
the lead; this session created no MSG-0039. It is reported here, which is the "report" half of that
rule.

**Worth stating plainly:** the rule adopted in MSG-0035 and applied in TASK-0013 constrains Claude's
allocation only. Nothing in the repository constrains the lead's, and this is the first collision
since the rule existed. MSG-0020 (a)/(b) cost three follow-up messages because those two
*contradicted*; MSG-0033 (a)/(b) and this pair cost nothing because they agree. As `comms/README.md`
already records, that difference has so far been luck rather than process. **No ruling is requested
and no protocol change is proposed** — TASK-0015 is not authorized to propose one.

### The register lag, third consecutive occurrence

**Neither MSG-0039 file had a row in the COMMS register** when this task allocated its number — the
same structural lag TASK-0013 hit with MSG-0035 and TASK-0014 hit with MSG-0037. Allocating "the next
number after the highest register row" would have produced **MSG-0039**, a *fourth* file under that
number. The directory-listing step caught it for the third time; both missing rows are reconciled in
this commit, as charter §5 directs. Recorded for continuity only — MSG-0038 §6 already stated that no
change is proposed, and none is proposed here.

## 7. Verification

| Success-gate requirement | Evidence |
|---|---|
| The index accurately represents every `DISC-*.md` file | Nine rows for nine records, one each; statuses transcribed from the record headers (§3) |
| All changes verified against the underlying records | Each row's status quoted from its record's header line in this file and in checkpoint 1 |
| Discovery records preserved unchanged | Pre-commit `git status --porcelain` lists no `DISC-*.md` — checkpoint 2 |
| No deletion or renumbering of discoveries | Nine files before, nine after; IDs unchanged |
| No blocker / Supervisor / permission / product / history change | Pre-commit `git status --porcelain` — nothing outside `implementation/`; no `BLK-*.md`, no `supervisor/`, no `services/` |
| Exactly one COMMS execution record, register reconciled in the same commit | This file; `comms/README.md` updated in the same commit |
| Committed and pushed | Checkpoint 2 quotes the commit and push output |

## 8. What remains

Nothing from this task. **No decision is requested.**

One item stays open and untouched, as it has since MSG-0034: that message is still `Status: OPEN` and
informational only — the TASK-0011 execution-path diagnosis, whose smoke test passed after the
correction it describes. Closing it is the lead's call; nothing depends on it.
