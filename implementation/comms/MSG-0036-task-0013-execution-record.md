# MSG-0036 — TASK-0013 execution record: the MSG-0035 decisions are applied

**Status:** RECORD — both decisions applied and verified; **one finding requests a ruling (§6)**
**Raised:** 2026-08-20
**Raised by:** Claude Code (session started automatically by the Execution Supervisor)
**Type:** Record — execution evidence
**Authority:** MSG-0035 (DECIDED) | **Related:** TASK-0013, MSG-0032 §6.2/§6.3, TASK-0011

## 1. What was authorized, and what was done

MSG-0035 decided the two findings TASK-0011 had raised and deliberately left unactioned. TASK-0013
applied both. Nothing else was changed.

| MSG-0035 | Decision | Applied |
|---|---|---|
| Decision 1 | BLK-0001 and BLK-0004 confirmed RESOLVED; the index may be corrected | `implementation/blockers/README.md` — both rows now **RESOLVED 2026-08-19**, with the resolution date and evidence reference |
| Decision 2 | Add a numbering-allocation convention | `implementation/comms/README.md` — new *Message numbering — allocation convention* section, plus an operative bullet in *Protocol* |

## 2. Decision 1 — the blocker index

The index had shown BLK-0001 and BLK-0004 **OPEN** since 2026-08-19, while both blocker files
themselves carried `**RESOLVED / CLOSED** — 2026-08-19`. Only the index was stale; the underlying
records were correct and always had been.

Verified before editing, by reading the blocker records rather than trusting `current.md`:

- `BLK-0001-no-execution-environment.md` — "**Status: RESOLVED / CLOSED.** The execution environment
  exists and has been used", with the four gated acceptance criteria moved PARTIAL/NOT MET → **MET**.
- `BLK-0004-host-privilege-unavailable.md` — "**Status: RESOLVED / CLOSED.**", closing on its own
  stated condition, checked directly on the host:

  ```text
  $ docker info --format '{{.DockerRootDir}}'
  /data/docker
  ```

Only those two rows changed. BLK-0002 and BLK-0003 were already RESOLVED and were not touched.

**Why this was worth a task of its own.** The rule at the top of the blocker index says an acceptance
criterion covered by an open blocker must never be reported as met. As literally recorded, the
repository therefore claimed WP-0001 complete while its own index showed two High blockers gating
four of its acceptance criteria. Nothing was wrong with WP-0001 — but a new session reading the index
first had no way to know that. The index is now consistent with the records and with
`implementation/status/current.md`.

## 3. Decision 2 — numbering, and the collision it nearly caused

The convention now recorded requires: allocate from the register before creating a message; re-verify
uniqueness immediately before commit; **on collision, stop and report** rather than creating another
duplicate or silently taking the next number. MSG-0020 (a)/(b) and MSG-0033 (a)/(b) are explicitly
**not** renumbered.

**The rule was tested by its own adoption, and the naive form of it would have failed.**

MSG-0035 exists on disk. It has no row in the COMMS register. 37 `MSG-*.md` files are present; the
register carried 36 rows; the missing one was MSG-0035 itself — the message authorizing this task.

Allocating "the next number after the highest row in the register" would therefore have produced
**MSG-0035** — a third duplicate-numbered message, created in the act of adding the rule against
duplicates.

What caught it was listing the directory and grepping the repository, not reading the register:

```text
$ ls implementation/comms/ | grep -c "^MSG-"
37                                          <- files on disk

$ grep -c "MSG-0035" implementation/comms/README.md
0                                           <- no row in the register

$ grep -r "MSG-0036" .                      <- candidate number
(no match)                                  <- free, repository-wide
```

So the convention as written says: register **and** directory listing **and** repository grep. A
missing row is a record defect, never evidence that a number is free. The charter already stated this
(`implementation/PROJECT-CHARTER.md` §5); this is the first time it has been exercised.

The missing MSG-0035 row was added, as the reconciliation the charter §5 directs, alongside the
MSG-0036 row.

## 4. Number allocation for this message — the procedure, run

