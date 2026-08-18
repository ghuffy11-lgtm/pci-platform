# SPEC-0007 — Event Model

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Define a common event envelope for changes, observations, commands, lifecycle transitions, and integration activity.

## Event Envelope

Each event should carry:

- event ID;
- event type;
- occurrence time;
- producer identity;
- subject object;
- related objects;
- correlation ID;
- causation ID where known;
- payload version;
- payload;
- provenance.

## Requirements

Events are immutable facts. Current object state is derived or represented separately. Consumers must be able to ignore unknown event types safely and support schema evolution.

## Acceptance Criteria

An event can be published, correlated to an object and workflow, consumed by multiple services, and retained as historical evidence without requiring consumers to share a database.
