# ADR-0001 — Canonical Reality Model

**Status:** Accepted  
**Date:** 2026-08-18  
**Owner:** PCI Architecture

## Context

PCI needs a common semantic foundation across engineering knowledge, enterprise systems, AI reasoning, agents, and domain capabilities. Multiple independent representations of the same real-world entity would create drift and unsafe automation.

## Decision

PCI will maintain a canonical Reality Model in which significant entities receive stable identities and typed relationships. Applications, integrations, AI context, documentation, and views consume or project that model rather than creating competing canonical identities.

## Consequences

### Positive

- Consistent identity across domains.
- Better impact analysis.
- Shared context for humans and AI.
- Easier synchronization and provenance tracking.
- Multiple applications can operate over the same organizational reality.

### Negative

- The semantic model requires governance.
- Integrations must map external identifiers.
- Initial implementation is more deliberate than building isolated modules.

## Alternatives Rejected

- Independent per-module data models.
- Documentation-only knowledge base.
- Making a specific graph database the canonical architecture.

## Standards Alignment

PCI will use established linked-data and provenance standards where appropriate while keeping the semantic model independent of a specific storage engine.

## Supersession

This ADR may be superseded only by an explicit ADR that explains why the canonical reality approach no longer satisfies PCI's requirements.
