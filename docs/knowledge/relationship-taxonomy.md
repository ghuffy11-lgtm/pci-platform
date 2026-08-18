# PCI Relationship Taxonomy

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Define controlled relationship semantics so the Reality Model represents meaningful connections rather than arbitrary links.

## Core Relationship Families

### Organizational

OWNS, MANAGES, MEMBER_OF, REPORTS_TO, RESPONSIBLE_FOR

### Physical

LOCATED_IN, CONTAINS, INSTALLED_AT, CONNECTED_TO, ADJACENT_TO

### Technical

DEPENDS_ON, HOSTS, RUNS_ON, EXPOSES, CONNECTS_TO, MONITORED_BY

### Service

SUPPORTS, PROVIDED_BY, AFFECTS, USED_BY, ASSIGNED_TO

### Governance

GOVERNED_BY, REQUIRES, AUTHORIZED_BY, APPROVED_BY, EXEMPTED_BY

### Knowledge

DOCUMENTED_BY, DERIVED_FROM, EVIDENCED_BY, RELATED_TO, SUPERSEDES

### Operational

GENERATED, RESOLVED_BY, CHANGED_BY, IMPACTS, TRIGGERS

## Rules

Relationships have identifiers and may carry provenance, effective time, confidence, and ownership. Domain-specific relationships may be added when their semantics cannot be expressed safely through an existing relationship.

## Acceptance Criteria

A relationship can be queried and interpreted consistently by humans, services, and agents without depending on undocumented application-specific meanings.
