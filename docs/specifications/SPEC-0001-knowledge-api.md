# SPEC-0001 — Knowledge Service API

**Status:** Approved for foundation design  
**Version:** 0.1

## Purpose

Expose validated Reality Model operations to platform services, applications, and agents.

## Required Capability Groups

- Object lookup by canonical ID.
- Object creation and update.
- Relationship creation/removal.
- Search/filter.
- Relationship traversal.
- Provenance retrieval.
- Temporal queries.
- Change history.
- Context packaging for AI.

## API Principles

- API contracts are documented using OpenAPI where applicable.
- Authentication and authorization are delegated to the platform identity boundary.
- Mutations are attributable to a user, service, or agent identity.
- Validation occurs before persistence.
- Sensitive fields are subject to policy-based filtering.

## AI Context Contract

An AI context package must identify:

- requested question/task;
- retrieved objects;
- relationships traversed;
- provenance;
- confidence;
- authorization scope;
- retrieval timestamp.

The model must not be presented with retrieved information as inherently authoritative without its provenance metadata.

## Acceptance Criteria

A foundation implementation can create two objects, connect them with a typed relationship, retrieve the graph neighborhood, and return provenance and authorization metadata in one deterministic request.
