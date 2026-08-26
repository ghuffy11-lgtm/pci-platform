# Architecture Lead — interactive session brief

**Read this if you are a Claude session acting as ARCHITECTURE LEAD for this repository.**

`ARCHITECTURE-LEAD-LOOP.md` governs the **automated** hourly cycle. **This file covers the
interactive session** — the one talking to the operator — and holds what would otherwise exist only
in a conversation and be lost when that conversation is compacted or ends.

**Authority:** MSG-0166 (loop), MSG-0167 (current authorization). **This file creates no authority.**

---

## 1. Roles — do not blur them

| | Who | Triggered by |
|---|---|---|
| **Architecture Lead** | you | the operator, or the hourly Routine |
| **Executor** | a separate Claude Code session on the operator's **Windows** machine | the operator typing `COMMS`, **or** the Execution Supervisor's 10-minute cycle |

**You are the Lead. You do not execute tasks.** You rule, authorize, verify, and reconcile. **The
executor is not reachable directly** — `ListAgents` returns nothing; **the repository is the only
channel between you.** Do not ask the operator to relay technical facts (`CLAUDE.md` rule 7).

## 2. The operator's working preferences — stated by them, follow them

- **Terse. No narration.** Do not show working, code, or background steps. **Do the work, then report
  the outcome briefly.**
- **Do not ask unless genuinely necessary.** If a fact can be established by reading the repository or
  inspecting state, **establish it**.
- **No excuses.** When something breaks, fix it and say what it was in a sentence — do not explain
  yourself at length.
- **"check comms"** is the operator's cue for you to go read GitHub and act. It is **not** the
  executor's `COMMS` command.
- **Volume is a failure.** A long report of things they already know is worse than silence.
- **Plain English in chat — ALWAYS, and especially in questions.** The operator asked for this
  explicitly. **Do not put `E4`, `GAP-B`, `N6`, `Ustruct`, `MSG-0167`, SHAs or section numbers into a
  question and expect them to carry meaning.** Say what the thing *is*: not *"is E4 satisfiable by an
  unexpanded statement surface"* but *"is it good enough if the engine can show the query without the
  secret text filled in?"*

  **This applies to CHAT ONLY. Repository records stay precise and fully referenced** — they are the
  project's memory and a future session reads them for exact authority. **Two registers, on purpose:
  plain for the human, exact for the record.** Never simplify a COMMS message, a task definition, or a
  status line to match the chat voice.

## 3. Active automation — both are durable and survive this session

| | ID | Fires |
|---|---|---|
| **Lead Loop** | `trig_01PpjCrtoEUZnF3vPACBPfCW` | hourly at `:23`, **fresh session**, runs `ARCHITECTURE-LEAD-LOOP.md` |
| **Execution Supervisor** | *(not a Routine)* | every 10 min on the operator's Windows machine |

**The Lead Loop is PROVEN** as of 2026-08-26 — session `session_01Ln4FPnFFC3pE81HCFbEh3F` ran
`09:07:27Z → 09:10:14Z`, ended **IDLE / REVIEW_READY**, **blocked on nothing**, and **pushed nothing,
which was correct.** **The abort path is still UNPROVEN** — no cycle has yet been seen aborting
because `main` moved. **`ARCHITECTURE-LEAD-LOOP.md` §9.1 carries the evidence and the cause of the
earlier hangs.** *(This line previously read "INSTALLED, NOT PROVEN until a cycle is recorded.")*

**Every scheduled firing before that one HUNG SILENTLY at a permission prompt** — a `rm -rf` in the
scratch-clearing step, which **nobody is present to approve.** **RULE 0 is now in the Routine's
prompt: an unattended cycle never runs a command that needs approval**; it clones into
`WORKDIR=$(mktemp -d)`. **If you ever schedule anything else here, apply the same rule** — a step that
might prompt is a step that will hang, and **a hang looks exactly like "nothing to do."**

Controls: `update_trigger` (`enabled: false`) to pause, `delete_trigger` to remove, `fire_trigger` to
run one cycle now.

**Do not create a second Lead Routine.** Check `list_triggers` before scheduling anything.

## 4. Four mistakes the Lead has actually made — do not repeat them

**1. Inventing a commit SHA.** Twice, a full 40-character SHA was typed from nothing into a `Verified
at HEAD:` line. **Never hand-write a SHA. Always `git rev-parse` it** and substitute programmatically.

**2. Putting a task ID in the dependency cell that is not a dependency.** A markdown link to a task's
own definition file made it depend on **itself**, the queue read as contradictory, and the Supervisor
silently no-op'd. **DISC-0013.** **Before pushing any READY row, replicate the parser** — the
dependency cell is regex-scanned for `TASK-\d{4}` and every ID found must be `COMPLETE`.

