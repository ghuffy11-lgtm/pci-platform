# WP-0001 — PCI Kernel Foundation

**Status:** COMPLETE
**Owner:** Engineering / Claude Code
**Priority:** P0

## Objective

Create the first runnable PCI platform slice that establishes the transactional foundation for Knowledge Objects, relationships, provenance, audit, tenant context, and a stable API contract.

## Source Authority

- Constitution
- Platform Kernel Architecture
- Canonical Knowledge Object Schema
- SPEC-0005 Knowledge Object API
- SPEC-0006 Audit and Evidence
- SPEC-0007 Event Model
- SPEC-0010 Tenant and Data Isolation
- SPEC-0011 Policy and Authorization
- SPEC-0012 Workflow Engine
- SPEC-0004 Identity Service

## Scope

1. Establish an application/service layout consistent with the repository architecture.
2. Establish local development and container orchestration for the kernel.
3. Establish PostgreSQL as the initial transactional store behind service contracts.
4. Implement database migrations.
5. Implement Knowledge Object persistence.
6. Implement typed relationships.
7. Implement provenance records.
8. Implement audit records.
9. Implement tenant context.
10. Implement health/readiness endpoints.
11. Implement the initial Knowledge Object API.
12. Add automated unit, integration, and contract tests.
13. Add structured logging and correlation IDs.
14. Document local development and test execution.

## Non-Scope

- Production identity provider integration beyond an adapter boundary.
- Ollama/model integration.
- Agent reasoning.
- Network device connectivity.
- UI.
- Production HA.
- Kubernetes.

## Required Architectural Properties

- Storage implementation is behind a service/repository boundary.
- Secrets are externalized and absent from source control.
- Tenant context is explicit in protected operations.
- Knowledge Object IDs are stable and never reused.
- Relationships reference object IDs rather than duplicating objects.
- Provenance and audit are append-oriented historical records.
- Derived indexes must not become the canonical source of truth.

## Initial Object Types

Implement only the minimum types needed for the kernel demonstration:

- Organization
- Person
- Service
- Asset
- Document
- Policy
- Agent

The type registry remains extensible; do not implement every future domain type in this work package.

## Acceptance Criteria

### AC-01 — Build

A clean checkout can build the development environment from documented instructions.

### AC-02 — Database

A clean environment can initialize the database from migrations without manual schema editing.

### AC-03 — Create Object

An authorized API caller can create a Knowledge Object with identity, type, ownership, classification, lifecycle state, and provenance.

### AC-04 — Relationships

An authorized caller can create and query a typed relationship between two existing objects.

### AC-05 — Tenant Isolation

A request operating in tenant A cannot retrieve or mutate tenant B objects.

### AC-06 — Audit

A mutation produces an auditable record containing actor, action, target, time, correlation ID, and result without exposing secrets.

### AC-07 — Validation

Invalid object types, malformed relationships, missing required fields, and unauthorized operations are rejected deterministically.

### AC-08 — Health

The service exposes health/readiness information without revealing secrets or sensitive configuration.

### AC-09 — Tests

Unit, integration, and API contract tests pass in a clean environment.

### AC-10 — Evidence

The implementation references this work package and its source specifications, and the completion report records changed files, tests, assumptions, and unresolved issues.

## Implementation Guidance

Claude Code may choose the language/framework after inspecting the repository and current supported tooling, but the choice must be justified against the Technology Selection Principles and recorded in an ADR if it creates a significant architectural commitment.

Prefer boring, maintainable technology. Do not introduce a framework, database, queue, vector store, graph database, or cloud service merely because it may be useful later.

## Completion Gate

WP-0001 is complete only when all acceptance criteria pass and the resulting implementation has been reviewed against the Constitution and referenced specifications.
