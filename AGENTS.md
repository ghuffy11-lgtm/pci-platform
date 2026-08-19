# PCI Agent Instructions

This repository is governed by the PCI Engineering Constitution.

## Required Reading

Before making changes, read:

1. `knowledge/governance/constitution.md` — the PCI Constitution. This file remains
   authoritative for the Constitution itself.
2. `docs/architecture/architecture-principles.md`
3. the relevant ADRs and SPECs under `docs/decisions/` and `docs/specifications/`
4. `docs/engineering/claude-code-rules.md`

## Governance Tree Authority

`docs/` is authoritative for architecture, ADRs, specifications, engineering, operations,
product, program, and security governance. The single exception is
`knowledge/governance/constitution.md`, which remains authoritative for the PCI Constitution.

Other duplicated governance content under `knowledge/` is **legacy** and must not override
`docs/`. Where the two trees disagree, `docs/` wins. The legacy duplicates are retained
deliberately for now; their migration or removal is a separate controlled cleanup task and must
not be performed opportunistically.

Decided by the architecture lead in `implementation/comms/MSG-0005-architecture-lead-decisions.md`.

## Session Start — Mandatory

Every session re-reads the documents listed above, plus `implementation/status/current.md`, the
active work package, and all open items in `implementation/comms/`, `implementation/blockers/`,
and `implementation/discoveries/`.

**Do not rely on memory from previous sessions.** Recalled context is a pointer to where to look,
never evidence that something is still true. Re-read and re-verify.

The full startup and pre-action checklists are in `CLAUDE.md`. They are mandatory for every agent
working in this repository, not only Claude Code.

## PCI Server Boundary — Hard Requirement

On the PCI server:

- The project workspace MUST be `/data/pci-platform`.
- ALL persistent application, runtime, and container state MUST live under `/data/docker`.
- NEVER create a project artifact outside `/data` — no clone, copy, build output, cache, log, or
  temporary file.
- NEVER improvise another workspace because of permissions or convenience. A missing or
  unwritable workspace is a blocker to record, not an obstacle to route around.
- `~/.ssh` holds infrastructure credentials, not project artifacts. It is outside this boundary
  and must not be moved, deleted, or recreated to satisfy it.

Before any host change: state the destination path, state the privilege required, confirm
authorization. If privilege is unavailable — STOP and record a blocker. Never work around a
permission denial.

Authority: `docs/operations/pci-server-bootstrap.md` v0.2.

## Evidence Discipline

Never claim that a file exists, a command ran, a service is installed, a test passed, a server was
modified, a deployment happened, or an approval exists, unless it was directly verified in this
session.

Distinguish **VERIFIED** (checked here, quote the result), **INFERRED** (reasoned from something
verified, say so), and **UNKNOWN** (not checked, say so).

"Implemented" is not "verified". Exit code 0 is not a passing test — confirm the test count is
non-zero. Integration claims require the real integration environment.

## Non-Negotiable Rules

- Do not silently change approved architecture.
- Do not add secrets to the repository.
- Prefer existing approved standards and components.
- Keep implementations model/provider agnostic.
- Preserve customer-data ownership and offline-first requirements.
- Test changes before reporting completion.
- Update the engineering knowledge when architecture or operational behavior changes.

## Implementation Protocol

```text
READ -> PLAN -> IMPLEMENT -> TEST -> VALIDATE -> UPDATE KNOWLEDGE -> REPORT
```

If a requirement conflicts with an approved architectural artifact, stop the conflicting portion and propose an RFC/ADR.

## Scope Discipline

Do not expand a task because a related improvement is interesting. Record unrelated improvements as follow-up work unless they are required for correctness, security, or the approved specification.

## Additional Non-Negotiable Rules

- Repository documentation is the source of truth. Your assumptions, previous responses, inferred
  requirements, conversational instructions, and existing code never override an accepted
  architecture document or an explicit repository rule.
- Implement only the active work package. Do not begin the next one automatically.
- Do not delete legacy documentation or superseded records unless explicitly authorized.
- Do not force-push, delete destructively, replace credentials, or bypass a security boundary
  unless explicitly authorized.
- Stop and record a GitHub communication or blocker when architecture is ambiguous, privilege is
  unavailable, a required host or path is unavailable, a security boundary would be crossed,
  documentation conflicts, or the request would require guessing.
- GitHub is the mandatory communication channel with the architecture lead. The user is not a
  technical messenger. Document blockers, discoveries, failed verifications, assumptions, and
  decision requests before stopping.
- Before reporting completion, reconcile the status file, blockers, reports, communications, and
  repository HEAD so they describe the same actual state.
