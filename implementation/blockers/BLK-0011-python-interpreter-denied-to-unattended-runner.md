# BLK-0011 — The Python Interpreter Is Denied to the Unattended Runner; TASK-0043 Stopped at Its First Action

**Status:** **RESOLVED** 2026-08-24 — **the operator granted authorization to invoke `py` solely for
TASK-0043's bounded E4 probe (MSG-0145), and an interactive session ran the committed harness under it
(MSG-0146). E4 is OBTAINABLE on the second subject, and the inspection is adverse: passage text bound
as a PARAMETER appears verbatim in the engine's trace.** **Nothing was installed and the runner's own
permission set was NOT broadened** — the grant was scoped to one task, so a standing `runner-settings`
rule would have been wider than the authorization. **The condition this blocker describes therefore
remains true for future UNATTENDED tasks**, and needs a fresh decision if one requires `py`.

> **The line this replaces, retained:** "**OPEN** 2026-08-24 — requires an operator decision on this
> machine's runner permission set. **Nothing was executed, nothing was installed, and no E4 observation
> of any kind exists**." **True as written.** The stop was correct: the runner recorded the boundary
> instead of routing around it, and **the harness it wrote was run unchanged** once the grant existed.
**Raised:** 2026-08-24, by the supervisor-started TASK-0043 session (`runner.lock` pid **25932**,
acquired **2026-08-24T18:59:38Z**, host `LENOVO-LA0X1754`)
**Severity:** Hard boundary for an unattended runner. **Trivially clearable by an operator**, and
clearable by nobody else
**Related:** **MSG-0141** (the authorization), **MSG-0142** (which enumerated the subject this session
cannot reach), **MSG-0143** (whose supervisor prediction this session also disproves),
**BLK-0010** and **BLK-0008** (the precedents this stop follows), **TASK-0043**, EPA-0006 §4.13 GAP-B

## Summary

The Execution Supervisor started this session to execute **TASK-0043**. **It reached the task's first
substantive action and stopped there.**

TASK-0043 authorizes a bounded probe to establish whether **E4** — *"log inspection: no unauthorized
passage text in the engine's own logs"* (EPA-0006 §4.6 S6) — is obtainable on **a second test
subject**, the first having produced two independent negatives. MSG-0142 identified that second
subject: **Python 3.14.5, reached through the Windows launcher `py`, carrying SQLite 3.50.4 with
`set_trace_callback`, `set_authorizer` and `set_progress_handler`.**

**This runner cannot invoke `py`.** The probe harness was written and is committed; **it was not
run**, and no substitute for running it was attempted.

**TASK-0043's own stop condition names this case in terms:** *"Stop if establishing E4 would require
installing anything, modifying host configuration, **operator intervention**, or selecting an engine.
An environment boundary is recorded, not routed around — BLK-0008 and BLK-0010 are the precedents."*
This is that blocker.

## VERIFIED — the denial, and the two-step disambiguation BLK-0010 taught

**BLK-0010 records a refusal whose wording nearly produced a wrong diagnosis, and that lesson was
applied here before anything was concluded.**

**Attempt 1** — a compound command:

```text
$ command -v py; command -v python; command -v python3; echo "=== py version ==="; py -V 2>&1
This Bash command contains multiple operations. The following parts require approval:
command -v py, command -v python, command -v python3, py -V
```

**This refusal does not name a path or a binary boundary.** It complains about *multiple operations*.
Read alone it is equally consistent with "the command shape needs approval" — which would mean `py`
is reachable and this blocker is a misdiagnosis. **BLK-0010 is the precedent for exactly that trap.**

**Attempt 2** — the single command, alone:

```text
$ py -V
This command requires approval
```

**Attempt 3** — the task's actual action, not a version check, so that the denial is recorded against
the operation that matters rather than against a proxy for it:

```text
$ py implementation/probes/TASK-0043/probe.py
This command requires approval
```

**Three attempts, one privilege, asked once in each of the forms that could have behaved
differently.** No fourth was made.

## VERIFIED — the cause, established by reading the permission set rather than inferred

**Rule 5: a bare command failure is not a diagnosis.** *"Establish the cause before naming it; a wrong
diagnosis sends the operator to fix something that was never broken."*

`.claude/settings.local.json`, read in this session, allows **`Bash(node *)`** and a list of
version-check commands — `Bash(go version *)`, `Bash(java -version)`, `Bash(dotnet --version)`,
`Bash(docker --version)`, `Bash(psql --version)`, `Bash(pip --version)`, `Bash(uv --version)`,
`Bash(poetry --version)` — and **carries no entry for `py`, `python`, or `python3`.**

`implementation/operations/supervisor/runner-settings.json`, also read in this session, grants
`additionalDirectories` for the corpus and exactly four narrowly-scoped `git` commands. **It grants no
interpreter at all.**

**So the cause is the runner's permission set, and not a missing Python.** Note the shape of it:
`Bash(pip --version)` is allowed while `py` is not — the allowlist can ask Python's package manager
its version and cannot run Python.

