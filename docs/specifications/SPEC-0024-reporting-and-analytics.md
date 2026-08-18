# SPEC-0024 — Reporting and Analytics

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Provide governed analytical views over PCI's canonical state, events, operational evidence, and business-domain data.

## Requirements

- Reports identify source data and time range.
- Access follows the same authorization model as operational queries.
- Derived metrics expose calculation definitions.
- Historical reports remain reproducible where source data is retained.
- Dashboards are projections, not alternate sources of truth.
- Analytics workloads must not degrade critical operational services.

## AI Integration

AI may summarize reports or answer analytical questions, but calculations requiring exactness should use deterministic query/analytics services rather than model arithmetic.

## Acceptance Criteria

An authorized user can produce operational and management reports whose figures can be traced to governed source data and whose access is auditable.
