# ADR-0006 — Knowledge Model Serialization

**Status:** Accepted
**Date:** 2026-08-18

## Context

PCI needs a canonical semantic model that can be consumed by humans, services, agents, and external tooling. The representation must remain independent of any single database or programming language.

## Decision

PCI will define its semantic model independently from serialization and storage. JSON-LD 1.1 is the preferred interoperable linked-data representation. YAML may be used for human-authored configuration where appropriate. No application component may depend on YAML-LD-specific behavior as a core requirement.

## Consequences

- Semantic identity and relationships remain portable.
- Git can store human-reviewable representations.
- Runtime storage can evolve without changing the domain model.
- JSON-LD tooling can be adopted without making the entire platform a semantic-web implementation.
