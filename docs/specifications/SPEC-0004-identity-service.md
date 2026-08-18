# SPEC-0004 — Identity Service

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Provide centralized authentication, identity federation, session/token integration, and authorization context without implementing a proprietary identity system.

## Requirements

- Support OIDC and OAuth 2.0 compatible flows.
- Support enterprise federation where the selected identity provider supports it.
- Provide stable subject identifiers to PCI services.
- Support roles, groups, scopes, and policy attributes.
- Separate authentication from authorization.
- Support service identities.
- Support audit events for authentication and authorization decisions.
- Never expose passwords or long-lived credentials to application services unnecessarily.

## Non-Goals

PCI will not implement a custom password database or proprietary token protocol.

## Acceptance Criteria

A supported identity provider can authenticate a human user, establish a PCI session, authorize a service request, and produce an auditable identity context without PCI owning user passwords.
