# PCI Technology Selection Principles

**Status:** Foundation architecture
**Version:** 0.1

## Rule

Select technologies based on standards support, security, maturity, interoperability, operational simplicity, performance, license compatibility, and replaceability.

## Avoid Lock-In

No single AI model, vector store, graph database, container platform, cloud provider, UI framework, or monitoring backend should become an accidental architectural requirement.

## Prefer Standards

Where mature standards exist, use them for identity, telemetry, APIs, events, serialization, and network automation rather than inventing proprietary equivalents.

## Operational Fit

A technically superior component that cannot be reliably operated by the target customer is not automatically the correct PCI component.

## Evolution

Technology decisions are revisitable. ADRs capture the rationale and replacement constraints so future models or infrastructure can be adopted without destabilizing the domain model.
