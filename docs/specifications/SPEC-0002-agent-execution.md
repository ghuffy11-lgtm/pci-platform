# SPEC-0002 — Governed Agent Execution

**Status:** Approved for foundation design  
**Version:** 0.1

## Purpose

Define how PCI agents perform work safely and traceably.

## Execution Contract

```text
REQUEST
  -> IDENTIFY ACTOR
  -> AUTHORIZE
  -> RETRIEVE CONTEXT
  -> PLAN
  -> POLICY CHECK
  -> RISK CLASSIFY
  -> APPROVAL (if required)
  -> EXECUTE
  -> VALIDATE
  -> RECORD EVIDENCE
  -> UPDATE KNOWLEDGE
```

## Risk Classes

### R0 — Read-only
Inventory, status, diagnostics, documentation lookup.

### R1 — Reversible non-production change
Changes with bounded and tested rollback.

### R2 — Production configuration change
Requires explicit authorization and post-change validation.

### R3 — High-impact / destructive
Requires explicit human approval and enhanced evidence controls.

## Tool Contract

Every tool must declare:

- identity requirements;
- input schema;
- authorization scope;
- risk class;
- timeout;
- rollback behavior where applicable;
- validation method;
- audit fields.

## Failure Rule

If execution succeeds partially, the agent must report partial success and preserve evidence. It must not claim full completion.
