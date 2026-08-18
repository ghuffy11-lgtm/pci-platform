# ADR-0002 — Integrate Before Invent

**Status:** Accepted  
**Date:** 2026-08-18  
**Owner:** PCI Architecture

## Context

PCI must remain maintainable, portable, and low-cost. Reimplementing mature identity, API, telemetry, serialization, and protocol capabilities creates unnecessary risk.

## Decision

PCI will adopt mature open standards and open-source components when they satisfy requirements. PCI-specific invention is reserved for genuine gaps in the platform's mission.

## Consequences

PCI will have stronger interoperability and lower maintenance burden, but engineers must evaluate standards carefully rather than adopting technology by popularity alone.

## Examples

Prefer standards such as OpenAPI, OpenTelemetry, JSON-LD, OpenID Connect, and MCP where applicable. Exact versions are selected during implementation based on current upstream status.
