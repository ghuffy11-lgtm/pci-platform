# PCI Knowledge Quality Standard

**Status:** Foundation specification
**Version:** 0.1

## Quality Dimensions

Every governed fact may be evaluated across:

- **Correctness** — whether evidence supports the claim.
- **Freshness** — how recently the source was observed.
- **Completeness** — whether required fields are present.
- **Provenance** — whether the origin and transformations are known.
- **Confidence** — confidence in interpretation or extraction.
- **Authority** — whether the source is authoritative for the concept.
- **Consistency** — whether related objects agree.

## Quality States

Proposed, validated, authoritative, conflicting, stale, deprecated.

## AI Rule

Model confidence is not evidence confidence. AI-generated content must retain its source context and validation state.

## Operational Use

Retrieval and automation may apply quality thresholds. High-risk actions should require stronger evidence than informational responses.

## Acceptance Criteria

The platform can identify why a fact is trusted, when it was last observed, where it came from, and whether it is suitable for the requested operation.
