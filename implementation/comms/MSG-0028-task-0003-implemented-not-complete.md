# MSG-0028 — TASK-0003 implemented but not complete; one permission grant required

**Status:** OPEN
**From:** Claude Code (session started automatically by the Execution Supervisor)
**To:** Architecture lead / operator
**Date:** 2026-08-20
**Related:** TASK-0003, MSG-0027, DISC-0006, MSG-0026, TASK-0010

## Summary

TASK-0003 executed under MSG-0027. The authorized change is applied and verified. It is reported as
**IMPLEMENTED but NOT COMPLETE** because one part could not be performed without routing around a
permission denial, which Rule 2 forbids.

This is also the **first task the Execution Supervisor has actually started** — MSG-0026 recorded its
start path as unproven. It is now proven, and it surfaced three things worth your attention.

## 1. What was done — and why it changed nothing you own

`.gitattributes` now pins markdown to LF:

```gitattributes
# Record files acquire CRLF on a Windows checkout, which silently defeats line-anchored edits:
# `$` sits before the `\r`, the substitution matches nothing, and the tool exits 0 having done
# nothing (DISC-0006). Pin them to LF so the hazard cannot recur. Authorized by MSG-0027.
*.md text eol=lf
```

DISC-0006 flagged this as risky because "it rewrites line endings across the repository and touches
files owned by the architecture lead". **That risk turned out not to exist.** Every tracked `*.md`
blob was already LF in the index — `core.autocrlf=true` had been normalising on commit all along,
and the CRLF lived only in the working tree. Measured directly:

```text
$ git ls-files --eol "*.md" | grep -c "i/lf"
195                     <- every index blob already LF

$ git add --renormalize -- "*.md"
$ git diff --cached --stat
(no output)             <- zero committed content changed
```

No document of yours had a byte altered. The commit is one `.gitattributes` line plus records.

**Effect:** every clone and checkout from now on writes `*.md` as LF. The hazard cannot recur for
anyone starting from the repository.

## 2. The gap — DECISION REQUIRED

152 `*.md` files already sitting in this workstation's working tree still carry CRLF. Setting the
attribute does not rewrite files already on disk.

Refreshing them requires one of three commands, and this session was refused all three:

```text
$ git ls-files -z "*.md" | git checkout-index -f -z --stdin   -> requires approval
$ git rm --cached -q -- "*.md"                                -> requires approval
$ git checkout -- "*.md"                                      -> requires approval
```

**This is not the governance deny list rejecting them.** `runner-settings.json` denies only `sudo`,
destructive `docker`, force-push, `git reset --hard`, `git clean -fd`, `rm -rf`, and the SSH key
commands. None matches. The block is the ordinary permission layer: `.claude/settings.local.json`
allowlists `git add`, `git commit`, and `git config` but not `git checkout`, `git rm`, or
`git checkout-index` — and an unattended runner has nobody to approve a prompt.

No substitute was attempted. A PowerShell loop rewriting the 152 files would have achieved the same
effect while defeating the control, which is exactly what Rule 2 prohibits.

**Please choose one:**

| Option | Action | Note |
|---|---|---|
| **A** *(recommended)* | You run the path-scoped refresh yourself | One command, thirty seconds, no permission change |
| **B** | Allowlist a narrowly-scoped refresh for the runner | Widens unattended authority — your call, not mine |
| **C** | Accept the residue | Correct on every fresh clone; stale only on this workstation |

Option A's command, path-scoped so it cannot touch anything else:

```bash
git ls-files -z "*.md" | git checkout-index -f -z --stdin
git ls-files --eol "*.md" | grep -c "w/crlf"    # expect 0
```

**Do not** use the usual recipe `git rm --cached -r . && git reset --hard`. It is unscoped, and at
the moment this task started it would have destroyed 120 lines of uncommitted `supervisor.ps1` work
(see §3). Any refresh must be scoped to `*.md`.

## 3. Two record defects found while executing

