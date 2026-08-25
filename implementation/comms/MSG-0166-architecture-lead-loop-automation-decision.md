# MSG-0166 — Operator decision: automate the Lead↔executor loop, mechanically and no further

**From:** Architecture Lead
**To:** Claude Code / Execution Supervisor
**Date:** 2026-08-26
**Status:** DECIDED — operations decision
**Verified at HEAD:** 83fa7f565421b1ba0be1bd61451c1eca461ce8c7
**Authority:** Operator decision taken 2026-08-26, recorded here before implementation per
`CLAUDE.md` *"record the instruction in a numbered communication first, then make the change — so the
change traces to a recorded decision rather than to a conversation."* Precedent for an operations
decision of this class: **MSG-0011** (supervisor implemented) and **MSG-0024** (supervisor enabled).

## 1. The decision

**The Architecture Lead side of the loop is automated by a durable Routine that starts a fresh Claude
session on an hourly, off-minute schedule.** Its operating rules are
`implementation/operations/ARCHITECTURE-LEAD-LOOP.md`, delivered with this message.

**Its authority is MECHANICAL ONLY.** It may verify, reconcile, correct drift, record and push. **It
may not rule any open question, authorize new work, create a task, amend any invariant, criterion,
gate or verdict, or touch engine selection.** Those accumulate as OPEN and wait for the operator.

## 1a. TASK-0049 verified, and a number collision the Lead caused

**TASK-0049 is COMPLETE and verified in this session**, at `83fa7f5`: **EPA-0006 §4.19** exists,
**167 insertions / 0 deletions — additive, zero deletions**; `git diff --name-only docs/` **empty**;
and the constraint MSG-0164 §4 attached was **followed exactly** — §4.19 records what MSG-0158
measured, **points at MSG-0163 without reconciling against it**, and invokes **DA-5 row 3** to say
that *"a later absence is not evidence that this presence was wrong."* **That is the correct handling
of two disagreeing runs**, and it is better than silence, because a reader holding both records would
otherwise have to guess.

**The queue is now empty, and legitimately so.** Every Q18 and Q20 consequence is discharged —
TASK-0048 measured N6, TASK-0049 promoted §4.19. **This is a decision boundary, not a fifth stall:**
the next step requires an operator ruling, and **no authorized task is waiting for a row.**

**A collision the Lead caused, recorded rather than quietly renumbered.** MSG-0164's queue row told
TASK-0049 to number its record **"MSG-0165 or later"**, and the Lead then **took MSG-0165 for this
decision**. The executor followed the committed instruction correctly; the Lead's later correction to
"MSG-0166 or later" was **still uncommitted** when TASK-0049 began. **The executor's MSG-0165 is
committed and referenced from §4.19 and the TASK-0049 checkpoint; this file was referenced nowhere —
so this file moved to MSG-0166.** **Tenth collision in the register.**

**The lesson is structural, not clerical, and it is why this decision exists:** the Lead reserved a
number in a conversation and in an uncommitted edit, while the executor read the repository. **The
repository was right.** An automated loop that reads and writes the repository — and never relies on
an uncommitted intention — is the fix for exactly this class of error.

## 2. The problem being solved, from the record rather than from preference

**The operator was functioning as a technical messenger between two Claude sessions**, which
`CLAUDE.md` rule 7 explicitly says they must not be, and which the COMMS protocol says in terms:
*"`COMMS` must NOT require the human operator to relay ordinary technical information."*

**The concrete symptom is four stalls.** An authorized task existed with no queue row, so the
Supervisor read `NOOP :: no READY task` — correctly — and execution waited on a human noticing:

| Task | Authorization committed | Row written by | Recorded in |
|---|---|---|---|
| TASK-0045 | ruling + task file | a later session (`1dd7a78`) | TASK-0046 queue section |
| TASK-0046 | `e871461`, `bafe5c9` | a working-tree row of **UNKNOWN provenance**, then rewritten from the Lead's artefacts | TASK-0046 queue section; **Q17** raised |
| TASK-0048 | `e7daa45`, `fef8bad` | Lead reconciliation | MSG-0162 §2.1 |
| TASK-0049 | MSG-0161b, `9f8f416` | Lead reconciliation | MSG-0164 §3 — **executed and COMPLETE at `83fa7f5`** |

**This is a mechanism defect, not four accidents.** The reconciliation step is mechanical
transcription of a committed authorization, and it is exactly the kind of step that should not depend
on a human being awake.

## 3. Why the authority boundary is where it is

**The Execution Supervisor's founding constraint is quoted verbatim, because it applies here
unchanged:** *"The supervisor does not decide what work is allowed… If the supervisor could edit the
queue, a scheduling bug would become an authorization bug."*

**An automated Lead that could rule would be strictly worse than an automated Supervisor that could
authorize**, because the Lead sits *above* the queue: a self-ruling Lead loop would manufacture the
authority that the queue then faithfully executes. **The entire safety model of this repository rests
on the Lead being a human-accountable decision point.** Automation moves the *clerical* half of the
Lead's work off the human. It moves none of the *judgment*.

**Two options were considered and rejected:**

