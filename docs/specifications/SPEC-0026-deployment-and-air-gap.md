# SPEC-0026 — Deployment and Air-Gapped Operation

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Define a repeatable deployment model for customer-controlled, private, disconnected, and optionally air-gapped environments.

## Requirements

- Support installation without public-cloud dependency for core operation.
- Make all external dependencies explicit.
- Support offline artifact acquisition and verification.
- Separate management, data, and execution planes.
- Provide configuration as code where practical.
- Support health checks and deterministic startup ordering.
- Provide secure initial bootstrap and credential rotation.
- Document upgrade procedures for disconnected environments.

## Initial Deployment Target

Ubuntu Server with containerized services is an acceptable initial implementation environment. The application architecture must remain independent of that operating system and container runtime.

## Acceptance Criteria

A customer can install PCI in a private environment, operate core capabilities without internet access, verify artifact integrity, back up the system, and perform an upgrade using controlled offline artifacts.
