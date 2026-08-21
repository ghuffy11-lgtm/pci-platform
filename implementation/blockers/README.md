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

**No blocker is open.**

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
