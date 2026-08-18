# SPEC-0018 — Monitoring and Health

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Correlate telemetry and health observations with the Reality Model so PCI can reason about operational state.

## Requirements

- Ingest metrics, logs, traces, alerts, and health observations through adapters.
- Associate observations with Knowledge Objects.
- Preserve observation time and source.
- Support current state and historical trends.
- Detect health changes and emit events.
- Distinguish monitoring evidence from inferred diagnosis.
- Avoid making a single monitoring backend the source of organizational truth.

## AI Integration

AI may summarize and correlate observations, but critical operational conclusions should retain the underlying evidence and confidence.

## Acceptance Criteria

An operational observation can be associated with an asset or service, correlated with related events and dependencies, and presented to humans or agents with source and time context.
