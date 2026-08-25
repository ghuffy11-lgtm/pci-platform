# MSG-0151 — COMMS Verification: DA-1 Read Back From `main`, and One Figure Reconciled

**Status:** **OPEN** — verification record. **No referral. One arithmetic correction (§3).**
**Raised:** 2026-08-25
**Raised by:** Claude Code (interactive session, COMMS)
**Type:** Verification / state reconciliation
**Related:** MSG-0150 (TASK-0044 execution record), MSG-0148b, MSG-0147, EPA-0006 §4.16

---

## 1. Why this record exists

**TASK-0044 was executed by a supervisor-started runner; this reading was done by a session that did not
write it.** A session verifying its own output is the weakest form of the check available, and §4.16 is
now a **criterion** — the thing every later durability measurement will be judged against.

**No new Architecture Lead communication has arrived.** MSG-0150 is the newest message.

## 2. Verified in this session

| Claim | Evidence |
|---|---|
| Repository reconciled | `git fetch`; `HEAD` = `origin/main` = **`b243065`**; `git status --porcelain` **empty** |
| The criterion is published, not merely written | Read **from `origin/main`**: **§4.16** present with **DA-0 … DA-7**, DA-1's prohibition quoted below |
| The numbering defect is fixed **on `main`** | **`#### DA-3 — Exclusions`** carries its own heading; the published sequence runs **DA-0, DA-1, DA-2, DA-3, DA-4, DA-5, DA-6, DA-7** with no gap |
| No accepted ADR touched | `git diff --name-only 06d9525..origin/main -- docs/` → **empty** |
| Nothing measured | No file under `implementation/probes/TASK-0044/`; no probe, fixture or harness in either commit |
| Registers clean | **MSG-0150 holds exactly one register row and one ledger row**; TASK-0044's board row reads **COMPLETE** |
| No task READY | **0 rows** match the READY pattern in the queue; supervisor heartbeat **04:17:18Z `NOOP` — "no READY task"**, correct |

**DA-1 as published:**

> **"Resolving a retrieval request on behalf of a subject `s` must not cause content that `s` is not
> authorized to receive to be written to, or left readable in, any engine-managed durability or
> persistence artefact."**

## 3. One figure reconciled

**The status header says the criterion is `228 insertions / 0 deletions`. As published on `main` it is
234 / 0.**

**Both numbers are real and neither is wrong about what it describes:**

| | |
|---|---|
| `86493bb` — the criterion | **228 / 0** |
| `b243065` — the DA-3 heading fix | **7 / 1** |
| **§4.16 as published** | **234 / 0** |

**The status line was written before the correction and describes the first commit.** It is updated to
carry the published total, with the original retained — **not because 228 was false, but because a
reader checking §4.16 against the record will count 234.**

## 4. The part of §4.16 worth reading first, and why the ordering mattered

**DA-4 — provenance, not presence.** The section says plainly that this is *"the part a criterion
written after a measurement would most likely have got wrong, and it is the reason MSG-0148b ordered
them this way."*

**The reasoning is sound and worth restating once.** A projection index durably holds the corpus it
indexes, so under a single shared projection *"bytes unauthorized for `s` exist somewhere in the
engine's files"* is **true by construction for every candidate at every moment**. **A presence-based
criterion would therefore fail every engine trivially** — and be indistinguishable from one tuned to
fail. **DA-1 is instead a claim about provenance and reach**: content written **at ingest** while
maintaining the projection is not a DA-1.1/DA-1.2 finding; content written or retained **because a
request was resolved** is. **Provenance not established ⇒ NOT CLEARED**, never *"presumed ingest"*.

> **This is the concrete argument for MSG-0148b's ordering**, and it is stronger than the general one
> MSG-0148a offered. **Criterion-first did not merely avoid a shaped bar — it produced a distinction a
> measurement-first task would probably have missed**, because the WAL observation that started this
> shows presence and says nothing about provenance.

## 5. Q14, and what it does not cost

**Q14 is referred: does a DA-1 failure block selection, or is it recorded alongside the Shape-1
verdict?** **§4.16 takes the fail-closed default — recorded alongside, changing no Shape-1 verdict —
and stops there**, which is correct: MSG-0147 §2 says the ruling clears or fails no engine by itself,
and MSG-0148b forbids changing any existing gate.

**The default costs nothing on either reading**, because **selection is already blocked on independent
grounds and no candidate is eligible under any answer to Q14.**

## 6. State

- **No task is READY**, and none is authorized. The next action is the Architecture Lead's.
- **DA-1 exists as EPA-0006 §4.16 and has never been measured against anything.** **No candidate holds a
  DA-1 verdict**, and none may until an exposure evidence task is separately authorized.
- **Open for the Lead:** **Q14** (fail-closed default recorded), **R1** (whether TASK-0043's result
  becomes a section), and **MSG-0060**'s unanswered numbering question — now **eight** collisions.
- **Nothing CLEARED — seven probes.** **All six TASK-0042 candidates remain NOT CLEARED. GAP-B stands.**
- **No blocker open. DISC-0011 and DISC-0012 open; neither moves a verdict.**
