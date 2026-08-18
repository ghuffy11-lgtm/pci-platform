# ADR-0011 — Agent Authority Boundary

**Status:** Accepted
**Date:** 2026-08-18

## Decision

PCI agents are delegated actors, not autonomous authorities. An agent may only execute capabilities explicitly granted by policy and the current execution context.

Read operations are the default. Mutating operations require policy evaluation and, where required, explicit human approval. High-risk operations must expose intended target, proposed change, risk classification, authorization state, and verification plan before execution.

The agent runtime must produce an immutable audit trail for every tool invocation that can affect external state.

## Consequences

- Natural-language requests cannot bypass authorization.
- Agent capabilities can be revoked independently.
- Human and machine actions become auditable.
- Automation can become progressively more autonomous without removing governance.