| Step | Check | Result |
|---|---|---|
| 1 | Highest number in the register | MSG-0034 |
| 2 | Highest number in the `CLAUDE-TASKS.md` ledger | MSG-0035 — **the two indexes disagreed** |
| 3 | Directory listing | `MSG-0035-architecture-decisions.md` present |
| 4 | Candidate allocated | **MSG-0036** |
| 5 | `grep -r "MSG-0036"` before writing | no match |
| 6 | Re-verified immediately before commit | no match — see §5 |

Step 2 is the one that mattered. Two indexes existed, they disagreed, and only the union of them was
correct.

## 5. Verification

| Requirement | Evidence |
|---|---|
| BLK-0001 RESOLVED in the index | `blockers/README.md` row 1 |
| BLK-0004 RESOLVED in the index | `blockers/README.md` row 4 |
| No other blocker status changed | BLK-0002, BLK-0003 rows byte-identical; BLK-0005 deliberately untouched, see §6 |
| Numbering rule present | `comms/README.md` §*Message numbering — allocation convention* + *Protocol* bullet |
| MSG-0020 / MSG-0033 not renumbered | both dual-numbered rows unchanged; the rule states the exemption explicitly |
| New record unique | §4 steps 5 and 6 |
| Register updated in the same commit | MSG-0036 and the reconciling MSG-0035 rows |
| TASK-0013 COMPLETE | `CLAUDE-TASKS.md` status board |
| Commit identified | see §7 |

Starting `HEAD` was `fb7abfe`, recorded in checkpoint 1 and re-checked immediately before the commit
per the mid-run-movement abort rule (MSG-0028 decision 2). It had not moved.

## 6. One finding — a ruling is requested

**`BLK-0005` has no row in the blocker index.** `BLK-0005-conflicting-msg-0020-decisions.md` exists
and is closed (MSG-0022 / MSG-0023 ruled that the COMPLETE decision stands), but the index lists only
BLK-0001 through BLK-0004.

TASK-0013's scope is explicit: *"No changes to any blocker other than BLK-0001 and BLK-0004."* Adding
a fifth row is a change to another blocker's representation, so it was **not** made. It is reported
here instead, and noted in the index itself so a reader is not misled by the omission.

This is the same shape as the finding TASK-0011 raised in MSG-0032 §6.2 — the blocker index drifting
from the blocker records — which suggests the index, not any individual blocker, is the record that
goes stale. **Authorization is requested** to add the BLK-0005 row.

A related observation, not a request: `implementation/discoveries/README.md` lists three discoveries
while nine `DISC-*.md` files exist. Same failure mode, third index. Recorded here for the lead's
awareness only; TASK-0013 did not touch it and is not asking to.

## 7. Commit

The work is delivered in a single commit on `main`, pushed by this unattended session using the
`git push origin main` capability authorized in MSG-0028.

| Item | Value |
|---|---|
| Parent (starting HEAD) | `fb7abfe` |
| Commit | recorded in checkpoint 2, `implementation/operations/checkpoints/TASK-0013.md` |
| Push | `git push origin main`, output quoted in checkpoint 2 |

The commit SHA is recorded in the checkpoint rather than back-filled into this file, because a message
cannot contain the hash of the commit that creates it. Checkpoint 2 is written after the push and
carries the real value.

## 8. Scope compliance

Nothing outside the two MSG-0035 decisions was changed. No product or code change; no Supervisor
permission, scheduling, deny-rule, or runner-configuration change; no new task authorized and no
priority changed; no blocker other than BLK-0001 and BLK-0004 altered; no historical renumbering; no
credential access, privilege escalation, destructive command, repository reset or clean, and no force
push.

`implementation/status/current.md` and `implementation/operations/CLAUDE-TASKS.md` were updated to
record the result. That is not scope expansion — both are required by `CLAUDE.md` Rule 12 and the
task's own instruction to mark TASK-0013 COMPLETE, and leaving them asserting *"no task is READY"*
and *"two findings await a ruling"* would have reintroduced exactly the staleness this task existed
to clear.

## 9. State after this task

Every task is COMPLETE except TASK-0002 (ABORTED, premise disproven by measurement). No blocker is
open. No message is OPEN except MSG-0034, which is informational. The Supervisor returns to its
ten-minute cadence and will report `NOOP :: no READY task` until the architecture lead authorizes
more work.

Awaiting the lead: the §6 ruling on BLK-0005, and whatever comes next.
