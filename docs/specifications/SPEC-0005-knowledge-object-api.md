# SPEC-0005 — Knowledge Object API

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Define the service contract for creating, reading, updating, relating, versioning, and querying PCI Knowledge Objects.

## Core Operations

- Create object
- Retrieve object
- Update object
- Retire object
- Create relationship
- Remove relationship
- Query by type, identity, relationship, provenance, and time
- Retrieve object history
- Validate object against its type schema

## Requirements

Every object must have a stable identifier, type, lifecycle state, provenance, timestamps, and ownership context. Mutating operations must be attributable to a human or service identity.

## Design Constraint

The API is a domain contract. Storage technology must remain replaceable behind it.

## Acceptance Criteria

A client can create a Knowledge Object, establish relationships, query its neighborhood, retrieve its history, and determine the provenance of its current state through a stable API.
