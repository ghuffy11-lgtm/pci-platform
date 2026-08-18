# PCI Observability

## Goals

PCI must be able to answer:

- Is the platform healthy?
- What changed?
- Who or what caused the change?
- Which workflow is executing?
- Which dependency is failing?
- What did an agent do?
- What evidence proves the result?

## Telemetry

Use OpenTelemetry-compatible instrumentation for traces, metrics, and logs where supported.

## Required Correlation

Telemetry should support correlation across:

- request ID;
- workflow ID;
- agent execution ID;
- tool invocation ID;
- Knowledge Object ID;
- tenant/organization ID;
- deployment/environment.

## Agent Observability

Every tool invocation must emit start, completion/failure, authorization, and result metadata. Sensitive payloads must be redacted or excluded.

## Operational Views

The platform should provide health, dependency, capacity, error, audit, and agent-execution views without making any one observability backend the canonical source of organizational truth.
