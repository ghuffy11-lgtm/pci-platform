# ADR-0005 — Customer-Controlled and Offline-First Deployment

**Status:** Accepted  
**Date:** 2026-08-18  
**Owner:** PCI Architecture

## Decision

PCI is designed primarily for customer-controlled infrastructure. Core platform operation must not require continuous Internet connectivity after installation.

Optional cloud services, update channels, and external integrations may exist, but they must be explicit and replaceable.

## Consequences

- Local model inference is a first-class deployment option.
- External SaaS dependencies cannot become hidden core dependencies.
- Installation packages and offline update procedures become important product capabilities.
- Observability and support must work within the customer's network boundary.
