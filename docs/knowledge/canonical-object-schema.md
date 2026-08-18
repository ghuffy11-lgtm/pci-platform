# PCI Canonical Knowledge Object Schema

## Purpose

Define the minimum common envelope shared by all PCI Knowledge Objects while allowing domain-specific fields.

## Envelope

```yaml
id: <stable object identifier>
type: <controlled object type>
name: <human-readable name>
status: <lifecycle state>
ownership:
  organization: <organization id>
  owner: <principal id>
classification: <data classification>
created_at: <timestamp>
updated_at: <timestamp>
valid_from: <timestamp|null>
valid_to: <timestamp|null>
version: <integer>
provenance: []
relationships: []
attributes: {}
```

## Invariants

1. IDs are stable and never reused.
2. Type is controlled by the Knowledge Object type registry.
3. Mutations are versioned.
4. Provenance is required for externally derived facts.
5. Relationships reference object identifiers, not duplicated object records.
6. Secrets are excluded.
7. Domain attributes may extend the envelope without redefining its semantics.

## Serialization

The schema is semantic rather than tied to one serialization. JSON-LD is the preferred interoperable representation where linked-data interchange is required.