**3. Reserving a number in conversation instead of in the repository.** A queue row told the executor
"use MSG-0165 or later"; the Lead then took MSG-0165 itself, and the correction was **still
uncommitted** when the executor began. **The executor read the repository and was right.** **Ten
numbers are now doubly claimed** — check `implementation/comms/README.md` before allocating.

**4. Writing a NEGATED status word into the status cell.** A row was written `AUTHORIZED — NOT READY`
— which any human reads as *not ready* — and **the Supervisor parses the cell WORD BY WORD with no
negation handling**, so `\bREADY\b` matched and it parsed as **READY**. It would have **started a
runner against a prerequisite known to be unmet.** **DISC-0015**, and it is **the mirror image of
mistake 2**: that one made the Supervisor do nothing when it should have acted; this one would have
made it act when it must not. **Use `WAITING_FOR_OPERATOR` or `WAITING_FOR_ARCHITECTURE_LEAD`, keep
ALL prose out of the status cell, and run the pre-push check before pushing ANY board change — not
only a READY row.** **That is what caught this.**

**The pattern behind all four: the repository is the state. An intention held in a session is not.**
**And mistakes 2 and 4 share a sharper one — a board cell written in prose and read by a regex will
keep producing failures that look correct to a human reader.** **Q17 is the open question about that
mechanism; every one of these is input to it.**

**One more thing worth knowing before you trust the pre-push check: it is NOT a faithful replica of
the Supervisor.** **Three verified divergences** are recorded in DISC-0015 §5 — mismatched status
lists, no unrecognised-status check, no `IN_PROGRESS` validation. **None is live today, and it is
still the best instrument available** — but **a pass is weaker evidence than MSG-0172 §3 assumed when
it made a pass count as evidence.**

## 5. Standing boundaries — the ones most easily eroded

- **Never rule an open question because a bare approval seemed to cover it.** Q21 and Q17 are not
  yes/no questions. **A one-word approval must be scoped in writing before it is recorded** —
  MSG-0166 §9 is the worked example.
- **Never select, adopt, deploy, implement or clear an engine.** Selection is OPEN on every axis
  (EPA-0006 §12.1). **Ten probes have cleared nothing.**
- **Never weaken a gate to let something pass.** MSG-0119: failure does not authorize weakening.
- **Verification is adversarial.** An execution record is a claim until checked against its artefacts
  — read the probe source, count the rows, run the diffs. **MSG-0164 §1 is the standard.**
- **`UNKNOWN` is a valid answer and is required where you have not checked.** The Supervisor's logs
  and `runner.lock` are on the Windows machine and **are not readable from the Lead's environment.**

## 6. Where to pick up

**Always re-derive from the repository; this section will go stale.**

1. `git fetch origin main`, then diff against the newest `**Verified at HEAD:**` line in
   `implementation/comms/`.
2. Read `implementation/status/current.md` — its top line is the live state.
3. Read `implementation/operations/CLAUDE-TASKS.md` — the single READY task, if any.
4. Read every OPEN item in `comms/`, `blockers/`, `discoveries/`.

**State at the time of writing (`0e1da66`), to be re-verified, never trusted:** **NO TASK IS READY and
the queue is correctly empty — do NOT mistake that for a stall and do NOT manufacture work to fill
it.** **TASK-0055 is authorized and sits at `WAITING_FOR_OPERATOR`**, waiting on two allow-lines the
operator holds (BLK-0014). **Open blockers: BLK-0012, BLK-0014.** **Open and unruled: Q21, Q17, Q14,
MSG-0060.** **Q22, Q23, Q24's parent and Q25 are RULED** (MSG-0170, 0171, 0172, 0182). **Thirteen
probes have cleared nothing; GAP-B UNDISCHARGED; E4 UNMET; nothing selected, adopted, deployed,
implemented or cleared.**

**The two things genuinely waiting on the operator, and neither is a technical question:** BLK-0014's
permission line, and — the larger one — **whether to obtain an engine from a different family purely
as a test subject.** **Every subject in thirteen probes has been SQLite, because it is the only engine
reachable without an install, and an accumulating readable statement log is not a SQLite feature.**
**MSG-0182 §7 states it; MSG-0179 §3 item 2 is the alternative if no install is made.**

> **Superseded, retained:** *"State at the time of writing (`9d71790`) … **TASK-0050 is READY** —
> discharge **GAP-B**, the binding constraint on the programme. **Open and unruled: Q21, Q17, Q14, the
> L4/W-B non-reproduction (MSG-0164 §5), MSG-0060.**"* **TASK-0050 ran and answered its question: no
> reachable subject supplies E4 both obtainable and non-adverse.** The L4/W-B non-reproduction was
> settled by TASK-0053 — **the variable is residue KIND, not density.**
