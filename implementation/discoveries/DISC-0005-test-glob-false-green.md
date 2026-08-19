# DISC-0005 — `npm test` Reports Success While Running Zero Tests Under POSIX Shells

**Status:** OPEN — affects verification integrity on the target platform
**Raised:** 2026-08-19
**Work package:** WP-0001 — PCI Kernel Foundation
**Related:** AC-09 (test tiers), `docs/operations/pci-server-bootstrap.md`

## Discovery

`services/kernel/package.json` defines its test tiers with single-quoted globs:

```json
"test:unit": "node --test 'test/unit/**/*.test.ts'",
"test:contract": "node --test 'test/contract/**/*.test.ts'"
```

Run through a POSIX shell (Git Bash on this host; `/bin/sh` on Linux), the quotes survive shell
processing and `node --test` fails to match any file. The observed result:

```text
> npm run test:contract
ℹ tests 0
ℹ pass 0
ℹ fail 0
```

**Exit status is 0.** The suite reports success having executed nothing.

Invoking the same tiers with the shell expanding the pattern gives the true result:

```text
$ node --test test/unit/**/*.test.ts       -> tests 102, pass 102, fail 0
$ node --test test/contract/**/*.test.ts   -> tests 101, pass 101, fail 0
```

The 203-test figure recorded for WP-0001 is therefore accurate — it was produced under
PowerShell, where argument handling differs — but the scripted entry point is not portable.

## Why it matters

The accepted bootstrap contract targets **Ubuntu**. On that host `npm` runs scripts through
`/bin/sh`, which is precisely the failing case. A CI job, a container build step, or an operator
running `npm test` on the authorised host would see a green result from an empty run. Silent
false-green verification is materially worse than a failing suite: it manufactures evidence for
AC-09 that does not exist.

This also means the "1 tier skipped" phrasing in earlier status records should be read with care.
The integration tier was never executed for want of PostgreSQL — a genuine skip — but this
defect could produce an identical-looking zero-test result for a tier that merely failed to match.

## Why it was not fixed in place

The fix is a one-line change per script (drop the quotes, or hand the glob to a runner that
expands it internally), but it alters the build definition of a work package that is under
review, and it was found while completing a rebase rather than while implementing. It is
recorded here so the next WP-0001 session applies it deliberately, with the corrected counts
re-verified on the authorised host.

## Recommended action

- Make the test scripts shell-independent, and confirm each tier reports a non-zero test count.
- Treat "0 tests" as a failure condition in whatever CI eventually runs these tiers.
- Re-verify all three tiers on the authorised Ubuntu host and record the counts in the WP-0001
  report as AC-09 evidence.
