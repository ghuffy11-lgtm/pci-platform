# SPEC-0006 — Audit and Evidence

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Provide a tamper-evident record of security-sensitive, administrative, and agent-driven activity.

## Required Evidence

For governed actions, record:

- actor identity;
- actor type (human, service, agent);
- intent/request;
- target object(s);
- policy evaluation;
- authorization/approval;
- tool invocation;
- proposed and actual change;
- timestamps;
- result;
- verification evidence;
- correlation identifiers.

## Requirements

Audit records must not contain secrets. Records must be queryable by object, actor, workflow, and time. Retention must be policy-driven and configurable per deployment.

## Acceptance Criteria

A reviewer can reconstruct a governed operation from request through verification without relying on model memory or application logs alone.
