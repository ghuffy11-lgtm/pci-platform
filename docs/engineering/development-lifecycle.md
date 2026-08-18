# PCI Development Lifecycle

**ID:** ENG-LIFECYCLE-0001  
**Status:** Founding

## Standard Flow

```text
Idea
 -> Research
 -> RFC (if architecture/product direction changes)
 -> ADR (if architectural decision is required)
 -> SPEC
 -> Work Package / Task
 -> Implementation
 -> Tests
 -> Security / Operational Validation
 -> Knowledge Update
 -> Release
 -> Operational Feedback
```

## Definition of Ready

A task is ready when its objective, scope, acceptance criteria, dependencies, constraints, and relevant architecture are known.

## Definition of Done

A task is done only when implementation, tests, validation, documentation/knowledge updates, and known limitations have been recorded.

## Change Classes

### Routine
Fits approved architecture and specification. Implement normally.

### Architectural
Changes boundaries, standards, data semantics, security model, or major dependencies. Requires RFC/ADR review.

### Emergency
Required to protect availability/security. May bypass normal sequence temporarily, but must be documented and reviewed afterward.

## Release Principle

A release is a validated, reproducible state of the platform—not merely a collection of merged commits.
