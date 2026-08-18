# PCI Claude Code Execution Model

**Status:** Foundation engineering specification
**Version:** 0.1

## Purpose

Define how an implementation agent such as Claude Code consumes PCI architecture and turns approved work into repository changes without becoming the architectural authority.

## Authority Chain

```text
PCI Constitution / ADRs / Specifications
              |
              v
       Architecture Lead
              |
              v
       Work Package / Task
              |
              v
         Claude Code
              |
              v
       Repository Changes
              |
              v
       Tests / Evidence
```

## Rules

1. Claude Code must treat ADRs and specifications as authoritative engineering constraints.
2. It may propose changes when implementation reveals a gap, but it must not silently override architecture.
3. Conflicts become an RFC/ADR or clarification task.
4. Every implementation task references its source specification.
5. Claude Code reports completed work, failures, assumptions, and tests.
6. Generated credentials or secrets must never be committed.
7. Production mutation is outside ordinary coding-agent authority.

## Task Contract

Each implementation task should include objective, source specification, acceptance criteria, allowed scope, dependencies, tests, and required evidence.

## Completion

A task is complete only when implementation, tests, documentation impact, and repository status are reported.
