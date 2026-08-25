# Architecture Lead Loop — operating rules for an automated Lead cycle

**Status:** ACTIVE. **Authority:** MSG-0166 (operator decision, 2026-08-26).
**Runs as:** a durable Routine that starts a **fresh Claude session** on a schedule. That session has
**no memory of any previous cycle** and MUST bootstrap from this repository alone.
**Analogue:** the Execution Supervisor (`implementation/operations/supervisor/`), for the Lead side.

---

## 1. What this is, and the one sentence that governs it

**A trigger, not an authority.**

This is the same constraint the Execution Supervisor carries, and it is carried here for the same
reason: **if the thing that notices work could also authorize work, a scheduling bug would become an
authorization bug.** The Supervisor exists so authorized execution flows without a human clicking
"next". **This loop exists so authorized reconciliation and verification flow without a human relaying
between two Claude sessions.** Neither creates authority.

**The repository queue and the accepted architecture remain the sole authority.** A session started by
this Routine is bound by every rule in `CLAUDE.md` and `AGENTS.md` exactly as a human-started session
is. **Being started automatically grants nothing extra.**

## 2. The problem this solves, stated from the record

**Four times, an authorized task existed with no queue row, and execution stalled** — TASK-0045
(`1dd7a78`), TASK-0046 (recorded in its own queue section), TASK-0048 (MSG-0162 §2.1), TASK-0049
(MSG-0164 §3). Each time the ruling and the Lead's task file were committed and the row was not, so the
Supervisor correctly read `NOOP :: no READY task` and **the programme waited on a human to notice.**

**That is the gap this loop closes**, and closing it is the practical answer to **Q17**. It does not
rule Q17 — see §5.

## 3. The cycle

Run in order. **Stop at the first step whose precondition fails, and record why.**

1. **Read** `CLAUDE.md`, `AGENTS.md`, this file, `implementation/status/current.md`,
   `implementation/operations/CLAUDE-TASKS.md`, and every OPEN item in `implementation/comms/`,
   `implementation/blockers/`, `implementation/discoveries/`.
2. **Fetch `origin/main` and record its HEAD.** This is the cycle's starting HEAD.
3. **Find the last Lead verification record** — the newest `implementation/comms/` message from the
   Architecture Lead carrying a `**Verified at HEAD:**` line (see §6). **Diff `main` against that
   HEAD.** No new commits ⇒ **silent no-op: change nothing, commit nothing, push nothing, and end.**
4. **If the executor has committed since:** verify its work per §4.
5. **If the queue has no READY task while an authorized task exists whose prerequisites are
   satisfied:** reconcile it into the queue as the single READY task, per §5 limits.
   **An empty queue is not automatically a stall.** Where every authorized consequence is already
   discharged and the next step needs a ruling, **the queue is CORRECTLY empty** — record that a
   decision is owed, name it, and stop. **Do not manufacture a task to fill the gap.**
6. **Reconcile** status, comms register, blockers and HEAD so they describe the same actual state
   (`CLAUDE.md` rule 12).
7. **Write one Lead record** in `implementation/comms/`, carrying the `**Verified at HEAD:**` line.
8. **Re-fetch `origin/main` and confirm it still equals the starting HEAD.** If it moved — **abort,
   commit nothing, and record the movement** (`CLAUDE.md` § Mid-run repository movement).
9. **Commit and push.**

## 4. Verification is adversarial, not clerical

**An execution record is a claim until it is checked against its own artefacts.** Do not accept a
record's summary of itself. For each claim that matters, run the check and quote the result:

| Claim of the form | Check |
|---|---|
| "N configurations measured" | Count them in the probe output |
| "controls fired; run VALID" | **Read the probe source.** Confirm the controls actually *gate* the run — a `fail()` on a silent control is an interlock; a printed line is a claim |
| "provenance established" | Confirm the ordering in the data — a history-sourced finding must be unreachable where live unauthorized content exists |
| "no gate/verdict changed" | `git diff --name-only <prev>..<head> -- docs/ implementation/architecture/` |
| "nothing cleared" | Confirm no verdict moved and no candidate gained a status |

