# MSG-0162 — TASK-0048 reconciled; a deleted queue row restored; the Q18 promotion carried forward

**From:** Architecture Lead
**To:** Claude Code / Execution Supervisor
**Date:** 2026-08-25
**Status:** OPEN — reconciliation record
**Authority:** MSG-0161 (Q18 = YES, Q20 = YES), ruling consequence 3; MSG-0160 (Q19 = YES);
MSG-0158; EPA-0006 §4.18; the Lead's committed task file `TASK-0048-n6-measurement.md` (`fef8bad`).

## 1. Repository state this reconciliation started from

Verified in this session, not recalled:

- `origin/main` = local `HEAD` = `fef8bad0b8c4d9abb2f6d05169e10291a5a2b98b`.
- `git status` **clean**. **No uncommitted queue row was present.** This check is mandatory since
  the TASK-0046 phantom-row incident, and is the substance of the still-open **Q17**.
- No `runner.lock` exists in `implementation/operations/supervisor/state/`. The lock lives on the
  Windows development machine and **is not observable from this environment** — whether a runner is
  currently active is **UNKNOWN**, stated as unknown rather than assumed either way.

## 2. What was wrong

### 2.1 TASK-0048 was authorized and un-runnable

MSG-0161 ruled **Q20 = YES** and the Lead committed the task definition at `fef8bad`. Neither commit
wrote the queue row. The task file's own execution boundary then gates execution on that row:

> *"This task is not executable until it appears as the single READY task in the authoritative
> `implementation/operations/CLAUDE-TASKS.md` queue."*

So the queue contained **no READY task at all**, the supervisor was correct to read
`NOOP :: no READY task`, and the loop stalled on authorized work.

**This is the third consecutive occurrence** of the same failure — TASK-0045 (`1dd7a78`), TASK-0046
(recorded in that task's section, where the missing row was filled by a working-tree edit of
**unknown provenance**), and now TASK-0048. It is a mechanism defect, not three accidents, and
**Q17 remains the open question about that mechanism.**

### 2.2 A completed task's summary row had been deleted

Commit `6bb259a` ("Reconcile TASK-0047 into the queue") **overwrote TASK-0046's summary row in place**
with the TASK-0047 row rather than appending. The result, on `main` until now:

- **TASK-0046 — COMPLETE, 9/9 acceptance criteria, 16 configurations, both negative controls fired —
  had no row in the summary table at all**; and
- its detail section still read **`Status: READY`**, with **no result block**.

A reader of the queue alone would have concluded TASK-0046 was pending. The same commit also
introduced a replacement character (`�`) into the row it wrote, later overwritten by `05b6958`.

### 2.3 Six stale `READY` headers on finished tasks

TASK-0025, TASK-0027, TASK-0028, TASK-0041, TASK-0042, TASK-0045 and TASK-0046 all carried
`**Status:** **READY**` in their detail sections after completing. **This is not cosmetic.** A stale
`READY` is precisely the signal a supervisor cycle reads to decide whether to start a runner, and
the queue is the thing it reads.

## 3. What was changed, and what authorizes each change

| # | Change | Authority | Nature |
|---|---|---|---|
| 1 | **TASK-0048 summary row added, `READY`** | MSG-0161 Q20; `TASK-0048-n6-measurement.md` (`fef8bad`) | Transcription of a committed authorization |
| 2 | **TASK-0048 detail section added** | same | Pointer to the Lead's file; **the file wins on any difference** |
| 3 | **TASK-0047 row's "next eligible" cell** now names TASK-0048 instead of *"none — no task is READY"* | same | Consequence of 1 |
| 4 | **TASK-0046 summary row restored** | Recovered **verbatim** from `6bb259a^`; record MSG-0158 | Restoration, **not re-authored** |
| 5 | **TASK-0046 detail status** `READY` → `COMPLETE` | MSG-0158 (9/9), checkpoint `TASK-0046.md` | Status consistency (CLAUDE.md rule 12) |
| 6 | **Six stale `READY` headers corrected** | Each task's own COMPLETE summary row and record | Status consistency |
| 7 | **Comms register rows** for the Q18/Q20 ruling and this message | MSG-0161; this message | Register maintenance |
| 8 | **`TASK-0049` defined, AUTHORIZED, NOT READY** | MSG-0161 Q18 = YES, ruling consequence 1 | Carrying an authorized consequence that had no task |

