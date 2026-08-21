# MSG-0075 — TASK-0025 Execution Record: the accepted ADR set is promoted

**Status:** RECORD — no decision requested
**From:** Claude Code
**To:** Architecture Lead
**Date:** 2026-08-21
**Task:** TASK-0025 — promote ADR-0018 … ADR-0022 into the accepted decision register
**Authority:** MSG-0073 (AUTHORIZED), answering MSG-0072; the acceptance itself is **MSG-0071**
**Related:** MSG-0070 (TASK-0024 execution), MSG-0071, MSG-0072, MSG-0073, MSG-0074, WP-0009 §7
**Work package:** WP-0009 — Employee Policy Assistant

---

## 1. Result

**ADR-0018, ADR-0019, ADR-0020, ADR-0021 and ADR-0022 now exist in `docs/decisions/`** — the
authoritative decision register — and their drafts in `implementation/decisions/` are marked
**RATIFIED** with their proposed text retained unchanged.

**The WP-0009 ADR set is complete: ADR-0017 … ADR-0022 are all accepted architecture.** ADR-0017 was
promoted by the Architecture Lead in `d9c4524`; this task promoted the remaining five. The gap
MSG-0072 raised is closed.

**Being documentary, this task produced no test count and claims none.** Its verification is a `diff`
per record, quoted in §3.

**Nothing else was authorized.** No implementation, no provider/model/framework/runtime selection, no
permission, security-boundary, Supervisor or schedule change, and **no task marked READY** — A-SURVEY,
A-STACK and T-0 remain unauthorized.

## 2. Acceptance criteria — MSG-0073, each with its evidence

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| 1 | ADR-0018 … ADR-0022 each exist in `docs/decisions/` using the established ADR convention | **MET** | Five new files; header shape matches the ADR-0017 promoted copy exactly — `**Status:** **ACCEPTED** — promoted from …(PROPOSED) by MSG-0071`, plus an `**Accepted by:** Architecture Lead — MSG-0071` line after `**Proposed by:**` |
| 2 | Promoted records preserve accepted content and traceability | **MET** | `diff` per pair shows **only** the Status block and the added `Accepted by` line. **Zero body differences** — §3 |
| 3 | No implementation authorization is introduced | **MET** | §4. The word `READY` does not occur in any promoted file; no provider/model/runtime is selected; the three MSG-0071 conditions re-verified in the promoted copies |
| 4 | COMMS and queue records updated consistently | **MET** | This record, the COMMS register, `CLAUDE-TASKS.md` (status board, task section, ledger), `implementation/status/current.md`, the ADR index, WP-0009 §6.2/§7/§8, and `checkpoints/TASK-0025.md` |
| 5 | COMPLETE reported only after repository verification | **MET** | §3 ran against the files on disk before this record was written; commit and push precede the completion report |

## 3. Verification — the diffs, quoted

Each promoted file was produced by **copying its draft byte for byte** and then editing exactly two
things. That is a deliberate method choice: the body is never retyped, so it cannot drift, and the
`diff` below is a real check rather than a restatement of intent.

Command: `diff implementation/decisions/ADR-00NN-<slug>.md docs/decisions/ADR-00NN-<slug>.md`
(`<` is the draft, `>` is the promoted copy.)

| ADR | Diff result | Body differences |
|---|---|---|
| **ADR-0018** | `3,5c3` — draft RATIFIED block ↔ promoted ACCEPTED line; `7a6` — `Accepted by` added | **none** |
| **ADR-0019** | `3,5c3`; `8a7` — `Accepted by` added | **none** |
| **ADR-0020** | `3,5c3`; `8a7` — `Accepted by` added | **none** |
| **ADR-0021** | `3,5c3`; `7a6` — `Accepted by` added | **none** |
| **ADR-0022** | `3,5c3`; `7a6` — `Accepted by` added | **none** |

**Every hunk is in the header. No hunk is in a body.** The queue section states that any body
difference is a defect rather than a formatting preference; there is none to report.

**The line offsets differ between ADRs for a reason worth stating**, because it looks like an
inconsistency and is not: ADR-0019 and ADR-0020 carry an extra header line each — the MSG-0071
condition attached to their acceptance — so their `Accepted by` line lands at 7 rather than 6. Those
condition lines were **carried into the promoted copies deliberately**; they are the traceability
MSG-0073 requires preserved.

**No accepted ADR was modified.** Pre-commit `git status --porcelain` shows five **new** (`??`) paths
under `docs/decisions/` and **no modified path there** — ADR-0001 … ADR-0017 are untouched, including
the lead's own ADR-0017 promotion.

## 4. The three MSG-0071 conditions — re-checked in the promoted copies

MSG-0072's pre-promotion pass verified these in the **drafts**. They were re-checked here because
**promotion is the step where they could be lost**, and a verification of the source is not a
verification of the copy.

| Condition | Verdict | Evidence in the promoted copy |
|---|---|---|
| No provider, model, framework or runtime selection | **HOLDS** | A search of the five promoted files for concrete technology names returns hits in **ADR-0022 only**, both citations of ADR-0003: §4 — *"ADR-0003 notes Ollama as a practical initial local runtime and is explicit that this is 'an implementation decision, not a platform identity' — this ADR does not elevate it"* — and *Deliberately not decided here*: *"this ADR does not select it or anything else."* The wording MSG-0073 called load-bearing survived intact |
| ADR-0019's normalization rules stay deferred | **HOLDS** | The promoted copy still reads *"**This ADR is not complete for production use, deliberately**"*, §6 still defers the rule set to empirical corpus evidence while fixing only the three constraints that hold regardless, and *"this ADR must be amended with the empirical rule set before production use"* is unchanged. **No normalization rule was invented** |
| ADR-0017's entailment model and thresholds stay open | **HOLDS** | ADR-0017 was **not touched by this task**. Its promoted copy still reads *"The **entailment model and its acceptance thresholds are not selected here**… chosen and evaluated under SPEC-0020"* |

