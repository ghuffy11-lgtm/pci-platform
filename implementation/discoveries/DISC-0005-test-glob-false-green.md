# DISC-0005 — `npm test` Reports Success While Running Zero Tests Under POSIX Shells

**Status:** **CORRECTED 2026-08-19 — the target-platform claim was WRONG and is disproven by
measurement.** The defect is real but confined to Git Bash / MSYS on Windows. See the correction at
the end of this file. **Do not act on the original recommendation.**
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

---

## CORRECTION — 2026-08-19, measured on the target platform

**The central claim of this discovery was wrong.** It asserted:

> The accepted bootstrap contract targets **Ubuntu**. On that host `npm` runs scripts through
> `/bin/sh`, which is precisely the failing case.

That was inferred, not measured. It has now been measured on the authorized host, and it is false.
Three invocations were run in the runtime image (`node:24.15.0-alpine`, `/bin/sh` → busybox):

| Variant | Result |
|---|---|
| **A — quoted glob, exactly as `package.json` has it today** | **tests 102, pass 102, fail 0** |
| B — directory (`node --test test/unit/`) | tests 1, pass 0, **fail 1** |
| C — shell-expanded | tests 102, pass 102, fail 0 |

And through the documented entry point itself:

```text
> npm test
> node --test 'test/unit/**/*.test.ts'      -> tests 102, pass 102, fail 0
> node --test 'test/contract/**/*.test.ts'  -> tests 101, pass 101, fail 0
```

Node's own glob handling resolves `**` once the shell passes the pattern through unchanged, which
is what a POSIX shell does. The scripts are correct on the platform that matters.

**What is actually true:** the zero-test result was observed only under Git Bash / MSYS on the
Windows authoring workstation, where the quoting is handled differently and the pattern reaches
`node` in a form it does not match. That is a real trap for anyone running the suite on Windows,
and it did mislead this project — but it is a workstation issue, not a target-platform issue.

**Note that variant B — the "obvious" fix of pointing `--test` at a directory — is the one that
actually breaks.** Had the recommendation below been applied without measuring, it would have
introduced the failure it was meant to prevent.

### Revised recommendation

- **Do not change the test scripts.** They work correctly on the deployment platform.
- Keep the standing rule that a tier reporting **zero tests is a failure**, not a pass. That rule
  was worth adding regardless of where the defect turned out to live.
- If Windows-side execution is wanted, document the shell caveat rather than changing the scripts,
  since the change that "fixes" Windows breaks Linux.
- TASK-0002, which proposed making the entry points shell-independent, should be **withdrawn or
  rescoped** — its premise is this incorrect claim.

### Why the original was wrong

The observation (zero tests, exit 0) was real. The extrapolation from "fails in my shell" to "fails
on `/bin/sh`, therefore fails on Ubuntu" was an inference presented as a fact about the target
platform, and it was never checked against the target platform — because at the time there was no
access to one. The correct handling would have been to record it as *observed on Windows, unverified
on Linux*.

This is the failure mode `CLAUDE.md` Rule 5 names: distinguish **VERIFIED** from **INFERRED**. The
finding was labelled with more certainty than the evidence supported, and it survived long enough
to become a task in the execution queue.
