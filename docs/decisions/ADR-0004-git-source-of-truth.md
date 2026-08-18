# ADR-0004 — Git as Engineering Source of Truth

**Status:** Accepted  
**Date:** 2026-08-18  
**Owner:** PCI Architecture

## Decision

Git is the canonical engineering source of truth for PCI architecture, specifications, governance, schemas, implementation, and change history.

Operational databases may become authoritative for runtime state where explicitly defined, but they do not replace the engineering repository.

## Consequences

- Architecture is versioned.
- Agent instructions are reviewable.
- Knowledge schemas can evolve with history.
- Runtime state must distinguish itself from engineering intent.

## Rule

No critical architectural decision should exist only in chat, email, or an agent context. It must be represented in the repository.
