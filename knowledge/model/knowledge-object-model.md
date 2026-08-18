# PCI Knowledge Object Model

**ID:** MODEL-KO-0001  
**Status:** Proposed Foundation  
**Scope:** Engineering knowledge first; organizational reality later

## Purpose

PCI will represent important concepts as connected Knowledge Objects rather than treating documents as the primary unit of meaning.

A Knowledge Object has identity, type, lifecycle, metadata, provenance, and relationships. Human-readable documents are views or projections of structured knowledge, not the only source of truth.

## Foundational Object Types

### Governance

- Constitution
- Principle
- Standard
- Policy
- Decision
- Risk
- Issue

### Engineering

- Capability
- Domain
- Module
- Service
- Component
- Connector
- Provider
- Technology
- API
- Event
- Workflow
- Agent
- Model
- Specification
- Test
- Release

### Organizational Reality

- Organization
- Person
- Role
- Department
- Location
- Site
- Building
- Asset
- Device
- Application
- Service
- Knowledge Source
- Contract

## Canonical Object Fields

Every object should be able to expose, as applicable:

- `id` — immutable canonical identifier;
- `type` — controlled object type;
- `name` — human-readable name;
- `description` — concise semantic description;
- `status` — lifecycle state;
- `owner` — accountable owner;
- `created_at` / `updated_at` — lifecycle timestamps;
- `source` — provenance;
- `version` — object version;
- `relationships` — typed links to other objects;
- `policies` — applicable controls;
- `events` — relevant history;
- `metadata` — type-specific attributes.

Not every object type must expose every field. The model must support type-specific schemas without losing common identity and relationship semantics.

## Identity Principle

An identifier must be immutable and never reused. Renaming an object must not create a new identity. Retirement preserves historical identity.

## Lifecycle

The default lifecycle is:

`Proposed -> Draft -> Reviewed -> Approved -> Operational -> Deprecated -> Retired`

Not every object uses every state.

## Provenance

Knowledge must be traceable to its source where practical. Sources may include Git artifacts, APIs, configuration inventories, monitoring systems, helpdesk systems, human validation, or approved imports.

## Important Constraint

This model is intentionally **not yet bound to a particular database or graph technology**. Storage and query technologies will be selected after standards and implementation options are evaluated.
