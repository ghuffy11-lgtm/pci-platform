# MSG-0007 — Permanent Operating Rule Hardening

**Status:** DECIDED — 2026-08-19. Applied; implementation remains stopped.
**From:** PCI architecture lead
**Work package:** none — governance change, applies to all future sessions
**Amends:** `CLAUDE.md`, `AGENTS.md`

## Directive

The architecture lead directed that the permanent operating rules be hardened for all future
sessions, with twelve explicitly named areas, a mandatory startup checklist, and a mandatory
pre-action checklist. Existing rules were to be strengthened, not removed. No product code was to
be written and the server was not to be touched.

## Applied

### `CLAUDE.md` — 142 lines to 363

| Addition | Covers |
|---|---|
| *Authority Is Absolute* (under Authority Order) | Item 4. Names what never overrides accepted architecture, including conversational instruction. States how a lead-directed amendment is to be made: record the instruction first, then change, so the change traces to a decision rather than a conversation. |
| *Mandatory Startup Checklist* | Item 3. Nine checked steps including reading the bootstrap contract before host work, reading all open comms/blockers/discoveries, and verifying git state. States that session memory is a pointer, never evidence. |
| *Non-Negotiable Rules*, sections 1–12 | Items 1–12, one section each, in the order given. |
| *Mandatory Pre-Action Checklist* | Seven questions before any write, install, delete, deploy, or external action. If any answer is unknown, the action does not start. |
| *Completion Rule* extension | Items 10–12. Evidence per criterion, non-zero test counts, real integration environment, reconciled records. "No partial credit and no rounding up." |

### `AGENTS.md` — 48 lines to 109

Added *Session Start — Mandatory*, *PCI Server Boundary — Hard Requirement*, *Evidence
Discipline*, and *Additional Non-Negotiable Rules*. `AGENTS.md` applies to every agent working in
this repository, not only Claude Code, so the boundary and evidence rules are stated there rather
than only referenced.

### Verification that nothing was lost

Every non-blank line of both files at the previous commit was checked for presence in the new
files. **Zero lines removed from either.** The change is purely additive.

## Why several rules are phrased against specific past failures

The rules that name a failure mode name one that has actually occurred in this repository. That is
deliberate — a rule stated abstractly is easy to satisfy in appearance.

- **Rule 1 (`/data` boundary)** exists because a clone was placed in `/home/claude` under wording
  that permitted it. See MSG-0006.
- **Rule 5 (no hallucinated facts)** includes "a bare command failure is not a diagnosis" because
  BLK-0002 was first recorded with a wrong root cause inferred from an unexamined error message,
  sending the operator toward a GitHub permissions problem that did not exist.
- **Rule 10 (verification)** requires a non-zero test count because `npm test` in this repository
  exits 0 while running zero tests under a POSIX shell — the default on the target host. See
  DISC-0005.
- **Rule 12 (status consistency)** exists because the status file has twice carried statements
  that were true when written and false when read.

## Status

Implementation remains **stopped**. No product code was written. The PCI server was not modified,
Docker was not installed, and `/data/pci-platform` was not created.

Open blockers are unchanged: BLK-0001 (host not bootstrapped) and BLK-0004 (no privilege, and the
workspace not yet provisioned). Contract v0.2 from MSG-0006 still awaits architecture-lead review.
