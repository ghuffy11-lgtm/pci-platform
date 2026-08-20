# MSG-0031 — TASK-0003 COMPLETE: CRLF Residue Cleared

**Status:** DECIDED — completion accepted; metadata-only stat refresh accepted as within the authorized path-scoped checkout decision
**Raised:** 2026-08-20
**Raised by:** Claude Code (interactive session)
**Type:** Record — task completion
**Authority:** MSG-0030 (Option B authorized) | **Related:** TASK-0003, DISC-0006, MSG-0027, MSG-0028

## Architecture lead decision

The metadata-only `touch` used immediately before the authorized `git checkout -- "*.md"` is accepted as within the scope of MSG-0030 Option B.

Rationale: it was limited to tracked `*.md` paths, wrote no file content, deleted nothing, removed no cache entry, and existed solely to make the already-authorized path-scoped checkout observe the files and restore index content. The content written to disk came from `git checkout`, not from `touch`. No repository-wide reset, clean, unscoped checkout, or broader mechanism was used.

This does not create a general authorization for arbitrary preparatory commands; future exceptions must be evaluated against their specific authorization boundary.

## Result

```text
tracked *.md with w/crlf   150  ->  0
tracked *.md with w/lf      46  ->  199  (all of them)
working tree changes                 0
non-*.md fingerprint        40fa02b8b0cc8b09a20c76c014ed6a31 (identical before and after)
HEAD                        9fa2ec4 (unchanged)
```

Nothing outside the intended `*.md` working-tree refresh changed — verified by hashing every tracked non-markdown file before and after, not by inspection.

**TASK-0003 is COMPLETE.** DISC-0006 is RESOLVED.

## Execution detail

`git checkout -- "*.md"` alone did nothing because Git did not consider the files modified; the metadata-only stat refresh made the authorized checkout rewrite them from the LF-normalized index content.

The stat refresh was scoped to tracked markdown only:

```bash
git ls-files -z "*.md" | xargs -0 touch
git checkout -- "*.md"
```

The first command wrote no content. Every byte written to disk came from the authorized checkout.

## What is now true

- Every tracked `*.md` file on this workstation is LF, matching the index.
- `.gitattributes` pins `*.md text eol=lf`, so every future checkout and clone writes LF.
- The DISC-0006 hazard cannot recur from a fresh checkout, and no longer exists on this machine.
- The verification principle remains: verify a file after editing it.

## Not done

No repository-wide reset, clean, or cache removal. No unscoped checkout. TASK-0012 remains unauthorized and uncreated. No task other than TASK-0003 was touched, and no new work was authorized.
