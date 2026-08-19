# MSG-0009 — Permanent Rule Added: Documentation Is Mandatory

**Status:** DECIDED — 2026-08-19. Applied, committed, and pushed.
**From:** PCI architecture lead
**Work package:** none — governance change, applies to every future session and every task
**Amends:** `CLAUDE.md`
**Related:** MSG-0007 (first hardening round), DISC-0006

## Directive

The architecture lead directed that a permanent, non-negotiable **Documentation Is Mandatory** rule
be added to `CLAUDE.md`, with ten numbered clauses covering what must be read before a task, what
must be recorded during it, which persistent records must be updated at the end, and the standard
the resulting repository must meet.

## Applied

### `CLAUDE.md` — 363 to 415 lines

New `## Documentation Is Mandatory` section at line 307, positioned between
`## Mandatory Repository Communication` and `## Status Commands`, so the communication protocol is
immediately followed by the obligation to use it.

All ten clauses are recorded verbatim. Their operative constraints:

| Clause | Requirement |
|---|---|
| 1 | Read the governing work package, ADRs, specifications, communications, blockers, discoveries, and operational rules **before starting**. |
| 2 | Record discoveries, assumptions, blockers, failed verification, deviations, and decisions **during execution**. |
| 3 | Update `status/current.md`, `comms/`, `blockers/`, `discoveries/`, `reports/` as applicable **when the task finishes**. |
| 4 | The repository must be sufficient for a **completely new session** to understand what was done, verified, and what remains — without the conversation. |
| 5 | **A conversational response is NOT the project record.** The repository is. |
| 6 | Never report *done*, *complete*, *verified*, *blocked*, or *waiting* unless the state **and its evidence** are in GitHub. |
| 7 | "No documentation change required" must be **verified**, never assumed. |
| 8 | Reconcile status, blockers, reports, communications, and HEAD **before reporting**. |
| 9 | Commit and push documentation updates **before** reporting the task complete. |
| 10 | A new session must be able to resume from repository documentation and repository state alone. |

One subsection was added beyond the ten clauses, *Practical consequence*: the conversation is a
working surface that disappears, the repository is the memory, and records should be written for
the reader who was not there — keeping corrected wrong diagnoses rather than tidying them away.
That is implementation guidance on applying the rule, not an extension of it. If the architecture
lead prefers the clauses bare, removing it is a one-line change.

### `implementation/status/current.md`

New `## Permanent Operating Rules` section at line 121, recording this rule and both hardening
rounds (MSG-0007 and this message).

### Verification performed

- Both edits were **read back from disk** after writing rather than inferred from an exit code —
  the mitigation recorded in DISC-0006, after that precise failure mode produced an inaccurate
  commit message earlier the same day.
- Every non-blank line of `CLAUDE.md` at the preceding commit was checked for presence afterwards:
  **none removed.** The change is purely additive, as the "do not remove existing rules"
  instruction required.
- Presence confirmed on `origin/main`, not only in the working tree: `## Documentation Is Mandatory`
  at line 307 with all ten clauses, and `## Permanent Operating Rules` at line 121.

## Outcome and the gap this message closes

The rule change itself was correct and did reach `origin/main` in commit
`4f8a66e3ad21d763403542f4f0b7c2934cc8b1d1`. **But no communication record was created for it**, so
the change was not discoverable through the communication channel — a reader working from
`implementation/comms/` would find MSG-0007 documenting the first hardening round and nothing at
all about the second.

That is a failure of the very rule being added: clause 3 requires the appropriate persistent
records to be updated, and `comms/` was the applicable one for a governance change directed by the
architecture lead. The status file was updated; the communication record was not. It was reported
as complete on the strength of the commit and the status entry alone.

This message is that missing record. The pattern is worth stating plainly for future sessions,
because it has now recurred twice in one day in different forms:

- **MSG-0008** existed and was pushed, but was not in any index — present yet undiscoverable.
- **This change** was committed and pushed, but had no communication record — present yet
  unannounced.

In both cases the artifact was real and the report of completion was, strictly, true. It was still
wrong, because the record was not reachable by the person who needed it. Clause 4 is the test that
catches this: *could a completely new session, reading only the repository, find and understand
this?* Committing a change is not the same as recording it.

## Status

Applied and pushed. The PCI server was not modified.

Nothing further is required of the architecture lead on this message; it is recorded for the
history and for the register. Open items are unchanged: MSG-0008 awaits the privileged bootstrap;
BLK-0001 and BLK-0004 remain open.
