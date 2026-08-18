# PCI Installation Architecture

**Status:** Foundation operational specification
**Version:** 0.1

## Goal

Provide repeatable installation for customer-controlled environments without embedding assumptions about a single hardware layout.

## Installation Layers

```text
Hardware / VM
  -> OS
  -> Container Runtime
  -> Persistent Storage
  -> Core Services
  -> Identity
  -> Knowledge
  -> AI Runtime
  -> Connectors / Domains
  -> Bootstrap Configuration
```

## Requirements

- Validate hardware and OS prerequisites before installation.
- Separate system and persistent application data.
- Use explicit storage paths for high-growth data.
- Never store production secrets in deployment files.
- Provide deterministic service health checks.
- Record installation version and configuration baseline.
- Support offline installation artifacts.
- Provide uninstall/rollback documentation.

## Initial Reference Environment

The initial PCI development/customer-zero environment may use Ubuntu Server and Docker. This is an implementation baseline, not a permanent architectural dependency.

## Acceptance Criteria

A fresh host can be installed from documented prerequisites and artifacts, initialized securely, verified through health checks, and handed over with a known configuration baseline.
