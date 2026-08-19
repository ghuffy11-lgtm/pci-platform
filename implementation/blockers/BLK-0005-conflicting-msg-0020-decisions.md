# BLK-0005 — Two Contradictory MSG-0020 Decisions

**Status:** **RESOLVED / CLOSED** — 2026-08-19 by MSG-0022 and MSG-0023. The COMPLETE decision stands; TASK-0012 is not authorized and must not be created.
**Severity:** High — blocks TASK-0009 and the WP-0001 completion state
**Raised:** 2026-08-19
**Work package:** WP-0001 — PCI Kernel Foundation
**Related:** TASK-0009, TASK-0012 (proposed by one of the two), DISC-0009

## Issue

`implementation/comms/` contains **two files both numbered MSG-0020**, both from the architecture
lead, both marked `DECIDED`, reaching **opposite conclusions** on the same question.

| File | Commit | Committed | Decision |
|---|---|---|---|
| `MSG-0020-wp-0001-completion-decision.md` | `afce3ff` | 2026-08-19 22:03:04 +0300 | **WP-0001 is NOT COMPLETE.** DISC-0009 *is* a real violation of the `/data` boundary. Authorizes **TASK-0012** to relocate Docker CLI state under `/data`. |
| `MSG-0020-wp0001-completion-decision.md` | `7ff123f` | 2026-08-19 22:08:31 +0300 | **WP-0001 is COMPLETE.** DISC-0009 is account-level tool state, *not* a PCI project artifact, and does **not** block completion. "No new remediation task is authorized." |

The filenames differ only by a hyphen: `wp-0001` versus `wp0001`.

## Why this cannot be resolved by inference

The later commit is five minutes after the earlier one, which suggests it may be intended to
supersede it. **That is a guess, and the cost of guessing wrong is high in both directions:**

- Acting on the **COMPLETE** message means declaring WP-0001 complete — the one thing `CLAUDE.md`'s
  Completion Rule reserves to the architecture lead, on the strength of an inference rather than a
  clear record.
- Acting on the **NOT COMPLETE** message means executing TASK-0012, which the other message says is
  explicitly not authorized.

Neither file references the other. Neither says "supersedes MSG-0020". Neither carries a revision
marker. Neither commit touched the queue or the status file, so the repository's own state does not
disambiguate them either.

They also disagree on a **substantive architectural point**, not merely on a status: whether the
v0.2 boundary's `~/.ssh` exception extends to account-level tool state such as `~/.docker`. That is
a rule about what may exist on the host, and it will govern every future session. It should be
settled deliberately, not inherited from whichever file happened to be committed second.

`CLAUDE.md` Rule 6 and the Stop Boundaries section both name "documentation conflicts with
documentation" as a stop condition. This is that case, in its clearest form.

## What has NOT been done

- WP-0001 has **not** been marked complete.
- TASK-0009 has **not** been resolved.
- TASK-0012 has **not** been created or executed.
- The queue board, status file, and report are **unchanged** with respect to completion — they still
  show TASK-0009 as `WAITING_FOR_ARCHITECTURE_LEAD`, which remains accurate under either reading.
- No file was deleted, renamed, or edited to make the conflict disappear.

The verified state from TASK-0007 and TASK-0008 is untouched and is not in dispute: 229 tests
passing, clean-room reproducibility proven, ADR-0016 obligations proven live, records reconciled.
**Both messages accept that evidence.** The disagreement is solely about DISC-0009's status and what
follows from it.

## Resolution required

The architecture lead should state **which MSG-0020 stands**, ideally by:

1. marking the superseded file `SUPERSEDED` in its own header, so both remain readable and the
   history of the decision survives; and
2. renumbering the surviving decision, or confirming that MSG-0020 refers to it alone.

Then, whichever way it goes:

- **If COMPLETE stands:** record the completion in the queue, status, and report; leave DISC-0009
  open as an accepted-and-tolerated finding with the reasoning that account tool state is out of
  scope for the boundary.
- **If NOT COMPLETE stands:** create TASK-0012 as specified, execute it, re-verify the boundary, and
  return to TASK-0009.

Claude Code will act on whichever is designated and will not proceed until then.

## Note for a resuming session

Do not resolve this by taking the newer file. The timestamps are five minutes apart and there is no
recorded supersession; a future session cannot distinguish "the lead changed their mind" from "two
drafts were committed by accident". Ask.

---

## RESOLVED — 2026-08-19

The architecture lead resolved the conflict explicitly, exactly as asked, in **MSG-0022** and
**MSG-0023**:

- **The COMPLETE decision stands.** WP-0001 is COMPLETE.
- The duplicate that declared NOT COMPLETE and authorized TASK-0012 was created in error. Both
  MSG-0020 files are now marked `SUPERSEDED` in their own headers and retained for history.
- **TASK-0012 is not authorized** and must not be created, executed, or referenced as a required
  follow-up.
- DISC-0009 does not block completion: `/home/claude/.docker/buildx/*` is Docker CLI account-level
  tool state, not a PCI project artifact. The named `~/.ssh` exception is unchanged, and the v0.2
  boundary is not a blanket prohibition on all account-level tool state.
- Any future change to Docker client state placement needs its own architecture decision and task.

The boundary question this blocker flagged as outlasting the work package now has a recorded
answer, which was the point of asking rather than guessing.
