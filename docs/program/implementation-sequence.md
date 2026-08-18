# PCI Implementation Sequence

**Status:** Baseline roadmap
**Version:** 0.1

## Phase 0 — Repository and Governance

Constitution, ADRs, specifications, CI, coding-agent rules, security baseline.

## Phase 1 — Platform Kernel

Identity integration, policy engine, Knowledge Object service, provenance, events, audit, configuration, tenant context, API contracts.

## Phase 2 — Data and Knowledge

Ingestion, document processing, search, relationship queries, knowledge quality, context assembly.

## Phase 3 — AI Runtime

Model registry, evaluation, routing, local inference adapters, agent context, memory, tool discovery.

## Phase 4 — Agent Runtime

Workflow engine, approval gates, connector execution, evidence, emergency stop, bounded autonomy.

## Phase 5 — Customer Zero Domains

Network, monitoring, Helpdesk, Enterprise Knowledge, Facilities, Biomedical, Security Operations.

## Phase 6 — Productization

Installation, upgrades, HA, DR, licensing, extension packaging, documentation, supportability, deployment profiles.

## Sequencing Rule

Do not implement broad autonomous behavior before policy, audit, identity, and execution boundaries are working. Do not optimize model selection before the platform can measure task outcomes.
