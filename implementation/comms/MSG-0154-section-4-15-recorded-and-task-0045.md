# MSG-0154 — §4.15 Recorded and Verified; TASK-0045 Reconciled

**Status:** **OPEN** — record and queue reconciliation; **nothing blocking**
**Raised:** 2026-08-25
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Architecture record + queue reconciliation
**Authority:** MSG-0153 | **Related:** MSG-0146, MSG-0141, MSG-0147, MSG-0148b, EPA-0006 §4.15, §4.16

---

## 1. What was done, in the order MSG-0153 set

**Step 1 — §4.15 written**, from MSG-0146 and adding nothing to it. **129 insertions / 0 deletions, one
file, additive.** **§4.15 was the free number** — §4.14 is TASK-0042's evidence, §4.16 is DA-1 — **so
nothing was renumbered and no other section changed.** **Verified from `origin/main` after pushing.**

> **The figure was corrected after reading `main` back.** This record first said **128 / 0** — the count
> of the section text — where the published diff is **129 / 0**, the extra line being the `---` separator
> that had to be added so the heading did not run into §4.14's closing list. **Small, and worth fixing
> for the same reason as yesterday's 228-versus-234: a reader checking §4.15 against the record will
> count 129.** **Reading the change back from `main` is what found it, both times.**

**Step 2 — TASK-0045 reconciled** as the single READY task: the bounded **DA-1 evidence** work that
MSG-0148b deliberately left to a separate task.

## 2. What §4.15 records

**E4 is OBTAINABLE on the second subject, and the inspection is ADVERSE.** Unauthorized passage text
bound as a **parameter** appears verbatim in the engine's trace, because the trace emits the **expanded**
statement.

**The section states plainly that this is the reverse of §4.14's surface scan, and that the scan was
right not to be offered as E4.** §4.14 found **0 occurrences** across five engine-produced surfaces and
attributed it to bound parameters; **that protection does not hold at the surface E4 actually asks
about.** **A probe that had rounded the scan up to E4 evidence would have recorded a false negative.**

**C4 is kept beside the verdict, negative:** the trace records **the instruction, not the examination** —
200 rows examined, 100 returned, **1 entry** — so **it cannot measure `U`** and **is not E2 evidence.**

## 3. The constraint that limits how far this result travels

**The two subjects differ in the BINDING, not the build.** `DEBUG`, `ENABLE_SQLLOG` and
`ENABLE_STMT_SCANSTATUS` are **absent on both**.

**So E4's obtainability here is a property of what the language binding exposes**, and **"SQLite supplies
E4" is not established** — still less anything about an engine class. §4.6 S10 and §4.12's standing
prohibition on generalizing one subject's behaviour both apply, and **§4.15 says so in its own text.**

**§4.13 GAP-B is therefore NOT withdrawn.** **Every Shape-1 measurement in §4.11, §4.12 and §4.14 was
taken on the FIRST subject**, which still cannot supply E4. **Those measurements do not acquire E4
evidence because a different subject has a trace surface.**

## 4. TASK-0045, and the one rule that shapes it

**The criterion is already authoritative; the task measures against it and does not adjust it.**
MSG-0148b's ordering only holds if the measurement now takes DA-1 as given — **including where DA-1 is
inconvenient to measure.**

**DA-4 is the hard part, and the task section is built around it.** **DA-1 is a claim about provenance,
not presence.** Under a shared projection, *"bytes unauthorized for `s` exist somewhere in the engine's
files"* is **true by construction for every candidate at every moment** — so **a probe that greps an
artefact for a marker measures nothing.** **Provenance not separable ⇒ NOT CLEARED (DA-6)**, never
*"presumed ingest"*.

**And DA-5 row 3 carries §4.6 S5's asymmetry into persistence: finding nothing proves nothing on its
own.** A clean scan is **not sufficient**; absence counts only with evidence the engine **could not**
have written it.

**Two operational details the task must not skip:** a **negative control that actually produces a DA-1
finding** — a run whose control comes back clean has measured nothing — and **the `journal_mode` and
maintenance state of every measurement**, because **a checkpoint can empty a WAL** and §4.12 already
showed a maintenance command flipping a reading.

## 5. What TASK-0043's WAL observation is, in this context

**It is the shape that motivated the criterion, not a result under it.** §4.15 states the numbers — the
marker present **135 times** in `-wal`, absent from the main database and `-shm` — and **leaves the
classification to §4.16 DA-4**, which decides on provenance.

**DA-1 has never been measured against any candidate**, and **no candidate holds a DA-1 verdict.**

## 6. Boundaries — MSG-0153's, checked

- **Nothing selected, cleared, adopted, deployed or implemented.** **Clearing was named explicitly and
  nothing here clears anything** — **satisfying DA-1 clears nothing** (DA-5 consequence 1).
- **§4.15 is additive**: **129 insertions**, **0 deletions**, one file; **no other section altered**.
- **No gate changed**: E1–E4, strict Shape-1, `U = 0`, G-Q4…G-Q7.8, S1–S11 and DA-1…DA-7 untouched.
- **No accepted ADR modified** — `git diff --name-only docs/` **empty**.
- **Nothing measured by this session**; TASK-0045 is reconciled, **not started**.

## 7. State

- **TASK-0045 is READY and is the single READY task.** Not started at the time of writing.
- **§4.15 and §4.16 both exist**; **E4 OBTAINABLE on subject 2, NOT OBTAINABLE on subject 1; GAP-B
  stands.**
- **Nothing CLEARED — seven probes.** **All six §4.14 candidates remain NOT CLEARED.**
- **`py` is authorized for TASK-0043's probe only** (MSG-0145). **If TASK-0045 needs it, that is a fresh
  decision**, and **BLK-0011's unattended condition still holds.**
- **No blocker open. DISC-0011 and DISC-0012 open**, neither moving a verdict.
- **Q14 open with its fail-closed default. MSG-0060 unanswered — eight collisions.**
