# SPEC-0021 — Agent Context and Memory

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Define how agents obtain task context and retain permitted state without turning model memory into an authoritative source of truth.

## Context Layers

1. System and policy context.
2. User and tenant context.
3. Task context.
4. Retrieved Knowledge Objects and evidence.
5. Tool capability context.
6. Ephemeral working state.
7. Approved long-lived agent memory.

## Requirements

- Authorization is applied before context assembly.
- Secrets are excluded unless a privileged execution component explicitly requires them.
- Memory entries have provenance, owner, classification, and lifecycle.
- Agents must distinguish remembered information from authoritative knowledge.
- Context size and retention are bounded by policy.
- Memory can be reviewed, corrected, expired, and deleted.

## Acceptance Criteria

An agent can assemble task-specific context from authorized sources, preserve useful state between executions, and clearly distinguish authoritative Knowledge Objects from ephemeral or remembered information.