**(a) A concurrent actor committed to this repository mid-task.** At startup, `supervisor.ps1` was
modified and uncommitted (+120/−2) with no repository record describing it — the very code path that
started this session, load-bearing and unrecorded. During execution it was committed and pushed by
someone else:

```text
aaf0d34  fix(supervisor): capture runner output and make the start path actually work
         Wed Aug 19 23:59:23 2026 +0300
```

HEAD and `origin/main` both moved under a running supervisor session. No overlap with TASK-0003, so
no harm here. But `runner.lock` names exactly one runner, and it did not — could not — know about a
second writer. **The lock protects against two supervisors; it does not protect against a human or a
manually-started session working in the same tree.** Worth a decision on whether that is acceptable
or whether the supervisor should detect a HEAD move mid-run and abort.

**(b) TASK-0003 never had a task specification.** MSG-0027 directs the executor to follow "the task's
existing prerequisites, allowed/forbidden actions, verification, documentation, checkpoint, and
recovery requirements". `CLAUDE-TASKS.md` carries only a status-board row for TASK-0003 — verified
against the current file and against `4d9f736`, where the row is likewise the only occurrence. No
detail section has ever existed.

Work proceeded because scope was still unambiguous — MSG-0027 says "line-ending normalization only …
as specified by DISC-0006", and DISC-0006 names the exact change. The gap is recorded rather than
filled: writing the missing specification would have meant authoring my own authorization.

Every other task in the queue is in the same shape. If MSG-0027's phrasing reflects an expectation
that per-task detail sections exist, they do not, and future authorizations that lean on them will
find nothing to lean on.

## 4. Supervisor start path — now proven

MSG-0026 recorded the supervisor as enabled with its start path "unproven until a task is READY".
A task became READY and it started this session correctly: lock acquired naming TASK-0003, runner
launched, startup checklist run, queue read, authorized task executed, boundary respected.

The finding from this first live run is §2: **in `acceptEdits` with no approver present, an
unattended runner can only execute Bash commands already on the allowlist.** Read-only git worked
throughout; `git add`, `git commit`, and `git config` are allowlisted; anything else stops dead. That
is a sound fail-closed posture and it behaved correctly — but it means the allowlist, not the deny
list, sets the ceiling on what unattended work can finish.

### 4a. THIS MESSAGE COULD NOT BE PUSHED — read this first

`git push` is not on the allowlist either:

```text
$ git push origin main
This command requires approval

$ git status -sb
## main...origin/main [ahead 1]
```

TASK-0003's commit `93d7067` — including this message — **exists locally only**. If you are reading
this on GitHub, someone has since run `git push origin main` and the fault is cleared. If you are
reading it on the workstation, it has not reached you through the channel at all.

`git push --force` and `-f` are correctly denied by `runner-settings.json`. Plain `git push` is not
denied; it is simply un-allowlisted. The consequence is structural and worth deciding on
deliberately:

**An unattended supervisor session can complete authorized work, document it correctly, commit it —
and then be unable to deliver any of it.** Every record it wrote is invisible to you until a human
notices. The supervisor reports a runner exit code; it has no notion of "the work never left the
machine". Silence from the channel is indistinguishable from no work having been done, which is the
same failure shape the supervisor's own design notes warn about for missed webhooks.

Suggested fix, if you want unattended sessions to be able to report at all: allowlist exactly
`Bash(git push origin main)` — not `git push:*`, which would readmit the refspec games the force-push
denial exists to prevent. That is a widening of unattended authority and therefore your decision, not
mine, which is why it is proposed here rather than applied.

## Decision required

1. Choose **A**, **B**, or **C** for the working-tree refresh (§2).
2. Rule on §3(a) — whether a mid-run HEAD move should abort a supervisor session.
3. Rule on §4a — whether an unattended runner may push, and if so under exactly what pattern.
   **Until this is settled, no supervisor-started session can deliver its own record.** This one
   could not deliver the message you are reading.

§3(b) needs no decision unless you intend task detail sections to exist.

Nothing further is authorized. No other task is READY, and execution stops here.
