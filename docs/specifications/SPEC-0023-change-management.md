# SPEC-0023 — Change Management

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Connect planned changes to authorization, implementation, verification, evidence, and rollback.

## Requirements

- Define change request, plan, risk, approval, execution, verification, and closure states.
- Associate changes with affected Knowledge Objects.
- Require impact analysis for governed changes.
- Support maintenance windows and scheduling.
- Record before/after state where applicable.
- Support rollback or documented recovery procedures.
- Correlate changes with incidents and monitoring events.

## Agent Integration

Agents can analyze, propose, and execute approved changes through governed workflows. They cannot bypass change policy.

## Acceptance Criteria

A production change can be traced from request through impact analysis, approval, execution, verification, and closure, with affected objects and evidence visible to authorized reviewers.
