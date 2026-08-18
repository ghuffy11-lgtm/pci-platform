# PCI High Availability Architecture

**Status:** Foundation architecture
**Version:** 0.1

## Goal

Keep PCI available when individual application processes, workers, storage projections, or integration endpoints fail.

## Principles

- Avoid single-process state.
- Persist authoritative state outside ephemeral workers.
- Treat search indexes, caches, and derived projections as rebuildable.
- Use health checks and dependency-aware startup.
- Make failover behavior explicit per component.
- Do not claim HA where the underlying storage layer is a single point of failure.

## Logical Tiers

```text
Clients
  |
API / Gateway
  |
Stateless Services ---- Workers
  |                       |
  +------ Knowledge ------+
  |         |
Transactional Storage   Object Storage
  |
Events / Queues
```

## Initial Deployment

Customer Zero may begin as a single-server installation with redundancy supplied by underlying storage and backups. The architecture must permit later separation of API, worker, storage, and integration tiers.

## Recovery Objectives

Each service must define RTO/RPO targets before being classified as production-critical. Criticality is a product/deployment decision, not an assumed property of every component.

## Acceptance Criteria

A failed stateless service can be restarted without loss of authoritative state, and derived indexes can be rebuilt from retained canonical data.