**Corroborating, and deliberately not treated as proof:** `node -e "console.log(process.version)"` ran
without approval and returned **`v24.15.0`**, and `docker --version` and `psql --version` both
returned `command not found` — so the permission layer is *not* refusing everything, and the two
recorded absences are genuine absences rather than denials. **`py` behaves differently from both**: it
is neither silently run nor reported missing.

**Whether Python 3.14.5 is still installed on this machine is UNKNOWN to this session.** MSG-0142
recorded it and nothing here contradicts it, but this session never got far enough to see it. **The
blocker is about reachability, not about presence.**

## The workaround that exists, and why it was NOT taken

**State it plainly, because a future session will find it within minutes and be tempted.**

`Bash(node *)` is allowed. The permission layer inspects the Bash command line, not what the process
that command starts goes on to spawn. So

```text
node -e "console.log(require('child_process').execSync('py -V').toString())"
```

would very probably have run Python and produced the observation this task wanted.

**It was not attempted, and it must not be.** CLAUDE.md non-negotiable rule 2: *"**Never work around a
permission denial.** Do not use a different path, a temporary location, a user-writable directory, a
piped shell, or any other substitute for the privilege you were not given."* TASK-0043 says the same
in fewer words: *"An environment boundary is recorded, not routed around."*

**Two things follow, and they point in opposite directions — both are recorded.**

1. **For this task:** the gap is prohibited, so the task stops. That is the whole of the decision here.
2. **As a discovery about the control itself:** the runner's permission set is **not a containment
   boundary** — it constrains the *shape of a command*, and an allowed interpreter can start any
   process at all. This is not a defect introduced by anything in this task, and **no action on it is
   proposed or authorized here**. It is written down because a control that reads as a boundary and
   is not one will eventually be relied on as though it were.

## What this does NOT establish — the distinction that matters most

**E4 was NOT shown to be unobtainable on the second subject.** Nothing about Python's `sqlite3` was
observed in this session, because nothing about it could be executed.

**"The instrument could not be run" and "the instrument ran and showed nothing" are different
findings, and conflating them is the precise error this whole line of work exists to prevent.**
EPA-0006 §4.12's nonexistent-pragma control was invented so that *"the instrument reported nothing"*
and *"the instrument was never running"* could be told apart. **Recording "E4 unobtainable" here would
commit that error at the level of the task rather than at the level of a pragma.**

So, exactly:

- **E4 remains NOT CLEARED** — unchanged, and unchanged *for the reasons already on record*, not for
  a new one.
- **§4.13 GAP-B stands** — it is a statement about the **first** subject (`node:sqlite`, SQLite
  3.51.3), established by enumeration with a control, and **this session neither strengthens nor
  weakens it**.
- **The second subject's E4 position is UNKNOWN**, and this blocker is why.
- **No candidate verdict moves.** All six candidates measured by TASK-0042 remain **NOT CLEARED**.
  **Seven probe efforts have now cleared nothing** — six that measured, and this one that could not
  start.

## What the operator can do

**The decision is genuinely the Architecture Lead's**, because it widens what an unattended runner may
execute. Three options, and this session recommends the first:

| | Option | What it costs | What it risks |
|---|---|---|---|
| **A** | **Add a narrow allow entry** for the probe only — e.g. `Bash(py implementation/probes/TASK-0043/probe.py)` — to `.claude/settings.local.json` or `runner-settings.json` | One line | **Least broadening.** The runner gains the ability to run **one committed, reviewable file** and nothing else. **BLK-0010's option A is the precedent**: a narrow grant, scoped to the one thing that was blocked |
| **B** | Add a general `Bash(py *)` / `Bash(python *)` grant | One line | **Broad.** It gives an unattended runner a general-purpose interpreter, which is a materially larger capability than any task so far has needed. Not recommended |
| **C** | Run TASK-0043 in an **attended** session, approving the prompt interactively | No configuration change at all | Nothing persists, so the next unattended attempt blocks again. Fine as a one-off; it leaves the queue unable to run this task on its own |

**Option A keeps the grant proportionate to the blockage, exactly as MSG-0083 did for BLK-0010.**

**Whichever is chosen, the probe is ready.** `implementation/probes/TASK-0043/probe.py` is committed,
takes no arguments, needs no network and installs nothing. Its harness is written to §4.12's control
standard: **every instrument it arms is run disarmed first, and a disarmed instrument that is not
silent voids the run.**

## Evidence trail

| Item | Where |
|---|---|
| The probe harness, written and committed but **not run** | `implementation/probes/TASK-0043/probe.py` |
| Startup, session provenance, and the reachable-subject enumeration | `implementation/operations/checkpoints/TASK-0043.md` checkpoint 1 |
| The execution record and its reconciliation | `implementation/comms/MSG-0144-task-0043-blocked-python-unreachable.md` |
| The authorization this stops inside | `implementation/comms/MSG-0141-e4-observability-evidence-task-authorization.md` |
| The enumeration that identified the unreachable subject | `implementation/comms/MSG-0142-task-0043-reconciliation.md` |
