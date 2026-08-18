# ADR-0001 — Canonical Reality Model

**Status:** Proposed  
**Date:** 2026-08-18  
**Decision Scope:** Platform foundation

## Context

PCI is intended to connect enterprise knowledge, systems, assets, people, events, policies, and AI. Treating isolated documents, applications, or databases as the primary representation would reproduce the fragmentation PCI is intended to solve.

## Decision

PCI will establish a canonical, connected Reality Model as a foundational platform concept.

The Reality Model represents entities and their relationships. It does not require that every underlying system surrender ownership of its data. Systems of record remain authoritative for their domains; PCI maintains canonical identities, relationships, provenance, and synchronized knowledge required for cross-domain reasoning.

## Consequences

### Positive

- enables cross-system reasoning;
- reduces semantic duplication;
- supports impact analysis;
- provides common context for humans and AI agents;
- enables multiple application views over shared organizational reality.

### Negative / Risks

- the model can become overly complex;
- synchronization and provenance must be carefully designed;
- governance becomes essential;
- storage/query technology must support evolving relationships without locking PCI to one vendor.

## Alternatives Considered

1. Document-centric knowledge base — rejected as the primary model because relationships and state are secondary.
2. Traditional CMDB-only approach — insufficient because PCI must represent business, knowledge, operational, and AI concepts beyond configuration items.
3. Single graph database as the architecture — rejected at this stage because graph storage is an implementation choice, not the architectural principle.

## Follow-Up

Architecture Review 004 will evaluate standards and implementation options for the Reality Model before a storage technology is selected.
