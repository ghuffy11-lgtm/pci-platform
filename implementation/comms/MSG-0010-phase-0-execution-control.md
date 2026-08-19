# MSG-0010 — Phase 0: Autonomous Execution, Task Roadmap, and Recovery

**Status:** OPEN — system built; awaiting authorization of TASK-0004 and TASK-0005
**Raised:** 2026-08-19
**Raised by:** Claude Code (implementation agent)
**Type:** Record — Phase 0 implementation
**Directive:** architecture lead, "PHASE 0 — AUTONOMOUS EXECUTION, TASK ROADMAP & RECOVERY"
**Related:** MSG-0007, MSG-0009 (rule hardening), DISC-0007, DISC-0008

## What was built

A permanent execution-control system, so that authorized work flows without a human clicking "next",
and so that any interruption is recoverable from the repository alone.

No WP-0001 implementation work was executed. The PCI server was not modified.

| Artifact | Contents |
|---|---|
| `implementation/operations/ROADMAP.md` | **New.** A→Z roadmap from the verified post-bootstrap state to genuine WP-0001 completion: where we actually are, what stands between here and done, the execution sequence with its dependency graph, five verification gates, architecture boundaries, operator boundaries, the `/data` boundary, ten completion criteria, and an explicit list of what is deliberately *not* in scope. |
| `implementation/operations/CLAUDE-TASKS.md` | **Rewritten.** Status board, communication ledger, interruption/recovery protocol, continuation rule, stop boundaries, and nine tasks each carrying ID, priority, status, objective, prerequisites, dependencies, allowed actions, forbidden actions, verification requirements, documentation requirements, checkpoint requirements, stop conditions, recovery procedure, and next eligible task. |
| `implementation/operations/checkpoints/README.md` | **New.** Checkpoint format and the resumption rules, with the required fields. |
| `CLAUDE.md` | Four permanent sections added: **Continuation**, **Stop Boundaries**, **Checkpointing and Recovery**, and a COMMS continuation rule. |
| `implementation/status/current.md` | References the roadmap, queue, and checkpoint system; carries the status board and the current task. |

## The task sequence

Derived **only** from accepted architecture, the active work package, recorded communications,
blockers, discoveries, and the actual verified state. No future architecture is invented.

```text
TASK-0001 COMPLETE  ──┬──► TASK-0004 (DISC-0007 role provisioning)  ──┐
                      └──► TASK-0005 (DISC-0008 compose identity)  ──┤
                                                                     ▼
                                                    TASK-0006 clean-room (destructive)
                                                                     ▼
                                                    TASK-0007 full re-verification
                                                                     ▼
                                                    TASK-0008 report reconciliation
                                                                     ▼
                                                    TASK-0009 completion decision [lead]
```

The sequence begins from the already-verified state, as directed: `/data/pci-platform` exists, the
repository is cloned there, the bootstrap has been executed successfully, and Docker state is under
`/data/docker`. None of that is re-done.

## Why nothing is READY

**Every remaining path needs an architecture-lead decision.** This is a genuine stop boundary, not an
omission in the queue:

| Task | What is needed |
|---|---|
| TASK-0004 | Authorization to fix DISC-0007. Note that *verifying* the fix additionally requires the destructive volume re-initialisation under TASK-0006 — the fix can be written without it, but cannot be proven. |
| TASK-0005 | A decision on how a development principal is supplied without committing a token — the options are in DISC-0008. Then authorization. |
| TASK-0006 | Explicit authorization to destroy the PostgreSQL volume (Rule 9). |
| TASK-0003 | Authorization for repository-wide `*.md` renormalisation. |
| TASK-0009 | The completion decision itself. |

The continuation rule now in `CLAUDE.md` means that once TASK-0004 and TASK-0005 are marked READY,
Claude Code will run them, then TASK-0006 if its destructive authorization is granted, then TASK-0007
and TASK-0008 — without stopping to ask between them, documenting and pushing throughout, and halting
only at a stop boundary or at TASK-0009.

## The recovery rule that matters most

The protocol's substance is one instruction, and it is stated in `CLAUDE.md`, the queue, and the
checkpoint README:

> **NEVER repeat an operation merely because the checkpoint says it was incomplete.**

A checkpoint records what was known *before* an interruption. The system may have moved on. Blindly
re-running a migration, a volume creation, or a credential rotation on that basis can destroy data —
the failure mode is not that work is lost but that work is silently redone against a changed world.

So a resuming session observes the real system first, compares it against the record, and resumes
from the first operation whose completion is not verified by observation. If documented and actual
state disagree, it **stops** — a disagreement means something happened outside the record, which
matters more than finishing the task.

Checkpoints are written *after* an operation is verified, never in anticipation of one. A checkpoint
recording intent is worse than no checkpoint, because it invites a resuming session to believe
something happened.

## Judgement calls, stated for review

1. **TASK-0006 is BLOCKED rather than WAITING_FOR_ARCHITECTURE_LEAD**, because it has unmet task
   dependencies *as well as* needing authorization. Its board row names both.
2. **The gates are observations, not intentions.** Gate G3 fails if the clean-room rebuild needs any
   manual surgery — the task explicitly forbids papering over that, since manual surgery is exactly
   what is being tested.
3. **TASK-0009 belongs to the lead.** Claude Code does not self-certify completion, so the terminal
   task in the roadmap is a decision, not a piece of work.
4. **DISC-0008's option 3 is recorded as not recommended** in both the discovery and TASK-0005's
   forbidden actions: defaulting the kernel to a no-principal mode would convert a fail-closed
   security control into a convenience.

## Decision required

1. Mark **TASK-0004** READY, or say what to change first.
2. Choose the credential approach for **TASK-0005** (DISC-0008 options 1, 2, or another), then mark
   it READY.
3. Grant or withhold the destructive-operation authorization for **TASK-0006**.
4. Optionally authorize **TASK-0003**.

Once any of these is recorded, `COMMS` or `GO` will pick it up and run the authorized chain.
