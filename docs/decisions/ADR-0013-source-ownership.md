# ADR-0013 — Explicit Source Ownership

**Status:** Accepted
**Date:** 2026-08-18

## Decision

For every synchronized object type, PCI must explicitly identify the authoritative source or declare PCI authoritative. Synchronization must preserve external identifiers and provenance.

## Rationale

A Reality Model is useful only if conflicts and ownership are explicit. PCI must not silently create competing truths.

## Consequences

- Integrations require ownership mapping.
- Conflicts become visible engineering/business issues.
- Disconnecting a source does not destroy historical knowledge.
- Customer deployments can combine multiple authoritative systems safely.
