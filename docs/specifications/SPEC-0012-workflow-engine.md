# SPEC-0012 — Workflow Engine

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Provide durable, observable orchestration for multi-step work performed by humans, services, or agents.

## Requirements

- Represent workflows as versioned definitions.
- Support sequential, conditional, parallel, retry, timeout, approval, compensation, and failure paths.
- Preserve workflow state independently of a worker process.
- Carry tenant, actor, correlation, and authorization context.
- Emit lifecycle events.
- Prevent duplicate execution of non-idempotent actions.
- Support manual intervention and resume.
- Record inputs, decisions, tool invocations, outputs, and evidence.

## Agent Integration

Agents may propose or initiate workflows, but workflow policy and execution authority remain outside the model.

## Acceptance Criteria

A workflow can survive worker restart, resume from a durable state, enforce an approval gate, execute a governed tool, and produce complete evidence of the run.
