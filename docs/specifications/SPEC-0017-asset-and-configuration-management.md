# SPEC-0017 — Asset and Configuration Management

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Represent physical and logical assets, their configuration state, ownership, location, dependencies, lifecycle, and evidence.

## Requirements

- Support asset identity and lifecycle.
- Track ownership, location, status, and relationships.
- Preserve configuration snapshots where authorized.
- Distinguish observed state from desired state.
- Record changes and their provenance.
- Support reconciliation from external sources.
- Avoid duplicating authoritative source data unnecessarily.
- Connect assets to tickets, services, people, policies, and locations.

## Automation Boundary

Configuration changes must use the governed change and tool execution path. Asset management itself does not grant mutation authority.

## Acceptance Criteria

PCI can represent an asset, reconcile observed state, associate it with organizational and technical relationships, retain historical changes, and expose the state to authorized automation.
