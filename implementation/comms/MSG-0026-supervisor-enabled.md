# MSG-0026 — Execution Supervisor ENABLED: Permission Mode Determined and Verified

**Status:** **CLOSED** — the start path is PROVEN: the supervisor launched and ran TASK-0003 on 2026-08-20 (MSG-0029, MSG-0031).
**Raised:** 2026-08-19
**Raised by:** Claude Code (implementation agent)
**Type:** Record — enablement result
**Authority:** MSG-0024 (enablement), MSG-0025 (this question), architecture lead instruction to use
the least-privileged mode and **not** `--dangerously-skip-permissions`

## 1. The exact runner command

```text
C:/Users/Administrator/.local/bin/claude.exe
  -p "<queue-execution prompt, {TASK_ID} substituted by the supervisor>"
  --permission-mode acceptEdits
  --settings D:/Work/pci-platform/implementation/operations/supervisor/runner-settings.json
```

`--dangerously-skip-permissions` is **not** used.

The prompt binds the session to the rules and to one task:

> You were started automatically by the PCI Execution Supervisor to execute `{TASK_ID}`. Follow
> `CLAUDE.md` and `AGENTS.md` exactly. Run the mandatory startup checklist first, then read
> `implementation/operations/CLAUDE-TASKS.md` and execute `{TASK_ID}` **only if it is still READY**
> and its prerequisites are satisfied. Checkpoint before and after any significant or irreversible
> operation, document every result, commit and push before reporting completion. Stop at any stop
> boundary and record why. Do not authorize new work, change task priority or scope, or begin any
> task other than `{TASK_ID}`.

## 2. What it grants — determined by experiment, not by reading

Six modes exist: `plan`, `manual`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`. I ran the
CLI to find out what they actually do in headless (`-p`) mode:

| # | Test | Result |
|---|---|---|
| A | `acceptEdits` + `--allowedTools "Bash(echo:*)"`, run `echo` | ran, exit 0 |
| B | same, run `whoami` — **not** in the allowlist | **ran anyway** |
| C | `manual` + allowlist, run allowed `echo` | ran |
| D | `manual` + allowlist, run `whoami` | **ran anyway** |
| E | `manual` + `--disallowedTools "Bash"`, run `echo` | **BLOCKED** — "No shell/Bash tool is available" |
| F | `acceptEdits` + `--disallowedTools "Bash(docker compose down:*)"` | `echo` ran; `docker compose down -v` **BLOCKED** |
| G | `acceptEdits` + settings-file deny list | `echo` ran; `sudo -n true` **BLOCKED** |

Tests B and D ran from a scratch directory where no project allowlist applied.

**Three findings that matter more than the mode choice:**

1. **Allow-lists are additive, not restrictive.** An absent allow rule did not prevent execution.
2. **`manual` does not gate anything in headless mode.** With no interactive prompt available, the
   command ran rather than being refused. `plan` (read-only) and `manual` therefore cannot serve as
   the control: `plan` cannot do the work, and `manual` does not restrict it.
3. **Deny rules ARE enforced**, at whole-tool and at command-specifier granularity, from either the
   command line or a settings file.

So **the permission mode is not the effective control in unattended mode — the deny list is.**
Choosing `acceptEdits` and calling it "least privilege" without saying this would have been
misleading, which is why the tests are recorded here rather than summarised as "acceptEdits works".

`acceptEdits` is nonetheless the correct choice among the viable modes: it is the least-privileged
mode that can execute unattended, and it is not `bypassPermissions`.

## 3. The deny list — the actual boundary

`implementation/operations/supervisor/runner-settings.json`, **version-controlled on purpose**: these
rules are a governance control and belong under review, not buried in a command line. It contains no
credentials and never may.

```json
"deny": [
  "Bash(sudo:*)",
  "Bash(docker compose down:*)", "Bash(docker volume rm:*)",
  "Bash(docker volume prune:*)", "Bash(docker system prune:*)",
  "Bash(git push --force:*)", "Bash(git push -f:*)",
  "Bash(git reset --hard:*)", "Bash(git clean -fd:*)",
  "Bash(rm -rf:*)",
  "Bash(ssh-keygen:*)", "Bash(ssh-add -D:*)"
]
```

These are not arbitrary. They are `CLAUDE.md` Rule 9's list — force-push, destructive deletion,
credential replacement, privileged operations — turned into something mechanically enforced instead
of merely written down. An unattended session **cannot** destroy the PostgreSQL volume, force-push,
strip a key, or run `sudo`. It has to stop and ask, which is what the governance model requires
anyway; the difference is that now it cannot choose otherwise.

Note the honest limit: this constrains **commands**, not intentions. A session retains ordinary
Bash, so a determined-but-compliant agent could reach similar effects by other means. The deny list
raises the floor and removes the easy accidents; the queue's authorization model still does the real
work.

## 4. Credentials

- `supervisor-config.json` — machine-local, **gitignored**, contains only paths and the prompt.
  Scanned for `token|password|passphrase|secret|Bearer|api[-_]?key`: **clean**.
- `runner-settings.json` — committed, contains only deny rules.
- No credential is written to any project file. The runner inherits the machine's existing
  credentials (SSH agent, git) at runtime, exactly as an interactive session does.

## 5. Fail-closed and schedule — unchanged

Both preserved. The supervisor still does nothing on an unreadable repository, an unreconciled
remote, a missing/unparseable/contradictory queue, an existing or corrupt lock, a lost lock race, or
any unhandled error. The schedule remains **10 minutes**, `IgnoreNew`, `StartWhenAvailable`.

## 6. A defect found and fixed during enablement

`Start-Process -ArgumentList <array>` in PowerShell 5.1 joins arguments with spaces **without
quoting**, so the runner prompt — one argument containing many spaces — would have arrived split
into dozens of separate arguments. The unattended session would have received something other than
what the config said.

Fixed with `ConvertTo-RunnerCommandLine`, which quotes any argument containing whitespace and
escapes embedded quotes. Four tests added; **the suite is now 21 passed, 0 failed**.

This is the same failure shape as DISC-0005, DISC-0006, and DISC-0007: a command that appears to
work while doing something else. It was found by writing the argument-passing test, not by reading
the code.

## 7. Validation and enablement

```text
dry-run  (enabled=false, dryRun=true)  -> NOOP: no READY task, heartbeat written
enabled  (enabled=true,  dryRun=false) -> NOOP: no READY task, no lock created
scheduled task                          -> lastTaskResult 0, next run +10 min
heartbeat head                          -> 3e1098a, matching origin/main
```

**The supervisor is now ENABLED** and reconciling every ten minutes.

## 8. The one thing still unverified

**The start path has never executed**, because no task has been READY at any point since
enablement. What remains unproven live:

- lock creation and release around a real runner start;
- the runner actually launching with the quoted command line;
- the started session obeying the prompt and the queue.

The unit tests cover the lock logic and the quoting; only the end-to-end start is untested. The
first genuinely READY task will exercise it, and I would rather say this plainly than let "enabled
and verified" imply more than was observed.

Recommendation: make the *first* READY task after enablement something small and reversible, and
watch the heartbeat, log, and lock while it runs.

## 9. To reverse

```powershell
# stop unattended execution, keep the schedule and observation
#   set "enabled": false in supervisor-config.json
# remove entirely
powershell -File implementation\operations\supervisor\supervisor.ps1 -Uninstall
```

No unrelated task was created or authorized by this work.
