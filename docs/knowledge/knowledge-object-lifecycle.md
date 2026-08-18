# Knowledge Object Lifecycle

## States

```text
Proposed -> Draft -> Reviewed -> Approved -> Active -> Deprecated -> Retired
```

## Rules

- Every object has a stable identity.
- State transitions are attributable.
- Deprecated objects remain discoverable for historical integrity.
- Retired objects are not returned as current state unless explicitly requested.
- Schema changes must preserve historical readability.
- Provenance is mandatory for externally derived facts.
- Ownership and review responsibility must be explicit for governed objects.

## Quality Dimensions

PCI evaluates knowledge quality using completeness, correctness, provenance, freshness, confidence, ownership, and relationship coverage.

## AI Use

AI may propose new objects or relationships, but proposal does not equal truth. Validation and governance determine whether AI-generated knowledge becomes authoritative.
