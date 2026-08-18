# PCI API and Event Standards

**Status:** Foundation architecture
**Version:** 0.1

## API Principles

- Resource identifiers are stable.
- APIs are versioned when compatibility requires it.
- Errors are structured and machine-readable.
- Authorization context is never optional for protected resources.
- Pagination, filtering, sorting, and idempotency behavior are explicit.
- Mutating operations return evidence identifiers where appropriate.
- API contracts are independent of storage implementation.

## Event Principles

- Events represent facts that occurred.
- Events carry event ID, type, time, producer, subject, correlation, causation where known, schema version, and payload.
- Consumers must tolerate unknown fields and future event types.
- Duplicate delivery must be safe to handle.
- Event schemas are versioned.

## Compatibility

Breaking changes require a migration path or new contract version. Existing historical events remain readable.

## Acceptance Criteria

A service can consume an API or event contract without knowing internal database structures, and failures can be diagnosed from structured request/event identifiers.
