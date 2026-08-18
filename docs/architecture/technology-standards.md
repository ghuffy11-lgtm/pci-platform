# PCI Technology and Standards Baseline

**ID:** ARCH-STANDARDS-0001  
**Status:** Founding Baseline

PCI uses existing standards wherever they provide a mature interoperability contract.

| Concern | Preferred standard / approach | PCI position |
|---|---|---|
| Linked knowledge | JSON-LD 1.1 | Candidate canonical interchange format; semantics must remain storage-neutral |
| Provenance | W3C PROV family | Reuse concepts for source, activity, agent, derivation and provenance |
| API description | OpenAPI | Required for externally consumed HTTP APIs where applicable |
| Architecture views | C4 model | Preferred vocabulary for software architecture views |
| Identity | OpenID Connect / OAuth 2.x family | Prefer standards-based identity rather than proprietary auth |
| Observability | OpenTelemetry | Preferred telemetry model and instrumentation boundary |
| AI tool/context integration | MCP where appropriate | Prefer the protocol for standardized model-to-tool/context integration when it fits the use case |
| Version control | Git | Canonical engineering source and history |
| Containers | OCI-compatible images | Avoid runtime-specific image assumptions |

## Important Boundary

A standard is not automatically a requirement. PCI adopts a standard when it fits the problem, is sufficiently mature, and does not create unacceptable operational or licensing constraints.

## Serialization Decision

JSON-LD 1.1 is a W3C Recommendation and is therefore preferred over treating the earlier YAML-LD proposal as a normative dependency. YAML may still be used as a human-friendly authoring format if a deterministic, validated transformation to the canonical representation is established.

## Review Rule

Standards are periodically reviewed. A newer or better standard may replace an existing choice through an ADR rather than through silent implementation changes.
