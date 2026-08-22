# BLK-0009 — Concurrent Session Writing the Working Tree; TASK-0027 Not Started

**Status:** **OPEN**
**Raised:** 2026-08-22, at the start of the supervisor-started TASK-0027 session (`runner.lock` pid 21164, acquired 09:37:18Z)
**Severity:** Hard boundary. Nothing was lost and nothing was executed; the run stopped before its first action
**Related:** MSG-0080 (the A-SURVEY authorization), MSG-0081 (the in-flight reconciliation, uncommitted), BLK-0006 and MSG-0028 §2/§3(a) (the precedent), TASK-0026, TASK-0027

## Summary

The Execution Supervisor started this session to execute **TASK-0027**. It did not execute it.

**TASK-0027 is not READY in the authoritative committed queue**, and a **concurrent actor was actively
writing repository files while this session ran**. Either condition alone is a stop boundary. Both were
present, so the session stopped at its prerequisite check and recorded this instead.

**No file in the working tree was modified by this session** other than the creation of this record.

## VERIFIED — the concurrent writer

`implementation/status/current.md` changed **four times** during this session, sampled with timestamped
`ls` while nothing in this session touched it:

```text
2026-08-22 12:37:56.773  153628 bytes
2026-08-22 12:38:26.229  154187 bytes
2026-08-22 12:38:56.263  152892 bytes
2026-08-22 12:39:51.548  156152 bytes
```

The size moves both up and down — this is a file being edited, not appended to by a log writer. This
session acquired its lock at 09:37:18Z (12:37:18 local), so **every one of those writes landed after
this run began**.

`implementation/comms/MSG-0081-task-0027-queue-reconciliation.md` was created at **12:37:23**, also
after the lock was acquired, and is **untracked**.

## VERIFIED — TASK-0027 is not READY in the committed queue

```text
$ git show HEAD:implementation/operations/CLAUDE-TASKS.md | grep -c "TASK-0027"
0

$ git rev-parse HEAD
6348435461896834a91af271b0b0060495cf4f63

$ git rev-parse origin/main
6348435461896834a91af271b0b0060495cf4f63
```

`HEAD` and `origin/main` agree, and **neither contains any mention of TASK-0027.** The `READY` marking
for TASK-0027 exists only in the *uncommitted working copy* of `CLAUDE-TASKS.md` — one of the files the
concurrent actor is editing.

`HEAD` did **not** move during this session. This is the mirror image of BLK-0006: there, the published
history moved under a session; here, the published history stood still and the **working tree** moved.
The hazard is the same one `CLAUDE.md` *Mid-run repository movement* exists to catch — a session that
began against one repository state and finishes against another produces evidence about neither.

## VERIFIED — the working tree state observed

```text
$ git status --porcelain
 M implementation/blockers/BLK-0008-designated-corpus-unreachable.md
 M implementation/blockers/README.md
 M implementation/comms/MSG-0077-task-0026-queue-reconciliation.md
 M implementation/comms/MSG-0078-task-0026-execution-record.md
 M implementation/comms/MSG-0079-corpus-designation-verified-unreachable.md
 M implementation/comms/README.md
 M implementation/operations/CLAUDE-TASKS.md
 M implementation/status/current.md
?? implementation/comms/MSG-0081-task-0027-queue-reconciliation.md
```

**INFERRED, and labelled as inference:** these eight modifications plus MSG-0081 are a single coherent
body of work — the TASK-0027 queue reconciliation MSG-0080 requires, together with the closure of
BLK-0008 and of MSG-0077/0078/0079 that the corpus delivery discharges. They are consistent with each
other and with MSG-0080. **They are simply not committed yet**, and one of them was still being written
minutes ago.

## Why MSG-0080's own gate is unmet

MSG-0080 is explicit on both counts:

- Acceptance criterion **6**: *"COMMS and the task queue are reconciled consistently **before
  execution**."* The reconciliation is in flight and uncommitted. It is not reconciled; it is being
  reconciled.
- Closing line: *"Claude may execute this bounded follow-up **only after reconciling it as the single
  READY task**."* In the authoritative committed queue, TASK-0027 does not appear at all.

Acceptance criterion **4** — *"the corpus remains outside the repository and `git status` remains
clean"* — also **could not be satisfied by this session even on success.** The tree is dirty with
another actor's work, so a clean `git status` was not available as evidence, and reporting one would
have been false.

`CLAUDE.md` settles the reading: *"A task's prerequisites are checked before its actions begin, not
assumed from the queue. A task marked READY whose prerequisite is unmet stops at that prerequisite and
records why — READY means authorized to attempt, never authorized to force."*

## What was NOT done, and why

- **TASK-0027 was not executed.** No survey was performed and **no survey figures of any kind exist in
  this record** — not as estimates, not as illustrations. The same restraint TASK-0026 exercised at PR5
  applies here for a different reason: the task never became executable.
- **The corpus PDF was not read, opened, copied, or inspected.** Its existence at
  `D:\Work\pci-corpus\plan.pdf` is **UNKNOWN to this session** — a read of that directory was requested
  and the permission was not granted, and it was **not routed around**. Nothing here should be read as
  evidence that the corpus is or is not present.
- **`git add -A` was not run, and must not be run in this state.** It would sweep the concurrent
  session's partial, mid-edit files into history under this session's authorship. This is not
  hypothetical: `CLAUDE-TASKS.md` itself records that the corpus PDF was once sitting untracked inside
  the working tree where *"the next `git add -A` would have committed 627 KB of corpus into history"*.
  A blind `-A` during concurrent edits is that same failure mode with a different payload.
- **No `git pull`, `fetch`, `merge`, `rebase`, `reset`, `stash`, `checkout`, or force-push was
  attempted.** Nothing was reverted and no other actor's work was touched.
- **Only this file was committed**, staged by explicit path rather than by `-A`.

## Impact

**Low, and bounded.** No work was lost, no history was rewritten, and no incorrect claim was published.
TASK-0027 remains unstarted and fully executable once the tree settles. The cost of this stop is one
supervisor cycle.

## What is needed to clear this

The concurrent session must finish and **commit and push its reconciliation**. Then, cheapest first:

1. **Let the in-flight session complete its own commit.** If it is an interactive session mid-task, it
   owns that work and should land it. Nothing here needs redoing.
2. **Once pushed, TASK-0027 needs no re-authorization** — MSG-0080 already authorizes it and remains
   AUTHORIZED. The next supervisor cycle will start it normally, provided the committed
   `CLAUDE-TASKS.md` carries TASK-0027 as the single READY task.
3. **Before that run begins**, `git status` should be clean, so MSG-0080 criterion 4 is satisfiable as
   written.

**No option requires a decision from the Architecture Lead, and none was taken by this session.**
Committing or discarding another actor's uncommitted work is not a choice an unattended session is
entitled to make.

## Note for a resuming session

**Do not assume this is still open, and do not re-run the checks from this record's conclusions.**
Verify directly:

- `git status --porcelain` — is the tree clean now?
- `git show HEAD:implementation/operations/CLAUDE-TASKS.md | grep -c "TASK-0027"` — is it **non-zero**?
  That, not this file, is the test of whether TASK-0027 is genuinely READY.
- Check file mtimes against the current time before assuming no one else is writing.

`CLAUDE.md` *Checkpointing and Recovery* rule (f) applies with full force here: **never repeat an
operation merely because a record says it was incomplete.** If the reconciliation has since landed,
re-creating it would duplicate MSG-0081 and re-open records that were correctly closed.