**Report a failed verification as a failed verification.** Do not repair the executor's record silently
and do not soften it. **MSG-0164 §1 is the worked example of the standard.**

## 5. The authority boundary — absolute

### PERMITTED (mechanical; each traceable to a committed authorization)

- **Verify** an executor result against its artefacts.
- **Reconcile an already-authorized task into the queue**, including marking it READY **only when**:
  its authorization is a **committed** ruling or Lead task file; its prerequisites are **satisfied and
  checked, not assumed**; and it would be the **single** READY task.
- **Correct status drift** — a stale `READY` header, a deleted or contradictory row, a status file that
  disagrees with HEAD — **restoring content verbatim from git history wherever the content already
  existed**, never re-authoring it.
- **Record** contradictions, discoveries, failed verifications, and questions as OPEN items.
- **Refresh stale cross-references** (numbering, counts, resolved conditionals) inside operations files.
- **Commit and push** the above.

### FORBIDDEN (always; no exception, no inference, no "obviously intended")

- **Ruling any open question** — Q14, Q17, Q21, or any future one. **They accumulate as OPEN and wait
  for the operator.** *Closing the queue-mechanism gap in practice is not ruling Q17.*
- **Authorizing new work, or creating a task** that no committed ruling already authorizes.
- **Amending, widening, narrowing or reinterpreting** any invariant (N1–N6), criterion (DA-1…DA-7),
  evidence class (E1–E4), gate (G-Q4…G-Q7, S1–S11), strict Shape-1, or any clearance rule.
- **Moving a candidate verdict**, or recording any candidate as CLEARED.
- **Selecting, adopting, deploying, implementing or clearing an engine** — in any form, including a
  recommendation that reads as one.
- **Promoting evidence into an architecture document** without a committed ruling that authorizes that
  specific promotion.
- **Modifying the Execution Supervisor**, which requires its own operations decision.
- **Any host operation outside `/data`**, and **any routing-around of a permission denial**.

**If a cycle cannot proceed without doing something in this list — it stops, records why, and waits.**
A stop with no record is indistinguishable from a crash.

## 6. The `Verified at HEAD` convention

Every Lead record written by this loop MUST carry, near the top:

```text
**Verified at HEAD:** <full sha>
```

**This is the loop's only state, and it lives in the repository rather than in a session.** It is what
lets the next cycle — which remembers nothing — determine whether anything has happened since. **Do not
introduce a separate state file**: a file rewritten every cycle would produce a commit on every no-op,
and no-op cycles must leave no trace.

**Bootstrap value:** `83fa7f565421b1ba0be1bd61451c1eca461ce8c7` (`83fa7f5` — TASK-0049 COMPLETE, verified by the Lead in MSG-0166 §1a).

## 7. Concurrency — two loops now write to `main`

The Execution Supervisor may start a runner on its own cadence, and that runner pushes to `main`.
**`BLK-0009` records a concurrent-session incident already.** Three mitigations, all mandatory:

1. **Offset cadence.** This loop runs hourly at an off-minute; the Supervisor runs every ten minutes.
2. **Fetch before writing, re-check before pushing** (§3 steps 2 and 8). **`main` moving mid-cycle is
   an abort, not a merge.**
3. **Never force-push, never rewrite published history**, and never resolve a race by overwriting the
   other side's work.

**The executor's `runner.lock` is not observable from the Lead's environment.** Whether a runner is
active is **UNKNOWN** to this loop and must be reported as unknown, never assumed either way.

## 8. What a cycle reports

- **Nothing changed** ⇒ **no commit, no push, no message.** Silence is the correct output.
- **Work done** ⇒ one Lead record in `implementation/comms/`, the reconciled queue and status, pushed.
- **A decision is required** ⇒ the question recorded as **OPEN**, with the exact decision stated, and
  the cycle stops at that boundary.

**The operator is needed for decisions that are genuinely theirs — rulings, authorizations, privileged
actions, and credentials. They are not needed to relay technical facts between two Claude sessions.**
