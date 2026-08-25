# Implementation Blockers

Conditions preventing progress or preventing verification of acceptance criteria.

A blocker stays OPEN until the underlying condition is resolved. An acceptance criterion covered
by an open blocker must never be reported as met.

| ID | Title | Severity | Status |
|---|---|---|---|
| BLK-0001 | Authorized host not yet bootstrapped (narrowed) | High | **RESOLVED** 2026-08-19 |
| BLK-0002 | GitHub push unavailable — communication channel down | Critical | **RESOLVED** 2026-08-19 |
| BLK-0003 | PCI server key cannot be unlocked from the tool environment | High | **RESOLVED** 2026-08-19 |
| BLK-0004 | No privilege to bootstrap the authorized host | High | **RESOLVED** 2026-08-19 |
| BLK-0005 | Two contradictory MSG-0020 decisions | High | **RESOLVED** 2026-08-19 |
| [BLK-0006](BLK-0006-mid-run-repository-movement.md) | `origin/main` moved mid-run; TASK-0021 closeout commit cannot be pushed | Low impact, hard boundary | **RESOLVED** 2026-08-21 — mover identified as the lead push `182698c` (MSG-0056); reconciled by fetch + rebase, zero file overlap, no conflict, no force-push |
| [BLK-0007](BLK-0007-github-ssh-transport-closed.md) | GitHub SSH transport closed at banner exchange; push unavailable | Medium | **RESOLVED** 2026-08-21 — recovered on its own in ~10 min; push landed `42426df` and the blocked dry run completed. **No workaround was applied**; cause never established beyond "transport, upstream, transient" |
| [BLK-0008](BLK-0008-designated-corpus-unreachable.md) | Designated A-SURVEY corpus (NFS export `\\10.1.27.220\LXBackup\plan.pdf`) is not reachable | Medium | **RESOLVED** 2026-08-22 — neither transport problem had to be solved: the corpus was supplied directly at `D:\Work\pci-corpus\plan.pdf` and is readable. Nothing mounted, no Windows feature installed, no privileged change. Retained for the diagnosis (SMB tested first, **corrected to NFS** — 2049/111 closed *and* Client for NFS not installed) and for the near-miss where the file first landed **inside the repository**, untracked, one `git add -A` from permanent history |
| [BLK-0009](BLK-0009-concurrent-session-writing-working-tree.md) | Concurrent session writing the working tree; TASK-0027 READY only in an uncommitted file | Low impact, hard boundary | **RESOLVED** 2026-08-22 — the concurrent writer was the interactive COMMS session; it committed its reconciliation in `66314e1`, after which `git status` was clean and TASK-0027 was READY in the **committed** queue. The runner's refusal to run `git add -A` or to execute on an uncommitted READY marking was correct |
| [BLK-0010](BLK-0010-corpus-read-denied-to-unattended-runner.md) | The A-SURVEY corpus sits outside the repository; the unattended runner may not read outside it | Medium | **RESOLVED** 2026-08-22 — **MSG-0083 chose option A**: a narrow read-only grant for `D:\Work\pci-corpus\` applied to `runner-settings.json` (`additionalDirectories` plus an `Edit()` deny, read-only by construction). **Verified empirically** — a headless session with those settings read 641,807 bytes, `%PDF-1.7`, and cannot write. Three ineffective deny rules (`Write`/`MultiEdit`/`NotebookEdit`) were rejected by the permission layer and **removed rather than left giving false assurance** |
| [BLK-0011](BLK-0011-python-interpreter-denied-to-unattended-runner.md) | The second E4 test subject is a Python interpreter the unattended runner may not invoke; TASK-0043 stopped at its first substantive action | Hard boundary for an unattended runner; **trivially clearable by an operator, and by nobody else** | **RESOLVED** 2026-08-24 — **MSG-0145 granted `py` for this task only; MSG-0146 records the run: E4 is OBTAINABLE on the second subject and the inspection is ADVERSE — passage text bound as a PARAMETER appears verbatim in the engine trace. The runner permission set was NOT broadened, so the unattended condition described here still holds.** Originally recorded as: `py -V` and `py …/probe.py` **both** return `This command requires approval`. **Cause VERIFIED by reading the permission set**, not inferred: `.claude/settings.local.json` allows `Bash(node *)` and eight `--version` checks and has **no `py` / `python` / `python3` entry**; `runner-settings.json` grants **no interpreter**. **Three distinguishable behaviours make it a denial and not an absence** — `node -e` ran (`v24.15.0`), `docker`/`psql` returned `command not found`, `py` did neither. **The probe is written, committed and NOT RUN.** **A `node` + `child_process` workaround exists and was NOT taken** (rule 2). **Three options for the Lead; option A — a narrow `Bash(py implementation/probes/TASK-0043/probe.py)` grant — is recommended on this table's own BLK-0010 precedent** |
| [BLK-0012](BLK-0012-no-reachable-subject-can-supply-non-adverse-e4.md) | No reachable test subject supplies **E4 both OBTAINABLE and NON-ADVERSE**; the enumeration is bounded by what an unattended runner may execute | **Binding constraint on the programme** (§4.13 EV5: *"an engine that cannot supply EV5 cannot be selected under any topology"*) | **OPEN** 2026-08-26 — **TASK-0050 executed and answered its question**; this records the reach. **Subject 1 measured this session** (SQLite 3.51.3 / `node:sqlite` / Node v24.15.0): **E4 NOT OBTAINABLE** on a **wider** enumeration than §4.12 or §4.14 used — 21 C-API names checked, **7 of 7** tracing pragmas inert against the F15 control, `sqlite_stmt` / `bytecode` / `tables_used` / `sqlite_dbpage` **absent from the build**. **Subject 2 not re-measured**: MSG-0145's `py` grant is scoped to **TASK-0043**, and the only allowlisted `py` invocation is TASK-0043's probe, which TASK-0050 is **forbidden to re-run as new evidence**. **No third subject exists without an install** — repository `node_modules` absent, npm global carries 4 non-engine packages, `node:sqlite` is the only database built-in. **A `node` + `child_process` workaround exists and was NOT taken** (rule 2, BLK-0011's precedent). **Four options in the record; option A — rule the MSG-0168 §7 referral first — is recommended and costs nothing**, because it decides whether the others would help. **Evidence: MSG-0168** |
| [BLK-0013](BLK-0013-task-0050-push-rejected-origin-moved-mid-run.md) | **`origin/main` moved mid-run; TASK-0050's records are committed locally and cannot be published** | **Communication channel down for that session** — the evidence work is complete and **none of it is on `main`** | **OPEN** 2026-08-26 — `git push origin main` returned **`! [rejected] main -> main (fetch first)`**, so the remote holds work this session does not have. **This is CLAUDE.md's fail-closed *"mid-run repository movement — abort"* boundary** (MSG-0028 decision 2), not an error to retry past. **No force-push, rebase, merge, pull or reset**; three commits (`f41c202`, `f063f09`, `339157f`) intact and unpublished. **No reconciliation is possible from this session**: `git fetch`, `git fetch --all`, `git ls-remote` and `git push --dry-run` were each tried **once** and each returned *"This command requires approval"* — **cause established by reading both permission files**, which grant `git push origin main` and **no read of the remote at all**. **The transport is FINE and this corrects a diagnosis that could have been wrong**: the push **reached** `github-pci` and was refused at protocol level, so this is **not** BLK-0007's transport fault and **nobody should be sent to fix SSH**. **What moved it is UNKNOWN and deliberately not guessed** — MSG-0166's hourly Lead Routine is offered as the first place to look, **as an inference, not an observation**. **Consequence: TASK-0050's outcome 7 is UNMET and the task is BLOCKED, not COMPLETE.** **Option A — reconcile in an attended session; option B — grant the runner a read-only `git fetch`, which removes the whole class of failure and gives no write capability.** **They are not alternatives** |

**Two blockers are open: BLK-0012 and BLK-0013**, both raised 2026-08-26 by the TASK-0050 runner. **They
are unrelated in cause and should not be read together.** BLK-0012 is about **the evidence** — the reach
the GAP-B answer is bounded by. **BLK-0013 is about the channel** — `origin/main` moved mid-run, the
push was rejected, and **none of TASK-0050's records are on `main`**. **BLK-0013 must be cleared first,
or nobody but this machine can read the work that BLK-0012 describes.**

**BLK-0012.** Raised 2026-08-26 by the TASK-0050 runner. **It is not a failure to
execute the task** — TASK-0050 ran and answered its question. It records **the reach the answer is
bounded by**: no reachable subject supplies E4 that is both obtainable and non-adverse, and the three
things that bounded the enumeration are a `py` grant scoped to a different task, a build lacking
`ENABLE_STMTVTAB`, and an absent extension binary. **Each is an operator decision and none was routed
around.** **§4.13 EV5 makes this the binding constraint on the programme**, so the blocker is severe in
consequence while being trivial to describe.

**BLK-0011 is the direct precedent and its condition is the first of the three.** The `py` grant was
deliberately **not** made standing (MSG-0145 §3), so an unattended task needing it stops in exactly the
same place — which is what BLK-0011 predicted in its own closing note.

> **The paragraph this replaces, retained:** "**No blocker is open.** BLK-0011 was the last, and **the
> operator cleared it the same day** by authorizing `py` **for TASK-0043's probe only** (MSG-0145); the
> committed harness was then run **unchanged** and its result recorded in MSG-0146 — **E4 OBTAINABLE on
> the second subject, and adverse**." **True as written**, and true from 2026-08-24 until BLK-0012 was
> raised on 2026-08-26.

> **The paragraph this replaces, retained:** "**One blocker is open: BLK-0011.** It gates **TASK-0043**
> and nothing else, and **it will stop identically on every unattended retry** until the Architecture
> Lead chooses one of its three options." **Both claims were correct**, and the second one still is:
> **the runner's permission set was deliberately NOT broadened**, because the grant was scoped to one
> task and a standing `runner-settings` rule would have been wider than the authorization. **An
> unattended task needing `py` will stop in exactly the same place**, and that needs a fresh decision.

**Nothing else is blocked by it.** E4 was already NOT CLEARED and remains so; **§4.13 GAP-B is
untouched** — that gap is a claim about the *first* test subject, and this blocker says only that the
*second* one could not be reached. **The two must not be merged**: *"the instrument could not be run"*
is not *"the instrument ran and showed nothing"*, and BLK-0011 exists partly to keep them apart.

> **The line this replaces, retained:** "**No blocker is open.** BLK-0010 was the last, and MSG-0083
> cleared it the same day by authorizing the narrow corpus read. **TASK-0027 (A-SURVEY) is READY** and
> needs no re-authorization — MSG-0080 still authorizes it, and the runner can now reach the corpus."
> True from 2026-08-22 until BLK-0011 was raised on 2026-08-24.

> **Worth reading BLK-0010 and BLK-0011 together, because they are the same shape twice.** Both were
> raised by a supervisor-started runner that reached a task's first action and stopped; both are
> permission-layer denials rather than missing capability; **both were nearly misdiagnosed by the same
> refusal wording**, and BLK-0011 avoided that only because BLK-0010 had written the lesson down —
> *issue the command alone before concluding anything from a refusal that names "multiple
> operations"*. **The index entry is the reason the second one cost minutes instead of a session.**

> **The line this replaces, retained:** "**One blocker is open: BLK-0010.** It gates **TASK-0027
> (A-SURVEY)** and nothing else … it will stop identically on every unattended retry until MSG-0082's
> option A, B, or C is chosen." Option **A** was chosen and applied.

> **The line this replaces, retained:** "**No blocker is open.**" True from the BLK-0008 closure on
> 2026-08-22 until BLK-0010 was raised later the same day.

### BLK-0009's row was missing, and is added here — 2026-08-22 (BLK-0010 session)

`BLK-0009-concurrent-session-writing-working-tree.md` was raised and resolved on 2026-08-22 and had
**no row in this table**, in either state. It is the same drift this file already documents twice, in
the two sections below — a blocker closed in its own file and not in the index.

The row above is a documentation reconciliation of an **already-committed, already-RESOLVED** record;
`BLK-0009-...md` itself was **not** edited. It is disclosed here rather than made silently, because
the TASK-0014 precedent below shows that adding a missing row was once treated as needing its own
authorization (MSG-0037). **If the Architecture Lead considers that still binding, this row is the
thing to review.**

**The rule at the top of this file earned its third recurrence today:** add a blocker's row in the same
commit that raises it, and update it in the same commit that closes it.

BLK-0005 was closed by [`../comms/MSG-0022-resolve-msg-0020-conflict.md`](../comms/MSG-0022-resolve-msg-0020-conflict.md)
and [`../comms/MSG-0023-correct-task-0009-boundary.md`](../comms/MSG-0023-correct-task-0009-boundary.md):
the **COMPLETE** decision stands, WP-0001 is COMPLETE, and TASK-0012 is not authorized and must not
be created. Record: [`BLK-0005-conflicting-msg-0020-decisions.md`](BLK-0005-conflicting-msg-0020-decisions.md) §RESOLVED.

## Index correction — 2026-08-20 (TASK-0013, authorized by MSG-0035 decision 1)

BLK-0001 and BLK-0004 were shown **OPEN** in this index long after their own records had been closed.
The blocker files were resolved on 2026-08-19; the index was never updated with them, so for a day
this table asserted that two High blockers gated acceptance criteria that had in fact been verified.

The contradiction was found by the TASK-0011 audit and raised in MSG-0032 §6.2. TASK-0011 did **not**
fix it — changing a blocker status is a substantive change to the project record, and it lay outside
that task's authorized scope, so it stopped at the boundary and asked. MSG-0035 decision 1 gave the
authorization; TASK-0013 applied it.

Evidence the resolution is real, quoted from the blocker records rather than summarised:

```text
$ docker info --format '{{.DockerRootDir}}'
/data/docker
$ docker --version                Docker version 29.1.3, build 29.1.3-0ubuntu3~24.04.2
$ systemctl is-active docker      active
$ cat /etc/docker/daemon.json     {"data-root": "/data/docker"}
```

That was BLK-0004's own stated closure condition, verified directly by Claude Code on the host rather
than accepted from a report. BLK-0001 closed on the same evidence plus the 229-test run — none of
which is possible on an unbootstrapped host, which is exactly what the two blockers asserted.

Full detail: [`BLK-0001-no-execution-environment.md`](BLK-0001-no-execution-environment.md) §RESOLVED,
[`BLK-0004-host-privilege-unavailable.md`](BLK-0004-host-privilege-unavailable.md) §RESOLVED,
[`../comms/MSG-0035-architecture-decisions.md`](../comms/MSG-0035-architecture-decisions.md).

**Worth keeping, for the reader who was not there:** the index and the underlying records disagreed
for a day, and the index is what a new session reads first. The rule at the top of this file — an
acceptance criterion covered by an open blocker must never be reported as met — meant the stale index
made WP-0001's completion look unsound on its face. Nothing was actually wrong with WP-0001. Update
this table in the same commit that closes a blocker.

### BLK-0005 — was missing from the table; corrected 2026-08-20 (TASK-0014, MSG-0037)

`BLK-0005-conflicting-msg-0020-decisions.md` existed on disk and was closed (MSG-0022 / MSG-0023),
but it had **no row above**. TASK-0013's scope forbade changing any blocker other than BLK-0001 and
BLK-0004, so it was deliberately left alone and reported instead, in MSG-0036 §6.

The architecture lead ruled in **MSG-0037**: the row is authorized, the underlying blocker record is
not to be altered, and the row must reflect the resolved state and cite the evidence. TASK-0014
applied exactly that. The row above is the only change to this table; BLK-0001 through BLK-0004 are
unchanged, and `BLK-0005-conflicting-msg-0020-decisions.md` itself was **not** edited.

**Read the two corrections together, because they are one failure.** BLK-0001 and BLK-0004 were shown
OPEN when their records said RESOLVED; BLK-0005 was shown nowhere at all when its record said
RESOLVED. Both directions of drift come from the same habit — closing a blocker in its own file and
not in this table. The rule at the top of this file gives that habit teeth: an index that under-reports
a closure makes sound work look unsound, and an index that over-reports one would be worse. **Update
this table in the same commit that closes a blocker**, and add its row in the same commit that raises
one.
