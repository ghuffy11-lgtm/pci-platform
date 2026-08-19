# MSG-0021 — Which MSG-0020 Stands? Two Contradictory Completion Decisions

**Status:** **CLOSED** — 2026-08-19 by MSG-0022 and MSG-0023. The COMPLETE decision stands; both MSG-0020 records are SUPERSEDED and retained.
**Raised:** 2026-08-19
**Raised by:** Claude Code (implementation agent)
**Type:** Question — decision required
**Blocker:** BLK-0005
**Related:** TASK-0009, DISC-0009, MSG-0019

## The conflict

Two files in `implementation/comms/` are both numbered **MSG-0020**, both from the architecture
lead, both `DECIDED`, and they decide the opposite thing:

| File | Commit | Time | Says |
|---|---|---|---|
| `MSG-0020-wp-0001-completion-decision.md` | `afce3ff` | 22:03:04 | **WP-0001 NOT COMPLETE.** DISC-0009 is a real `/data` boundary violation. Authorizes **TASK-0012** to relocate Docker CLI state, then return to TASK-0009. |
| `MSG-0020-wp0001-completion-decision.md` | `7ff123f` | 22:08:31 | **WP-0001 COMPLETE.** DISC-0009 is account-level tool state, not a project artifact; does not block completion. **"No new remediation task is authorized."** |

Filenames differ by one hyphen. Neither references the other. Neither is marked superseded.

## What I have not done, and why

I have not picked one, and I have not touched the completion state in any record.

The later timestamp suggests the second may supersede the first. **But five minutes apart with no
recorded supersession is equally consistent with two drafts landing by accident**, and the two
outcomes are not symmetric in cost:

- Taking **COMPLETE** means declaring WP-0001 complete on an inference. The Completion Rule reserves
  that declaration to you precisely so it never rests on a guess.
- Taking **NOT COMPLETE** means executing TASK-0012, which the other message explicitly refuses to
  authorize — self-authorizing work is the thing the queue exists to prevent.

Either way I would be deciding something that is yours, using commit ordering as the tiebreaker.

## The part that outlasts this work package

The two messages disagree on more than a status. They disagree on **whether the v0.2 boundary's
`~/.ssh` exception extends to account-level tool state like `~/.docker`.**

That is a standing rule about what may exist on the host. It governs every future session, every
future work package, and the boundary check that now runs as part of routine verification. Whichever
way it is settled, it should be settled deliberately — not inherited from whichever file happened to
be committed second.

For what it is worth, I raised DISC-0009 recommending the stricter reading (`DOCKER_CONFIG` under
`/data`) on the grounds that "nothing of ours outside `/data`, full stop" is far easier to verify
than a list of tolerated exceptions. The COMPLETE message's reasoning — that Docker CLI state is
account tool state rather than a PCI artifact — is also entirely defensible. I am not arguing for
either; I am pointing out that this is a rule change either way and deserves to be recorded as one.

## What is not in dispute

Both messages accept the TASK-0007 and TASK-0008 evidence, and neither casts doubt on it:

- 229 tests passing across all three tiers, every count non-zero;
- clean-room reproducibility proven (gate G3);
- ADR-0016 obligations proven live;
- records reconciled (gate G5).

The verified state is intact and unaffected by this conflict.

## Decision required

1. **Which MSG-0020 stands?** Ideally mark the other `SUPERSEDED` in its own header rather than
   deleting it, so the history of the decision survives, and confirm whether MSG-0020 now refers to
   the surviving file alone.

2. **The boundary ruling** — does the `~/.ssh` exception cover account-level tool state such as
   `~/.docker`? Please record it as a rule, wherever it lands, so the next session inherits an
   answer instead of this question.

Then:

- **COMPLETE stands** → I record the completion in queue, status, and report, close DISC-0009 as
  accepted-and-tolerated with the reasoning, and stop.
- **NOT COMPLETE stands** → I create TASK-0012, execute it, re-verify the boundary, and return to
  TASK-0009.

Nothing proceeds until one of these is designated.

---

## ANSWERED — 2026-08-19

Both questions were answered explicitly.

1. **Which MSG-0020 stands** — the COMPLETE one. The duplicate was created in error, both files are
   marked `SUPERSEDED` in their own headers and retained for history, and MSG-0022 is the
   authoritative resolution with MSG-0023 correcting the execution path. TASK-0012 is not authorized
   and was never created.

2. **The boundary ruling** — `/home/claude/.docker/buildx/*` is Docker CLI account-level tool state,
   not a PCI project artifact. The v0.2 boundary forbids PCI project artifacts outside `/data`; it
   does not prohibit all account-level tool state. The named `~/.ssh` exception is unchanged. Future
   changes to Docker client state placement require a separate architecture decision.

This message is CLOSED. BLK-0005 is resolved.
