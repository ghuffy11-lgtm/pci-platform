# ADR-0010 — Domain Boundaries

**Status:** Accepted
**Date:** 2026-08-18

## Decision

PCI will organize business and technical capabilities into bounded domains. Domains own their concepts, policies, workflows, and integration contracts. Cross-domain behavior occurs through explicit APIs, events, or knowledge relationships rather than direct database coupling.

Initial domains include Platform, Identity, Knowledge, AI, Automation, Network, Helpdesk, Facilities, Biomedical, and Enterprise Knowledge. Additional domains may be introduced without changing the kernel.

## Consequences

- Domain ownership becomes explicit.
- Applications can evolve independently.
- Customer-specific capabilities can be added without modifying the core kernel.
- Direct coupling between domain databases is prohibited.
