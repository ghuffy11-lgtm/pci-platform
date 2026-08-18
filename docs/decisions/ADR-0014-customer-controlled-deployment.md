# ADR-0014 — Customer-Controlled Deployment

**Status:** Accepted
**Date:** 2026-08-18

## Decision

PCI's core product architecture will support customer-controlled deployment with no mandatory dependency on a public cloud or remote AI service. Internet connectivity may be used for optional updates, integrations, or model acquisition when the customer permits it.

## Rationale

PCI is intended for organizations where operational and internal knowledge may not leave their environment.

## Consequences

- Offline and air-gapped operation are architectural requirements.
- Installation artifacts must be manageable offline.
- AI runtime abstraction is mandatory.
- Cloud-only dependencies are prohibited in the core path.
