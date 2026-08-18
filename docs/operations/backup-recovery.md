# PCI Backup and Recovery Strategy

**ID:** OPS-BCP-0001  
**Status:** Founding Policy

## Principle

A backup that has never been restored is an assumption, not a recovery capability.

## Data Classes

1. Canonical knowledge and configuration.
2. Operational databases.
3. Customer documents and indexed data.
4. Model artifacts and caches.
5. Audit and security records.
6. Deployment definitions and secrets metadata.

## Requirements

- Define retention by data class.
- Encrypt backups where appropriate.
- Keep backups independent from primary storage failure.
- Test restores regularly.
- Document recovery order and dependencies.
- Record recovery evidence.

## Recovery Priority

1. Identity and authorization.
2. Knowledge model and metadata.
3. Core platform services.
4. Operational data.
5. Integrations.
6. Derived indexes/caches.

Derived data must be rebuildable whenever practical.

## Disaster Recovery

Recovery objectives (RPO/RTO) will be defined per deployment tier rather than invented as a single universal value.