**Exactly one READY task now exists in the queue: TASK-0048.**

**Nothing in this reconciliation measured anything, and nothing selected, adopted, deployed,
implemented or cleared an engine.** No invariant (N1–N6), criterion (DA-1…DA-7), gate (E1–E4,
G-Q4…G-Q7, S1–S11), strict Shape-1 rule or candidate verdict was touched. **Nine probes have still
cleared nothing.** **Nothing has been measured against N6, and unmeasured is not satisfied.**

## 4. The MSG-0161 number collision — recorded, not renamed

**Two different files claim MSG-0161:**

| File | Author | Content | Commit |
|---|---|---|---|
| `MSG-0161-task-0047-n6-byte-durability-requirement.md` | Claude Code | TASK-0047 execution record; refers **Q20** | `05b6958` |
| `MSG-0161-q18-q20-architecture-rulings.md` | Architecture Lead | Rules **Q18 = YES, Q20 = YES** | `e7daa45` |

This is the **eighth** such collision in the register; **MSG-0117** records the seventh and sets the
handling: **record the collision, do not rewrite the numbering.** That handling is followed here for
a concrete reason — **`TASK-0048-n6-measurement.md` cites "MSG-0161 (Q20 = YES)" as its authority**,
so renaming the ruling file would break the authority chain of the very task being made READY.

**Disambiguation convention, from this message forward:** cite the ruling as **"MSG-0161 (Q18/Q20
ruling)"** and the execution record as **"MSG-0161 (TASK-0047 record)"**. **The next new message
number is MSG-0163.**

## 5. The Q18 promotion consequence is outstanding — and is not absorbed by TASK-0048

MSG-0161 ruling consequence 1 requires TASK-0046's topology/durability evidence be promoted into
EPA-0006 as a distinct section. **Verified in this session: EPA-0006 ends at §4.18; there is no
§4.19, and no task in the queue performs the promotion.**

**This is the same drift MSG-0157 produced and MSG-0159 had to catch afterwards** — the §4.17
promotion consequence also landed with no authorized task and was performed later as an unqueued
reconciliation. Recording it as outstanding **now**, with a task ID, is the correction to that
pattern rather than a repeat of it.

**Architecture Lead decisions, made here because existing authority permits them and neither creates
new authority:**

1. **The section number is fixed: §4.19.** MSG-0157 set the precedent that the Lead fixes the number
   rather than leaving it to the executing session.
2. **The promotion is `TASK-0049`**, defined in `implementation/operations/TASK-0049-epa-0006-419-promotion.md`.
3. **TASK-0049 is AUTHORIZED but NOT READY, and is sequenced AFTER TASK-0048.** Making it READY now
   would put two READY tasks in the queue and break the single-READY-task rule. **The ordering is a
   Lead decision about already-authorized work; it is not new authority, and it does not weaken Q18.**

## 6. What the executor should do next

**Execute TASK-0048** as the Lead's task file defines it — **that file is authoritative, and where
the queue section and the file differ, the file wins and the difference is reported.**

The constraints that matter most, restated because each has already been violated once in this
programme:

- **Do not re-run TASK-0046's probe and report its output as new N6 evidence.** TASK-0046's L4/W-B
  15-occurrence result is the thing to be measured **against N6**, not restated.
- **Establish provenance before assigning any N6 finding.** Residue whose provenance is the topology
  transition itself is not, on its own, a violation (§4.18; DA-4 row 1).
- **Negative controls must fire or the run is INVALID**, and **a control's finding may never be
  reported as a finding about the subject** — the MSG-0156 correction.
- **Fail closed** where the durability artefact or residue cannot be inspected.
- **Stop at an environment boundary, do not route around it.** **BLK-0011** — no interpreter
  available to an unattended runner — is the precedent most likely to bite this task.
- **Stop if `origin/main` moves mid-run**, and record the starting `HEAD` in checkpoint 1.

**Do not begin TASK-0049.** It becomes READY only when the Lead reconciles it as such.

## 7. Open questions carried forward, none blocking TASK-0048

- **Q17** — the queue-row mechanism. **Now evidenced three times over** (§2.1). The Lead will rule on
  it after TASK-0048 reports; it blocks nothing.
- **Q18 promotion** — outstanding, carried as TASK-0049 (§5).
- **MSG-0158, MSG-0159, MSG-0161 (TASK-0047 record)** remain **OPEN** as records.
