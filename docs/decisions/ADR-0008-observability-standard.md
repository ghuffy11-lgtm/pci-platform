# ADR-0008 — Observability Standard

**Status:** Accepted
**Date:** 2026-08-18

## Decision

PCI will use OpenTelemetry-compatible telemetry as its observability abstraction for traces, metrics, and logs where supported. Applications must emit structured telemetry with correlation identifiers sufficient to reconstruct user, agent, workflow, service, and infrastructure activity.

Vendor-specific observability backends are implementation choices behind the telemetry abstraction.

## Consequences

- Observability remains portable.
- Distributed workflows can be correlated.
- Agent actions can be tied to operational evidence.
- Monitoring backends can change without redesigning application instrumentation.
