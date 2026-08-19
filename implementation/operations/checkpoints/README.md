# Task Checkpoints

Resumable state for tasks in `../CLAUDE-TASKS.md`. One file per task:
`TASK-XXXX.md`.

A task with status **IN_PROGRESS** must have a checkpoint here, committed and pushed. A checkpoint is
written **after** an operation is verified — never in anticipation of one, because a checkpoint that
records intent is worse than none: it invites a resuming session to believe something happened.

Checkpoints are retained after completion, as the record of how a task actually proceeded.

## Required fields

```markdown
# CHECKPOINT — TASK-XXXX

**Checkpoint:** <n>                     <!-- monotonic within the task -->
**Written:** <date>
**Task status:** IN_PROGRESS | COMPLETE | BLOCKED | ...
**Resumption safe:** YES | NO — <why>

## Current phase
<which phase of the task, in its own terms>

## Completed operations
1. <operation> — verified by <observation>

## Last verified operation
<the most recent operation confirmed by direct observation, and how>

## Next operation
<the single next thing, precisely>

## Actual external / system state
<what was OBSERVED — containers, volumes, database, filesystem, service health.
 Not what was intended. Quote command output.>

## Git
HEAD: <sha>   origin/main: <sha>   working tree: clean | <files>

## Notes for a resuming session
<anything that would mislead someone who was not there — non-idempotent
 operations, manual steps, ambiguity about what actually ran>
```

## Resuming — the rule that matters most

**Never repeat an operation merely because the checkpoint says it was incomplete.** The checkpoint
records what was known before the interruption; the system may have moved on. Re-running a migration,
a volume creation, a role change, or a credential rotation on that basis can destroy data or corrupt
state.

Observe the real system first, compare it against the checkpoint, and resume from the first operation
whose completion is not verified by direct observation. If documented and actual state disagree,
**stop** and reconcile — a disagreement means something happened outside the record, which matters
more than finishing the task.

The full protocol is in `../CLAUDE-TASKS.md` under *Interruption and recovery protocol*.
