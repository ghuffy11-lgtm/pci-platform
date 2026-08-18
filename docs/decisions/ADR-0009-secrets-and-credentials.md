# ADR-0009 — Secrets and Credentials

**Status:** Accepted
**Date:** 2026-08-18

## Decision

Secrets must never be stored in Git, knowledge objects, prompts, logs, tickets, or model context unless explicitly classified as non-secret example data.

PCI will use an externalized secrets-management capability. Services and agents receive short-lived, least-privilege credentials only when required for an approved operation.

Credentials for infrastructure automation must be resolved at execution time and must not be exposed to the reasoning model unnecessarily.

## Consequences

- Repository contents remain safe to share with authorized engineering systems.
- Agent prompts can remain credential-free.
- Secret rotation can occur without code changes.
- Production automation requires explicit credential and policy boundaries.
