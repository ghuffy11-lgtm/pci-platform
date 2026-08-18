# PCI Domain Architecture

## Purpose

Define bounded domains and the rules governing interaction between them.

## Core Domains

| Domain | Responsibility |
|---|---|
| Platform | Runtime, configuration, lifecycle, installation |
| Identity | Authentication, authorization context, federation |
| Knowledge | Reality Model, Knowledge Objects, provenance, queries |
| AI | Model routing, inference, evaluation, context assembly |
| Agent | Planning, tool use, execution governance |
| Automation | Workflows, schedules, approvals, remediation |
| Network | Network discovery, topology, configuration, validation |
| Helpdesk | Tickets, requests, incidents, service workflows |
| Facilities | Buildings, rooms, utilities, maintenance |
| Biomedical | Medical equipment, maintenance, calibration, service history |
| Enterprise Knowledge | Internal documents, policies, procedures, organizational knowledge |
| Observability | Telemetry, health, events, operational evidence |

## Rules

1. A domain owns its concepts and policies.
2. Domains do not share databases directly.
3. Cross-domain access uses APIs, events, or governed knowledge relationships.
4. Domain-specific UI must not become the canonical data model.
5. Domain objects must participate in the Reality Model.
6. Domain integrations must be replaceable.

## Customer Zero

The first non-platform domains to validate are Network and Helpdesk, followed by Facilities and Biomedical. This reflects the intended operational use case while keeping the platform kernel domain-neutral.
