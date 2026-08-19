# DISC-0006 — CRLF Line Endings Silently Defeat Anchored Text Edits

**Status:** **MOSTLY RESOLVED** (2026-08-20, TASK-0003) — the recommended action is applied and
verified; one residue remains on the authoring workstation. See *Resolution* at the end.
**Raised:** 2026-08-19
**Work package:** WP-0001 — PCI Kernel Foundation (tooling, not product code)
**Related:** DISC-0005 (silent false-green in test tooling), `CLAUDE.md` Rule 5, Rule 12

## Discovery

The repository is authored on Windows with `core.autocrlf` active. Files written fresh have LF, but
once Git has checked a file out again it carries **CRLF** terminators in the working tree.

A line-anchored regular expression then fails to match, because `$` sits before the `\r`:

```text
$ grep -m1 '^\*\*Status:' implementation/comms/MSG-0002-kernel-runtime-stack.md
**Status:** OPEN (non-blocking — proceeding under delegated authority)

$ file implementation/comms/MSG-0002-kernel-runtime-stack.md
... UTF-8 text, with CRLF line terminators
```

A substitution anchored with `^...$` against that line **matches nothing and exits 0.** No error,
no diff, no warning. The edit simply does not happen.

## Why it matters

This is the same failure shape as DISC-0005: **a tool reporting success while doing nothing.**

It bit this session directly. A status correction to MSG-0002 was applied by an anchored
substitution, the command succeeded, and the resulting commit message asserted the correction had
been made. It had not. The message still read `OPEN` after the commit claiming it read `CLOSED`.
The error was caught by verifying the file afterwards rather than trusting the exit code, and
corrected in the following commit — but a commit message had already entered the permanent record
overstating what was done.

That is precisely the class of inaccuracy `CLAUDE.md` Rule 5 exists to prevent, arriving through a
tool rather than through reasoning.

Affected files currently carrying CRLF in the working tree:

```text
implementation/comms/MSG-0002-kernel-runtime-stack.md
implementation/comms/MSG-0005-architecture-lead-decisions.md
```

Any file may join that list after a checkout, so the count is not the point — the technique is.

## Mitigation

- **Verify the file after editing it. Never trust the exit code of a substitution.** Grep for the
  new text, or diff, before claiming the change was made.
- Prefer exact-string editing tools over line-anchored regular expressions for record files.
- Where a regex is unavoidable, tolerate the carriage return (`\r?$`) rather than assuming LF.
- `.gitattributes` already pins `*.sh` to `eol=lf`, because a CRLF shebang breaks execution on the
  Ubuntu host. Extending that to `*.md` would remove this hazard for the record files as well, but
  it rewrites line endings across the repository and is therefore proposed rather than done.

## Recommended action

Add `*.md text eol=lf` to `.gitattributes` so communication and status records stop acquiring CRLF
on checkout. This is a repository-wide normalisation and touches files owned by the architecture
lead, so it is recorded here for approval rather than applied unilaterally.

## Resolution — TASK-0003, 2026-08-20

Approved by **MSG-0027** and executed by a supervisor-started session. `.gitattributes` now carries:

```gitattributes
*.md text eol=lf
```

**The feared repository-wide rewrite did not happen, because it was never needed.** Every tracked
`*.md` blob was *already* LF in the index — `core.autocrlf=true` had been normalising on commit all
along, and the CRLF existed only in the working tree. Measured before and after:

```text
$ git ls-files --eol "*.md" | grep -c "i/lf"
195                     <- all index blobs LF, before and after

$ git add --renormalize -- "*.md"
$ git diff --cached --stat
(no output)             <- zero committed content changed
```

So the commit is one line of `.gitattributes` plus records. No document owned by the architecture
lead had its content altered.

**What is fixed:** every checkout and clone from now on writes `*.md` as LF. The hazard cannot
recur for anyone starting from the repository.

**What is not:** 152 `*.md` files already present in the authoring workstation's working tree still
carry CRLF, because setting the attribute does not rewrite files already on disk. Refreshing them
requires `git checkout`, `git rm --cached`, or `git checkout-index` — all three refused by the
unattended runner's permission layer, and Rule 2 forbids substituting another mechanism. Until an
operator refreshes them, **the mitigations below still apply to those files on that machine.**

The mitigations are worth keeping permanently in any case. The `.gitattributes` pin removes this
particular cause; it does not make "verify the file after editing it" unnecessary.
