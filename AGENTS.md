# PCI Agent Instructions

This repository is governed by the PCI Engineering Constitution.

## Required Reading

Before making changes, read:

1. `knowledge/governance/constitution.md`
2. `docs/architecture/architecture-principles.md`
3. the relevant ADRs and SPECs
4. `docs/engineering/claude-code-rules.md`

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
