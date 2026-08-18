# ADR-0012 — Workflow as Governed Execution

**Status:** Accepted
**Date:** 2026-08-18

## Decision

Privileged multi-step operations will execute through the workflow engine rather than directly from agent reasoning code. Authorization, approval, retries, compensation, evidence, and verification are workflow concerns.

## Rationale

This creates one enforcement path for network changes, helpdesk remediation, security response, and future operational domains.

## Consequences

- Agents remain planners/delegators rather than privileged runtimes.
- Execution becomes observable and recoverable.
- High-risk actions can pause for approval.
- New domains reuse the same governance machinery.
