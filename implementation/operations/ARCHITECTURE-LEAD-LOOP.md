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
9. **Commit and push to `claude/architecture-lead-loop` — NEVER to `main`.** See §7.

**Working on the branch, mechanically:** fetch both `origin/main` and `origin/claude/architecture-lead-loop`;
check the Lead branch out (create it from `main` if it does not exist); **merge `main` into it** before
doing any work, so the cycle sees the executor's latest; then commit and push the branch. **Never
force-push, never rebase a published branch, and never push `main`.**

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

**Before pushing any READY row, verify it against the Supervisor's parser.** The dependency cell is
regex-scanned for `TASK-\d{4}`, and **every ID found there must name a task whose board status is
`COMPLETE`** — otherwise the queue is contradictory and the Supervisor fails closed with a silent
no-op. **Never put a task-definition filename, or a citation that happens to contain a task ID, in
that cell.** **DISC-0013** is the incident; the failure is indistinguishable from "no work to do".

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

## 7. Concurrency — the Lead NEVER writes to `main` (Q23, MSG-0170)

**RULED 2026-08-26 by the operator: the Lead Loop writes only to `claude/architecture-lead-loop`.
The operator merges it. The Lead Loop must never push to `main`.**

**Why, from the incident rather than from theory.** On 2026-08-25 the Lead pushed to `main` while the
executor's runner was mid-task. The runner had committed locally and its push became
non-fast-forward and was **rejected** (BLK-0013). The Supervisor requires local `HEAD` to equal
`origin/main`, so it then refused **every cycle for about four and a half hours** —
`NOOP :: not reconciled: local is ahead by 5 (and behind by 1)` — and **the runner is permitted
`git push origin main` and no merge or fetch, so it could not free itself.** **Only a human could.**

**MSG-0166 §5 called this a race and treated detect-and-abort as sufficient. It was not.** A race
resolves itself; **this was a standing deadlock**, and it re-created exactly the human dependency the
loop existed to remove.

**The consequence of this ruling, stated plainly because it is a real cost:** a queue row the Lead
Loop writes **does not reach the executor until the operator merges the branch.** The Supervisor reads
`main`. **So the loop can verify, record and prepare autonomously, but making a task READY still ends
in a human merge.** That is the price of never colliding, and the operator chose it knowingly.

### The rules that remain

1. **Fetch before writing, re-check before pushing** (§3 steps 2 and 8). **`main` moving mid-cycle is
   an abort, not a merge.**
2. **Never force-push, never rewrite published history**, and never resolve a race by overwriting the
   other side's work.
3. **The executor's `runner.lock` is not observable from the Lead's environment.** Whether a runner is
   active is **UNKNOWN** to this loop and must be reported as unknown, never assumed either way.

### Superseded — retained so the reasoning is not lost

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

---

## 9. The Routine itself — identity, and how to stop it

**Recorded here because a future session must be able to find and disable this loop from the
repository alone.** A running automation whose control surface exists only in someone's chat history
is not operable.

| | |
|---|---|
| **Name** | `PCI Architecture Lead Loop` |
| **Trigger ID** | `trig_01PpjCrtoEUZnF3vPACBPfCW` |
| **Schedule** | `23 * * * *` — hourly at :23, offset from the Supervisor's ten-minute cadence |
| **Mode** | fresh Claude session per firing (`create_new_session_on_fire`) |
| **Environment** | `env_01MwRiYLdHr7efifdENLpoUg` |
| **Created** | 2026-08-25T21:29:57Z, **enabled**; first run 2026-08-25T22:23:00Z |
| **Notifications** | push to the operator on a noteworthy completion |
| **Authority** | **MSG-0166** |

**To pause it:** `update_trigger` with `enabled: false`. **To remove it:** `delete_trigger`. **To run
one cycle out of schedule:** `fire_trigger`. **Pausing is reversible and is the right first move if
the loop misbehaves** — deletion discards the run history.

**Known limitation, verified at creation:** the Routine **stores no MCP connectors**, so its sessions
run **without `mcp__github__*` tools**. **This loop is designed for that** — every repository
operation in §3 uses the `git` CLI over HTTPS, not the GitHub MCP server. **If a future cycle needs
GitHub API access** (issues, PRs, checks), it does **not** have it and must **record that as a
limitation rather than route around it.**

## 9.1 Status: PROVEN — and the earlier hangs had a cause worth recording

**Status: PROVEN** as of 2026-08-26. **Superseded text, retained:** *"INSTALLED, NOT PROVEN. No cycle
has run as of `ca13125`."* That was true when written, and the paragraph below is what replaced it.

**The evidence, VERIFIED in the session that recorded this** by reading the session record directly,
not carried from a summary:

| | |
|---|---|
| **Session** | `session_01Ln4FPnFFC3pE81HCFbEh3F` |
| **Ran** | `2026-08-26T09:07:27.066253Z` → `2026-08-26T09:10:14.443582Z` |
| **Ended** | `SESSION_STATUS_IDLE`, bucket `REVIEW_READY` — **completed, blocked on nothing** |
| **Pushed** | **nothing — which is the correct outcome**, the repository having not moved |
| **Origin** | `force_run_trigger` (a deliberate out-of-schedule test fire) |

**That discharges MSG-0166 §7's start-path requirement**: the session reached the repository, read its
rules, and **no-op'd correctly when nothing had changed.** **What it does NOT yet establish is the
abort path** — no cycle has yet been observed aborting because `main` moved underneath it. **That
remains UNPROVEN and must not be reported otherwise.**

### Why every earlier firing hung, and the rule that came out of it

**Every scheduled firing before this one died silently at a permission prompt.** **VERIFIED by reading
the blocked session's record**, not inferred from its silence: `session_01KdygB2vwtYchnsDGEtpN2X`,
created `07:25:05Z`, stuck from `07:28:33Z` at `SESSION_STATUS_REQUIRES_ACTION` / bucket `BLOCKED`,
with a **pending Bash approval** for a command whose first clause was:

```text
cd <scratchpad> && rm -rf pci-platform && git clone …
```

**The loop was clearing a scratch directory before re-cloning.** In an unattended session **there is
nobody to approve a destructive command**, so the cycle did not fail — **it waited, indefinitely, and
reported nothing.** **A hang is indistinguishable from "nothing to do" from the outside**, which is
the same failure signature as DISC-0013 and DISC-0015 one layer up.

**RULE 0, now in the Routine's own prompt: an unattended cycle NEVER runs a command that needs
approval.** It clones into `WORKDIR=$(mktemp -d)` — a fresh directory that needs no clearing — and
**if any command is refused, it stops and records that, rather than waiting.**

**The general lesson, worth more than the fix:** **a scheduled automation must be written so that
every step it takes is already permitted.** A step that *might* prompt is a step that *will* hang, and
**silence is the one failure mode no monitor catches.**

### One property observed while verifying, recorded because it bears on §5

**Both sessions report `last_served_model: claude-sonnet-5`.** **The automated Lead cycle is therefore
NOT served by the same model as the interactive Lead session.** Nothing here depends on that, and it
is **not** offered as a reason to distrust a cycle's output — **but it is a further reason the §5
authority boundary is right as written:** the loop verifies, reconciles and records, and **may not
rule, select, clear or authorize.** **A mechanical-only boundary is sound whatever model executes it,
which is precisely the property that makes it the correct boundary.**
