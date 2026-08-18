# ADR-0007 — Identity and Access Control

**Status:** Accepted
**Date:** 2026-08-18

## Decision

PCI will integrate an established standards-based identity provider rather than implement authentication itself. The platform will use OpenID Connect/OAuth 2.0 compatible identity flows, centralized role/policy evaluation, and service-to-service identities.

PCI applications must not implement password storage, token issuance, or bespoke authentication protocols.

Authorization decisions must remain explicit, auditable, and enforceable at the service boundary. Agent authority must be narrower than the human authority that delegates it.

## Consequences

- Identity becomes replaceable.
- Enterprise SSO integration is a first-class capability.
- Authentication and authorization remain separate concerns.
- Agent execution can be governed by scoped identities and policies.
