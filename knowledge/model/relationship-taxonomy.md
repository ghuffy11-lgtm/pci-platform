# PCI Relationship Taxonomy

**ID:** MODEL-REL-0001  
**Status:** Proposed Foundation

Relationships are first-class knowledge. They must be typed, directional where appropriate, attributable, and queryable.

## Foundational Relationship Families

### Structural

- `PART_OF`
- `CONTAINS`
- `INSTANCE_OF`
- `IMPLEMENTS`
- `EXTENDS`
- `REPLACES`
- `SUPERSEDES`

### Dependency

- `DEPENDS_ON`
- `REQUIRED_BY`
- `USES`
- `PROVIDES`
- `CONSUMES`
- `GENERATES`

### Ownership and Responsibility

- `OWNED_BY`
- `MANAGED_BY`
- `APPROVED_BY`
- `ASSIGNED_TO`
- `BELONGS_TO`

### Location and Topology

- `LOCATED_IN`
- `HOSTED_ON`
- `CONNECTED_TO`
- `SERVES`
- `PROTECTS`

### Security and Identity

- `AUTHENTICATED_BY`
- `AUTHORIZED_BY`
- `GOVERNED_BY`
- `SECURED_BY`

### Operations

- `MONITORED_BY`
- `BACKED_UP_BY`
- `RESTORED_BY`
- `TRIGGERS`
- `AFFECTS`
- `REMEDIATES`

### Knowledge

- `DOCUMENTED_BY`
- `EVIDENCED_BY`
- `DERIVED_FROM`
- `RELATED_TO`

## Relationship Requirements

A relationship should support, where useful:

- source object;
- relationship type;
- target object;
- provenance;
- confidence;
- effective time;
- expiration/retirement;
- owner;
- notes.

## Governance

New relationship types require review. Synonyms should not be casually introduced because semantic consistency is essential for AI reasoning and impact analysis.
