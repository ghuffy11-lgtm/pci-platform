# MSG-0030 — MSG-0028 Decisions 2 and 3 Applied; Decision 1's Command Does Not Work

**Status:** OPEN — decision required on the refresh mechanism only
**Raised:** 2026-08-20
**Raised by:** Claude Code (interactive session)
**Type:** Question — the authorized command does not achieve the authorized outcome
**Authority:** MSG-0028 | **Related:** TASK-0003, DISC-0006, TASK-0010

## Applied

### Decision 3 — scoped unattended push

`runner-settings.json` now allows exactly `Bash(git push origin main)`. Plain `git push` with
arbitrary refspecs is not allowed; the `--force` / `-f` deny rules are untouched.

### Decision 2 — abort on mid-run repository movement

Added to `CLAUDE.md` as a fail-closed recovery boundary: a session whose `HEAD` or `origin/main`
moves after it started must stop at the next safe checkpoint, document the discrepancy, and make no
further changes. It records the starting `HEAD` in its first checkpoint and re-checks before any
commit, push, or irreversible operation.

The reasoning worth keeping: *a session that began against one repository and finishes against
another has produced evidence about neither.*

### Decision 1 — allowlist widened as instructed

`runner-settings.json` allows the path-scoped refresh commands and nothing broader. The deny list is
unchanged and nothing was silently widened.

## The problem: the authorized command is a no-op on this working tree

MSG-0028 authorized exactly:

```bash
git ls-files -z "*.md" | git checkout-index -f -z --stdin
```

I ran it. **It changed nothing.**

```text
before   tracked *.md with w/crlf: 151
after    tracked *.md with w/crlf: 151
```

Verified on a single file so the result could not be a counting artifact:

```text
mtime before: 2026-08-19 09:00:29.678255400 +0300     bytes before: 2029
mtime after:  2026-08-19 09:00:29.678255400 +0300     bytes after:  2029
blob in HEAD: 1982 bytes (LF)
git diff:     (no output)
```

The file was **not rewritten** — same mtime, same byte count, still 47 CRLF pairs more than the
blob. `git checkout-index` consults the stat cache and treats the file as up to date; `-f` forces
overwriting an existing file when it decides to write one, but it does not defeat that check. And
`git diff` stays silent because git normalises on read, so the discrepancy is invisible to the
tools one would normally use to notice it.

`git check-attr` confirms the attribute is applied (`text: set`, `eol: lf`), and every index blob is
already LF. The attribute is correct; the working-tree files simply predate it and nothing rewrites
them.

## Why I did not substitute another command

MSG-0028 is explicit: *"No unscoped `git reset --hard`, repository-wide checkout, cache removal, or
equivalent substitute is authorized."* The mechanisms that would work are exactly such substitutes,
so I stopped rather than choosing one. Rule 2 says the same thing in general terms.

## Evidence for whichever mechanism you choose

In a throwaway clone I reproduced the condition (CRLF on disk, stat cache refreshed so git considers
the file current) and tested the candidates:

| Mechanism | Result in the reproduction |
|---|---|
| A — `git ls-files -z "*.md" \| git checkout-index -f -z --stdin` (authorized) | **worked** |
| B — `git checkout -- "*.md"` (path-scoped, not repository-wide) | **worked** |
| C — remove the tracked `*.md` files, then run A | **worked** |

So A works in a reproduction and does nothing on the real working tree. The difference is in the
real tree's stat-cache state, which I have not been able to reproduce exactly — I can demonstrate
the failure, but I cannot yet explain why the same command behaves differently there, and I would
rather say that than offer a tidy guess.

**The practical consequence is what matters: A alone will not finish TASK-0003 on this machine.**

## Decision required — one item

Authorize one of:

- **B — `git checkout -- "*.md"`.** Path-scoped, not repository-wide, single command, no deletion.
  My recommendation: it is the smallest change that reliably rewrites the files, and its blast
  radius is exactly the paths named.
- **C — remove the tracked `*.md` files, then re-run A.** Also path-scoped, but it deletes 151
  tracked files for an instant before restoring them. Safe in principle, worse if interrupted.
- **D — accept the residue.** The repository is already correct: every index blob is LF and every
  future checkout or clone writes LF. Only this one workstation's existing files carry CRLF, and
  DISC-0006's mitigations still cover them. TASK-0003 would close as IMPLEMENTED with a recorded
  limitation rather than COMPLETE.

D is defensible and costs nothing. The hazard DISC-0006 describes cannot recur for anyone starting
from the repository; what remains is stale bytes on one machine.

## State

`.gitattributes`, the index, and every committed document are unaffected by this message. TASK-0003
remains `IMPLEMENTED — NOT COMPLETE`, exactly as the supervisor-started session left it. The
allowlist and `CLAUDE.md` changes above are committed and pushed; nothing else was touched.
