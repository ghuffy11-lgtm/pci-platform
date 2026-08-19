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
