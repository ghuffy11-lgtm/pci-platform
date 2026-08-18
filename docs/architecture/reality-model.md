# PCI Reality Model

**ID:** MODEL-REALITY-0001  
**Status:** Founding Draft  
**Version:** 0.1

## Definition

The Reality Model is PCI's canonical semantic model of entities, concepts, relationships, events, policies, provenance, and state relevant to an organization or to PCI itself.

## Core Domains

```text
Organization
├── People
├── Roles
├── Departments
├── Locations
├── Assets
├── Networks
├── Applications
├── Services
├── Data
├── Knowledge
├── Policies
├── Workflows
├── Events
├── Vendors
└── AI / Agents
```

These are foundational domains, not a closed list. Domain extensions must reuse the common object and relationship semantics.

## State vs History

- Objects represent current or versioned state.
- Events represent changes or occurrences.
- Provenance explains where knowledge came from and how it was produced.
- Policies express governing constraints.

## Canonical Identity

Each entity receives a stable PCI identifier. External identifiers are mapped to the canonical identifier and do not replace it.

## Reality Model Requirements

The model must support:

- stable identity;
- typed objects;
- typed relationships;
- temporal validity;
- provenance;
- confidence;
- ownership;
- authorization context;
- lifecycle state;
- external identifiers;
- change history;
- machine and human-readable representations.

## PCI as Its Own First Customer

Before modeling customer organizations, PCI must model its own architecture, services, agents, repositories, standards, decisions, dependencies, deployments, and operational knowledge. This is the first proof that the Reality Model is useful.

## Non-Goals for v1

The model will not attempt to represent every possible enterprise concept before implementation. It will establish a stable core and allow governed domain extensions.