- **Pre-authorizing narrow ruling categories** (e.g. "the loop may rule queue-mechanism questions
  like Q17"). **Rejected.** The category boundary is itself a judgment, and the first cycle that
  misclassifies a question rules something it was never given. **There is no narrow enough category.**
- **Report-only, no writes.** **Rejected** — it changes nothing: the queue still stalls after every
  completed task and the operator still unblocks it by hand. It would not have prevented any of the
  four stalls in §2.

**Closing the queue-row gap in practice is NOT ruling Q17.** Q17 asks what the mechanism *should* be
and remains **OPEN** for the operator. The loop transcribes committed authorizations, which the
repository already permits: *"Queue reconciliation is transcription of a committed authorization; it
is not self-authorization, and it may never become one."*

## 4. Why a fresh session per firing

**The loop's session remembers nothing, deliberately.** `CLAUDE.md` already requires this of every
session — *"You MUST NOT rely on memory from previous sessions… Prior context is a pointer, never a
fact"* — and requires the repository to support it: *"Every new Claude session MUST be able to resume
solely from repository documentation and current repository state."*

**So the automated Lead is built on a property the repository already guarantees**, rather than on a
long-lived session that would fail silently when its container is reclaimed. **A silent failure is the
worst outcome available here**, because — as the Supervisor's own design note puts it — *"silence is
indistinguishable from 'nothing to do'."*

**The loop's only state is the `**Verified at HEAD:**` line in the newest Lead record** (loop file §6).
No separate state file: one rewritten each cycle would commit on every no-op, and **no-op cycles must
leave no trace.**

## 5. Concurrency — acknowledged, not hand-waved

**Two automated writers now target `main`:** the Supervisor's runner and this loop. **`BLK-0009`
records a concurrent-session incident already.**

Mitigations are mandatory and are in the loop file §7: **offset cadence** (hourly off-minute against
the Supervisor's ten minutes); **fetch before writing and re-check before pushing**, with `main`
moving mid-cycle treated as an **abort rather than a merge** (`CLAUDE.md` § Mid-run repository
movement, MSG-0028 decision 2); and **never force-push or resolve a race by overwriting.**

**Known limitation, stated rather than omitted:** the executor's `runner.lock` lives on the Windows
development machine and **is not observable from the Lead's environment**. The loop therefore **cannot
know whether a runner is active** and must report that as **UNKNOWN**. The mitigations above are
detection-and-abort, not prevention. **If contention proves real in practice, that is a discovery to
record — and a lock visible to both sides would be an operations decision, not a fix to improvise.**

## 6. What does NOT change

- **The Execution Supervisor is untouched.** Modifying it requires its own operations decision, and
  none is taken here.
- **The executor's role, triggers and rules are unchanged.** It still runs the highest-priority READY
  task, on `COMMS` or on the Supervisor's cadence.
- **`COMMS` still works exactly as it does today.** This loop supplements the operator's trigger; it
  does not replace it.
- **No architecture, invariant, criterion, gate, verdict or candidate status changes.** `git diff
  --name-only docs/` is empty for this change, and `implementation/architecture/` is untouched.
- **Nothing is selected, adopted, deployed, implemented or cleared.** Ten probes have cleared nothing.

## 7. Verification owed on the first firing

**This decision is recorded before the mechanism is proven, and that is stated plainly rather than
glossed.** The Routine's start path is **UNVERIFIED** at the time of writing: no cycle has run.

**What the first firing must establish, and what a later record must state:** that the fresh session
reaches the repository; that it reads this file and `CLAUDE.md`; that it correctly no-ops when nothing
has changed; and that it aborts rather than merges when `main` moves mid-cycle. **Until a record says
otherwise, the loop is INSTALLED but NOT PROVEN** — the same distinction MSG-0011/MSG-0029/MSG-0032
drew for the Supervisor, where installation and a proven start path were separate facts recorded
separately.

## 8. State

- **TASK-0049 is COMPLETE** (`83fa7f5`, executor record **MSG-0165**), verified in §1a. **No task is READY, and the queue is correctly empty** — every authorized consequence is discharged and the next step is an operator ruling. This decision changes no task, priority or scope.
- **Open for the operator, unchanged by this message:** **Q21**, **Q17**, **Q14**, the **L4/W-B
  non-reproduction** (MSG-0164 §5), and **MSG-0060**.
- **No blocker open.** DISC-0011 and DISC-0012 open; neither moves a verdict.

---

## 9. Operator ratification — 2026-08-26

**The operator approved this decision explicitly after the loop was installed and its scope was
restated to them.** The approval covers, and covers only:

- the **Routine** (`trig_01PpjCrtoEUZnF3vPACBPfCW`, hourly at `:23`, fresh session per firing);
- the **mechanical-only authority boundary** in `ARCHITECTURE-LEAD-LOOP.md` §5;
- `ARCHITECTURE-LEAD-LOOP.md` as the loop's operating rules.

**What the approval does NOT cover, recorded because a bare approval is exactly the thing that gets
over-read later:** **it rules no open question.** **Q21, Q17, Q14 and the L4/W-B non-reproduction
(MSG-0164 §5) remain OPEN and unruled.** The operator was asked to confirm this scope rather than
letting a one-line approval be spread across four distinct architecture questions — two of which
(**Q21**, *"at what strength"*; **Q17**, *"what the mechanism should be"*) **are not yes/no questions
and cannot be answered by an approval at all.**

**Status is unchanged by ratification: INSTALLED, NOT PROVEN.** Approval is not verification — the
same distinction `CLAUDE.md` rule 10 draws for ratified ADRs: *"An accepted ADR states an obligation;
it does not demonstrate that the obligation is met."* **The first firing (2026-08-25T22:23:00Z) is
what proves the start path**, and §7 lists what it must establish.
