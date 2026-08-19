# MSG-0011 — Execution Supervisor: Decision and Scope

**Status:** **SUPERSEDED** by MSG-0024, which authorized enablement. Current state is in MSG-0025: installed, dry-run verified, not enabled.
**Raised:** 2026-08-19
**Raised by:** Claude Code (implementation agent)
**Type:** Record — infrastructure
**Directive:** architecture lead, "PHASE 0 — EXECUTION SUPERVISOR"
**Task:** TASK-0010 | **Related:** MSG-0010 (Phase 0 execution control)

## Decision recorded

A fail-closed Execution Supervisor was implemented so that authorized queue tasks can run without a
human starting each session, and so that interruptions recover automatically.

It runs on the **Windows development machine only**. It has **no SSH code path** and therefore
cannot reach the PCI server — the separation is structural, not a matter of configuration.

## Scope

### What it does

Every ten minutes: reconcile with `origin/main`, parse `implementation/operations/CLAUDE-TASKS.md`,
find the highest-priority READY task, check the runner lock, and start an authorized Claude runner
only if all conditions hold. Otherwise it does nothing, logs a line, and writes a heartbeat.

### What it deliberately cannot do

| Constraint | How it is enforced |
|---|---|
| Never executes PCI-server commands | No SSH code path exists |
| Never stores credentials, tokens, passphrases, or secrets | The config schema has no field that could hold one |
| Never marks a task COMPLETE | No write path to the queue |
| Never changes authorization or priority | Same |
| Never starts a second concurrent session | Exclusive-create lock; a race loser does nothing |
| Never bypasses `CLAUDE.md`, `AGENTS.md`, stop conditions, or operator boundaries | It starts a session; that session obeys the rules itself |
| Never clears a stale lock automatically | A crashed session may have left partial work |

**The supervisor is a trigger, not an authority.** It changes *when* authorized work starts, never
*what* is allowed. If it could edit the queue, a scheduling bug would become an authorization bug.

## Fail-closed behaviour

Every uncertainty is a no-op: repository unreadable, local and remote diverged, remote unreachable,
queue file missing, queue unparseable, queue contradictory, lock present, lock corrupt, lock race
lost, runner fails to start, or any unhandled exception. There is no path in which ambiguity leads to
starting something.

Three independent settings must all change before anything runs unattended: `enabled` (false),
`dryRun` (true), and `runnerCommand` (empty). Any one of them left alone keeps the supervisor inert.

## Verification

```text
powershell -NoProfile -ExecutionPolicy Bypass -File tests\supervisor.tests.ps1
17 passed, 0 failed
```

Covering exactly the behaviours the directive required: READY detection, no-READY behaviour,
duplicate-run prevention, stale-run handling, GitHub-unavailable behaviour, inconsistent-queue
behaviour, and inert defaults. No Pester dependency; the tests never start a runner, never touch a
git remote, and never contact the PCI server.

Additionally verified read-only against the **real** queue: 9 tasks parsed with correct statuses,
priorities, and dependencies; consistency `True`; READY task **none** — the correct answer for the
current queue, and a useful end-to-end check that the parser understands the document it will
actually read.

## Two things worth the architecture lead's attention

**1. The real privilege boundary is the runner, not the supervisor.** The supervisor itself is
modest: it reads files, runs `git fetch`, and starts one local process. What it starts is a full
Claude Code session with the developer's own credentials, capable of everything a manually started
session can do — including reaching the PCI server, which the supervisor cannot. Enabling this means
consenting to unattended sessions acting on authorized queue tasks. That is why it ships disabled,
and why enabling it is recorded as a decision rather than a configuration detail.

**2. Stale locks are reported, never cleared.** A stale lock usually means a session crashed
mid-operation. Clearing it automatically would start a second session against unknown state — the
exact failure the checkpoint protocol exists to prevent. The supervisor stops and reports; a human
reconciles. This makes a crash produce a *stall*, which is visible, rather than a *double start*,
which is not.

## Not done, deliberately

Per the directive: the scheduled task is **not registered**, the supervisor is **not started**, no
WP-0001 work was executed, the PCI server was not modified, no future task was authorized, and no
architecture beyond the supervisor was invented.

## Decision required

1. Whether to install the scheduled task at all — that is, whether unattended Claude sessions are
   wanted on this machine.
2. If yes: the `runnerCommand` for the authorized Claude runner, and confirmation that `enabled:
   true` with `dryRun: false` is intended.
3. Whether the ten-minute cadence is right, given it is the authoritative recovery mechanism.

Until then the supervisor sits in the repository, tested and inert. Nothing about the current queue
changes: no task is READY, and TASK-0004 and TASK-0005 still await authorization under MSG-0010.
