# PCI Relationship Taxonomy

**ID:** MODEL-REL-0001  
**Status:** Founding  
**Version:** 1.0

Relationships are first-class knowledge. They are typed, directional where appropriate, attributable, queryable, and subject to governance.

## Foundational Relationship Families

### Structural
`PART_OF`, `CONTAINS`, `INSTANCE_OF`, `IMPLEMENTS`, `EXTENDS`, `REPLACES`, `SUPERSEDES`

### Dependency
`DEPENDS_ON`, `REQUIRED_BY`, `USES`, `PROVIDES`, `CONSUMES`, `GENERATES`

### Ownership and Responsibility
`OWNED_BY`, `MANAGED_BY`, `APPROVED_BY`, `ASSIGNED_TO`, `BELONGS_TO`

### Location and Topology
`LOCATED_IN`, `HOSTED_ON`, `DEPLOYED_ON`, `CONNECTED_TO`, `SERVES`, `PROTECTS`

### Security and Identity
`AUTHENTICATED_BY`, `AUTHORIZED_BY`, `GOVERNED_BY`, `SECURED_BY`

### Operations
`MONITORED_BY`, `BACKED_UP_BY`, `RESTORED_BY`, `TRIGGERS`, `AFFECTS`, `REMEDIATES`

### Knowledge and Provenance
`DOCUMENTED_BY`, `EVIDENCED_BY`, `DERIVED_FROM`, `RELATED_TO`

## Relationship Record

A relationship assertion should support, where useful:

- source object;
- relationship type;
- target object;
- provenance/source system;
- confidence;
- effective time;
- expiration/retirement;
- owner;
- notes.

## Governance

New relationship types require review. Synonyms must not be casually introduced because semantic consistency is essential for AI reasoning, search, synchronization, and impact analysis.

PCI may map its relationship vocabulary to external ontologies or schemas where that improves interoperability. The PCI vocabulary remains a semantic layer, not a database-specific implementation.
