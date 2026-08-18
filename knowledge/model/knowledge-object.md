# Knowledge Object Specification

**ID:** SPEC-KO-0001  
**Status:** Founding Draft  
**Version:** 0.1

## Purpose

A Knowledge Object (KO) is PCI's canonical representation of a real, conceptual, operational, architectural, or governance entity.

## Core Rule

Every significant entity represented by PCI must have a stable canonical identity. Other views and integrations reference that identity rather than creating competing identities.

## Required Fields

```yaml
id: "pci:object/<stable-id>"
type: "<controlled-type>"
name: "<human-readable-name>"
status: "proposed|active|deprecated|retired"
version: 1
created_at: "<timestamp>"
updated_at: "<timestamp>"
owner: "<object-id>"
```

## Optional Fields

- description
- classification
- source
- external_identifiers
- tags
- attributes
- relationships
- provenance
- policies
- lifecycle
- confidence

## Identity

PCI must not encode mutable business attributes into the canonical identifier. External identifiers may be retained as mappings.

## Provenance

Objects derived from external systems must record source and synchronization provenance. Where practical, PCI should align provenance representation with W3C PROV concepts rather than inventing an incompatible provenance model.

## Knowledge Quality

Objects should be evaluated for ownership, completeness, freshness, accuracy, provenance, relationship coverage, and confidence.

## Lifecycle

```text
PROPOSED -> DRAFT -> REVIEWED -> APPROVED -> ACTIVE -> DEPRECATED -> RETIRED
```

Lifecycle transitions must be attributable and auditable.

## Technology Neutrality

This specification defines semantics, not a mandatory storage engine. JSON-LD is a candidate interchange representation because it is a W3C Recommendation for Linked Data. The canonical model must remain independent of any particular database or serialization format.
