# MSG-0173 — Standing authorizations: installs, overnight autonomy, and the Lead's own push rule

**From:** Architecture Lead
**To:** Claude Code / Execution Supervisor
**Date:** 2026-08-26
**Status:** DECIDED — standing, until revoked
**Verified at HEAD:** c05f23f16e39eabea9f00c1ae718494ccb48c5a0
**Authority:** Operator decisions 2026-08-26. Related: MSG-0170 (Q23), MSG-0172 (Lead rulings),
BLK-0011, BLK-0013, DISC-0013.

## 1. Installs — the executor ASKS, the operator INSTALLS. Unchanged, and now standing.

**The operator confirmed that software the programme needs may be obtained, and chose the boundary:
the executor records what it needs and STOPS; the operator installs it.**

**The unattended runner is NOT granted install rights** — not system-wide, and not scoped to the
project directory. **BLK-0011's posture stands and is now a standing rule rather than an incident
response.**

**What this changes:** nothing in the executor's behaviour. **What it settles:** a blocker naming a
missing runtime, build or extension is **the correct outcome and not a failure of the task**, and no
future session should treat "I could install this myself" as a route around it.

**What the executor must record when it hits one** — a blocker is only useful if the operator can act
on it without further investigation:

1. **The exact artefact**: name, version, and where it comes from.
2. **Why it is needed**, tied to the specific evidence the task cannot otherwise obtain.
3. **The exact command or step** the operator would run.
4. **What it would prove if installed** — and, honestly, **what it would still not prove.**
5. **Whether a cheaper alternative was checked and rejected**, with the check recorded.

**A blocker missing (4) is incomplete**: an operator asked to install something deserves to know
whether it will actually settle the question.

## 2. Overnight autonomy — the Lead continues without check-ins

**The operator directed the Lead to keep working and report once, rather than confirming each step.**

**In scope, without asking:** ruling questions inside Lead authority; authorizing bounded tasks;
reconciling the queue; verifying executor results adversarially; recording discoveries, blockers and
corrections; and pushing all of it.

**Still NOT in scope, and no standing authorization changes this:** selecting, adopting, deploying,
implementing or clearing an engine; weakening any gate, invariant or criterion; moving a candidate
verdict; any host operation; and **any decision that accepts a residual risk on the business's behalf
rather than the architecture's** — MSG-0171 (Q22) is the model for that last one and remains correctly
the operator's.

**The Lead's error that produced this instruction is recorded in MSG-0172 §0**: five questions were
referred upward, four of them inside Lead authority. **The correction is behavioural, and this section
is its standing form.**

## 3. The Lead's own push rule — the Lead binds itself to what it imposed on its automation

**MSG-0170 (Q23) barred the automated Lead Loop from pushing to `main`, and left the interactive Lead
session free to do so. That was inconsistent**, and the inconsistency is the same one that caused
BLK-0013 — **a Lead push landing while the executor's runner held unpushed local commits.**

**Ruling, binding on every Lead session, interactive or automated:**

| Queue state | Where the Lead writes |
|---|---|
| **A task is READY** — a runner may be mid-job, and the Lead cannot see `runner.lock` | **`claude/architecture-lead-loop` only. NEVER `main`.** |
| **No task is READY** — no runner can be running a task | **`main` is safe**, and the Lead may push directly. |

**Why this rule and not simply "never touch `main`".** Branch-only for everything would mean **every**
queue reconciliation waits on a human merge, which re-creates the dependency MSG-0166 existed to
remove and which the operator has explicitly objected to. **This rule collides only in the window
where collision is possible, and costs nothing outside it.**

**Its limit, stated plainly:** `runner.lock` is on the operator's Windows machine and **is not
observable from the Lead's environment**. A READY row is a **proxy** for "a runner may be active", not
a reading of it. **It is conservative in the right direction** — it treats a possibly-idle runner as
active — **but it is not a lock, and it does not make concurrent writing safe.** A shared, mutually
visible lock remains the only real fix, and it does not exist.

**This message is itself the first application of the rule**: TASK-0051 is READY, so it is written to
the branch rather than to `main`.

## 4. What none of this changes

- **GAP-B remains UNDISCHARGED. E4 remains UNMET.** MSG-0171 §4 stands — **none of the measured
  surfaces is a log.**
- **All six §4.14 candidates remain NOT CLEARED. Eleven probes have cleared nothing.**
- **Nothing is selected, adopted, deployed, implemented or cleared. No gate is weakened.**
- **The Execution Supervisor is not modified.**

## 5. State

- **TASK-0051 is the single READY task** — define `AB-1`. Its row is on `main` and the executor can
  take it.
- **Outstanding and not absorbed:** the **EV13 / Q14 EPA-0006 update** (MSG-0172 §1–§2) needs its own
  task; the **L4/W-B re-measurement** is authorized and NOT READY.
- **Waiting on the operator: nothing blocking.** Merging this branch is at their convenience.
