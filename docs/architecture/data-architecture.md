# PCI Data Architecture

## Principles

- Reality is modeled once.
- Domain ownership is explicit.
- Operational state and immutable evidence are distinct.
- Secrets are never part of the knowledge model.
- Provenance accompanies important facts.
- Data contracts are versioned.
- Storage is replaceable behind service contracts.

## Logical Data Classes

### Canonical Objects

Current representations of organizations, people, assets, applications, services, policies, capabilities, and other modeled entities.

### Relationships

Typed connections between objects, including provenance and effective time where required.

### Events

Immutable facts representing observations, state transitions, commands, and integration activity.

### Evidence

Audit and verification artifacts associated with governed operations.

### Knowledge Sources

Documents, APIs, tickets, configurations, repositories, telemetry, and other sources from which facts are derived.

### Secrets

Credentials, keys, tokens, and sensitive authentication material. These are externalized and excluded from the Knowledge Fabric.

## Storage Strategy

The first implementation may use PostgreSQL for transactional persistence and object storage for larger artifacts, with search/indexing introduced as a projection. A graph database is not a prerequisite for the first release. Graph behavior is defined by the domain model and query contracts, allowing the storage implementation to evolve.

## Data Flow

```text
Source
  -> Ingestion / Connector
  -> Normalize
  -> Validate
  -> Provenance
  -> Knowledge Object / Event
  -> Persistence
  -> Query / Projection
  -> Human or AI Consumer
```
