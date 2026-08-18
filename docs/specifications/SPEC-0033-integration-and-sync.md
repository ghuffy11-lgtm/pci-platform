# SPEC-0033 — Integration and Synchronization

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Define how PCI synchronizes with external systems without creating uncontrolled duplicate sources of truth.

## Requirements

- Every integration declares source ownership for each synchronized object type.
- Support initial discovery, incremental synchronization, and reconciliation.
- Preserve external identifiers.
- Record sync timestamps and provenance.
- Detect conflicts and expose them rather than silently choosing a winner.
- Support webhook/event-driven and scheduled synchronization.
- Handle retries and duplicate delivery safely.
- Respect rate limits and maintenance windows.
- Permit integration disablement without corrupting canonical history.

## Ownership

PCI may become authoritative for objects it owns, while external systems remain authoritative for objects they own. The ownership decision must be explicit in the domain contract.

## Acceptance Criteria

An external system can be connected, synchronized, reconciled, disconnected, and reconnected while object identity, provenance, conflicts, and historical state remain understandable.