**Nothing in the five promoted files authorizes implementation.** The literal string `READY` does not
occur in any of them.

## 5. What was changed

| Path | Change |
|---|---|
| `docs/decisions/ADR-0018-approved-document-authority-and-lifecycle.md` | **NEW** — promoted copy |
| `docs/decisions/ADR-0019-bilingual-policy-semantics.md` | **NEW** — promoted copy |
| `docs/decisions/ADR-0020-retrieval-projection-and-index-boundary.md` | **NEW** — promoted copy |
| `docs/decisions/ADR-0021-employee-question-privacy-and-retention.md` | **NEW** — promoted copy |
| `docs/decisions/ADR-0022-inference-locality-and-provider-boundary.md` | **NEW** — promoted copy |
| `implementation/decisions/ADR-0018…ADR-0022` | **Status line only** — `ACCEPTED … awaiting promotion` → `RATIFIED … promoted to <path>, which is the authoritative copy`. Bodies untouched |
| `implementation/decisions/README.md` | Five index rows: *awaiting promotion* → **promoted**, naming the accepted path; a promotion section recording the method and the conditions re-check |
| `docs/program/work-packages/WP-0009-employee-policy-assistant.md` | §6.2 A-ADR row: promotion recorded; §7 supersession note; §8 prerequisite note. **All additive and declared** |
| `implementation/operations/CLAUDE-TASKS.md` | Status board, TASK-0025 section, communication ledger |
| `implementation/status/current.md` | Current position, open communications |
| `implementation/comms/README.md` | Register rows for MSG-0074 (closed) and MSG-0075 |
| `implementation/operations/checkpoints/TASK-0025.md` | **NEW** — checkpoints 1 and 2 |

## 6. Observations — recorded, no ruling requested

**6.1 — The queue gap recurred and was repaired in time; the collision did not recur.** Stated
carefully, because the two are easy to conflate and MSG-0074 records both. **The MSG-0044 gap did
recur** — MSG-0073 authorized TASK-0025 and `grep -c "TASK-0025"` on the queue returned 0, the
**eighth** occurrence. MSG-0074 repaired it before the Supervisor's next cycle, so the task was already
the single READY task when this run started and the Supervisor never idled on a healthy-looking
`no READY task`. **Repaired in time is not prevented**, and the count is the only thing that keeps the
pattern visible. What genuinely did not recur is the **sibling-file collision**: exactly one MSG-0073
file and no `TASK-0025-*.md` specification at all — the first clean authorization in four.

**6.2 — The supervisor's recorded head lagged this session's actual head by one commit, harmlessly.**
`heartbeat.json` reported `"head": "9c533b28…"` while `git rev-parse HEAD` returned `d79801f`. The
supervisor's 20:47:18Z cycle began at the same moment the previous session pushed `d79801f`, so it
recorded the pre-push head. **This is not the BLK-0006 mid-run movement condition**: this session
verified `d79801f` directly before touching anything, local equalled `origin/main` throughout, and the
abort rule is about the repository moving *under* a running session. Recorded because a future reader
comparing the heartbeat against the checkpoint would otherwise see two different heads and reasonably
suspect one.

**6.3 — The ADR-0017 precedent has a wrinkle worth knowing before the next promotion.** Comparing the
lead's promoted ADR-0017 against its draft shows small line-**wrapping** differences in the body — same
words, different line breaks. Nothing is missing or altered in substance. This task did not reproduce
that: the copy-then-edit-headers method makes the bodies byte-identical, which is strictly stronger and
makes the `diff` check meaningful. **No correction to ADR-0017 is proposed** — it is not this task's
record to touch, and the difference is cosmetic.

## 7. What this record does not do

- It does not accept architecture. **MSG-0071 did that**; this task carried the accepted decisions into
  the register the repository treats as authoritative.
- It does not authorize implementation, or mark **A-SURVEY**, **A-STACK** or **T-0** READY.
- It does not select any provider, model, embedding technology, index technology, framework or runtime.
- It does not change any permission, security boundary, Supervisor behaviour, or schedule.
- It does not amend ADR-0019's deferred normalization rules, or ADR-0017's open entailment model and
  thresholds.
- **It requests no decision.**

## 8. State after this task

**No task is READY.** TASK-0025 is COMPLETE and the queue is empty of authorized work. The next action
is the Architecture Lead's: MSG-0071 §*Next architecture boundary* states that only after the accepted
set is reconciled and promoted may the Lead consider authorizing the next bounded architecture task —
**A-SURVEY** or **A-STACK** from WP-0009 §6.2. **That reconciliation is now done.**

Whichever is authorized must be **reconciled into `CLAUDE-TASKS.md` as the single READY task, in the
same commit as the authorization**, or the supervisor will idle on a healthy-looking `no READY task` —
the failure mode MSG-0044 first recorded, MSG-0069 observed live, and MSG-0074 recorded for the eighth
time with this very task.

**One OPEN message remains: MSG-0060**, carrying the unaddressed observation about colliding *task
specification* files. It blocks nothing.
