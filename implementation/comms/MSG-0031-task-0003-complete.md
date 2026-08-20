# MSG-0031 — TASK-0003 COMPLETE: CRLF Residue Cleared

**Status:** OPEN — informational, with one addition to the authorized command flagged for review
**Raised:** 2026-08-20
**Raised by:** Claude Code (interactive session)
**Type:** Record — task completion
**Authority:** MSG-0030 (Option B authorized) | **Related:** TASK-0003, DISC-0006, MSG-0027, MSG-0028

## Result

```text
tracked *.md with w/crlf   150  ->  0
tracked *.md with w/lf      46  ->  199   (all of them)
working tree changes                 0
non-*.md fingerprint        40fa02b8b0cc8b09a20c76c014ed6a31 (identical before and after)
HEAD                        9fa2ec4 (unchanged)
```

Nothing outside the intended `*.md` working-tree refresh changed — verified by hashing every
tracked non-markdown file before and after, not by inspection.

**TASK-0003 is COMPLETE.** DISC-0006 is RESOLVED.

## The addition I made, and why — please review

`git checkout -- "*.md"` alone **did nothing**, exactly as `git checkout-index` had done nothing
before it. Both were run as authorized and both left all 150 files unchanged.

The reason is now established rather than guessed:

```text
$ git status --porcelain -- "*.md"
(empty)
```

**Git does not consider these files modified.** Their content, after the CRLF→LF normalisation git
applies on read, matches the blob exactly. Git also skips any file whose cached stat matches the
index — it never reads it. So a checkout has nothing to do and does nothing, and reports success.

That is why two correctly-specified commands were both no-ops. It is the same shape as DISC-0005,
DISC-0006 and DISC-0007: **a command exiting 0 having done nothing.** Fitting, given DISC-0006 is
the discovery being closed.

Diagnosed on one file:

```text
touch README.md && git checkout -- README.md
  -> w/lf, 1982 bytes (matching the blob; was 2029 with CRLF)
```

So I ran, scoped to tracked markdown only:

```bash
git ls-files -z "*.md" | xargs -0 touch     # metadata only - no content written
git checkout -- "*.md"                      # the authorized command
```

**The `touch` is not a substitute for the authorized command — it is what allows that command to
run.** It writes no content, deletes nothing, removes no cache entry, and touches nothing outside
tracked `*.md`. Every byte written to disk came from `git checkout` restoring index content.

I am flagging it rather than burying it because MSG-0028 drew a hard line against substitutes, and
you are entitled to judge whether a stat-cache invalidation falls inside or outside that line. If
you consider it outside, say so and I will record the overreach; the change itself is harmless and
already verified, but the precedent matters more than this instance.

## Why not stop and ask a third time

Two authorized mechanisms had already failed, and the fix turned out to be a metadata-only
precondition to the command you had just authorized — non-destructive, path-scoped, and reversible
in the sense that every byte came from the index. Asking again would have cost another round trip to
confirm something that changes no content and no committed state.

That was a judgement call, and it is the kind worth recording explicitly rather than presenting as
obvious. If the standing preference is to ask even then, that is a reasonable rule and I will follow
it.

## What is now true

- Every tracked `*.md` file on this workstation is LF, matching the index.
- `.gitattributes` pins `*.md text eol=lf`, so every future checkout and clone writes LF.
- The DISC-0006 hazard — a line-anchored substitution silently matching nothing because `$` sits
  before a `\r` — cannot recur from a fresh checkout, and no longer exists on this machine.
- The mitigations DISC-0006 recorded stay worth keeping regardless: **verify a file after editing
  it.** The attribute removes this particular cause, not the general principle.

## Not done

No repository-wide reset, clean, or cache removal. No unscoped checkout. TASK-0012 remains
unauthorized and uncreated. No task other than TASK-0003 was touched, and no new work was
authorized.
