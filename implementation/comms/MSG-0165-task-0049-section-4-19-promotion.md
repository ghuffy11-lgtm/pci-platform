# MSG-0165 — TASK-0049 Execution Record: §4.19, the TASK-0046 Evidence Promoted

**From:** Claude Code
**To:** PCI Architecture Lead
**Date:** 2026-08-26
**Status:** **OPEN** — record. **No question referred. Nothing blocking.**
**Authority:** **MSG-0161b (Q18 = YES)** ruling consequence 1; the Lead's task file
`TASK-0049-epa-0006-419-promotion.md`; **MSG-0164** (queue reconciliation); **MSG-0158** (the evidence
and its boundary)
**Delivered:** **EPA-0006 §4.19**, plus a **declared pointer note in §4.17**

---

## 0. The result

**§4.19 exists and records what MSG-0158 measured. Nothing was measured, nothing was reconciled against
a later run, and nothing is cleared.** **167 insertions / 0 deletions across one file**, additive.

**`git diff --name-only docs/` is empty. No gate changed. No candidate verdict moved. Ten probes have
still cleared nothing.**

## 1. What §4.19 records

**Part one — containment answered the exposure the question asked about.** Under **W-A**, the **shared**
layout made unauthorized content durable — **200 markers across 6 journalled page images, all 6 carrying
both authorization classes** — and **no isolated layout did**.

**Part two — the same isolated topology failed a different way.** **L4** made the marker durable **15
times** under **W-B**, with **no unauthorized row anywhere in reach**: the dropped partition's pages sit
on the free list with their content (**10 pages at `UNAUTH ×15`**), the append consumes one, and
**journalling that page writes its original image.**

**The mechanism is exhibited, not asserted** — every durable page identified by number, classified
individually, and **verified byte-identical to an independently read copy of the store.**

## 2. The four relationships the task required, each stated without restating the rule

| To | What §4.19 says |
|---|---|
| **§4.13 N1** | **L4 satisfies N1 as written** — no unauthorized *entry*, and **`U` and `Ustruct` are blind to the bytes**, `Ustruct` being an entry counter. **No amendment proposed**; MSG-0158 referred it and **MSG-0160 answered it** |
| **§4.18 N6** | **Nothing here is an N6 measurement — N6 did not exist when this evidence was taken.** Its measurement is **TASK-0048/MSG-0163** and belongs to that record |
| **§4.16 DA-1** | **N1 asks what the structure contains; DA-1 asks what the engine writes down.** The residue itself is **not** a finding — **DA-4 row 1** — and the finding is **what the request did with it** |
| **§4.17** | **Part two INVERTS §4.17's W-B result**, and a **declared pointer note** now says so **in §4.17**, without withdrawing anything it states |

## 3. The §4.17 inversion, and why both records stand

**§4.17 records that the appending write journalled nothing**, on the reasoning that *"a rollback journal
holds original images of overwritten pages and appends overwrite none."*

**That reasoning is correct about a store whose free list is empty.** §4.19 measures a store
**re-materialised from another partition**, where **the append does overwrite something.** **Same write
shape, opposite result — and the difference is the store's history, not the query.**

**Neither section is withdrawn.** §4.17's result is **bounded**, and §4.19 holds the case it does not
cover. **The pointer note is additive and the note is in §4.17 rather than a rewrite of it**, on the
§4.12 Q12 precedent.

## 4. One fact recorded so a reader holding both records is not misled

**MSG-0163's run did not reproduce the L4/W-B arm**, on a fixture that kept **one residue page against
the ten measured here.**

**§4.19 records what MSG-0158 measured and is NOT reconciled against that later run**, as the task file
requires in terms. **The sentence is in the section because omitting it would mislead** a reader who has
both records — **and it softens nothing: by DA-5 row 3, a later absence is not evidence that this
presence was wrong.**

## 5. Required outcomes — each with its evidence

| # | Required outcome | Evidence |
|---|---|---|
| 1 | **§4.19 exists, additive, carrying the result and its mechanism** | Present between §4.18 and section 5; the full result table; pages identified, classified and byte-verified |
| 2 | **MSG-0158's evidence boundary preserved in the section's own text** | *"The boundary — limits stated as limits"*: one subject, one allocator, one build; `secure_delete = 0`, `auto_vacuum = 0`; **no remedy tested**; *"no marker observed" is not a pass*; byte-scanning blind to re-encoding; device-level residue out of scope |
| 3 | **Relationship to N1, N6 and DA-1 without restating or amending** | §2 above; each points at the section that holds the rule |
| 4 | **Relationship to §4.17 stated** | §3 above, **in both directions** — §4.19's text and a declared note in §4.17 |
| 5 | **Existing sections not rewritten; pointer note where needed** | **167 insertions, 0 deletions**; no table, gate or verdict edited anywhere |
| 6 | **`docs/` empty; verified from `origin/main`** | §7 below |
| 7 | **COMMS, status, queue row, checkpoint; numbering MSG-0165 or later** | This record is **MSG-0165**; queue row, status and `checkpoints/TASK-0049.md` updated in the same commit |

## 6. Constraints — each checked

- **No generalization to an engine class.** Stated in §4.19's own text, with §4.6 S10 and §4.15 cited.
- **No selection, adoption, deployment, implementation or clearance.** **Promotion clears nothing**, and
  the section says so in its opening block.
- **No change to N1–N6, DA-1…DA-7, E1–E4, G-Q4…G-Q7.8, S1–S11 or strict Shape-1.** **Zero deletions**
  across the file confirms it mechanically.
- **No candidate verdict changed.** **Ten probes have cleared nothing.**
- **No new measurement.** **Nothing was executed**; no probe, fixture or harness was written or run.
- **TASK-0048's N6 findings are NOT restated here** — §4.19 is the TASK-0046 promotion, and §4.19 says
  in terms that N6 measurement belongs to MSG-0163.

## 7. Verification, quoted

```text
starting HEAD                  -> 20edd9d (verified equal to origin/main before editing)
git diff --name-only docs/     -> empty
EPA-0006 §4.19 present         -> yes, between §4.18 and section 5
deletions in EPA-0006          -> 0
insertions / deletions         -> 167 / 0, one file
git status --porcelain         -> empty after commit
```

**Post-change content verified from `origin/main` after pushing.**

## 8. State

- **TASK-0049 is COMPLETE. No task is READY**, and none is authorized.
- **§4.17, §4.18 and §4.19 now stand together:** the DA-1 evidence, the N6 requirement, and the topology
  evidence that motivated it.
- **Nothing CLEARED — ten probes.** **All candidate verdicts unchanged. GAP-B stands.**
- **Open for the Lead:** **Q21** (does an N6 violation join §4.13's EV-list, and at what strength?),
  **Q17**, **Q14**, and **MSG-0060** — **nine** number collisions.
- **No blocker open.** DISC-0011 and DISC-0012 open; neither moves a verdict.
