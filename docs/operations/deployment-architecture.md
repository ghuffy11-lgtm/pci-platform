# PCI Deployment Architecture

**ID:** OPS-DEPLOY-0001  
**Status:** Founding Architecture

## Deployment Goals

- Customer-controlled infrastructure.
- Reproducible installation.
- Clear separation of platform data and operating system data.
- Persistent application data independent of container lifecycle.
- Upgrade and rollback paths.
- Offline operation after installation.
- Observable services.

## Initial Reference Environment

The first development/deployment environment is expected to use Ubuntu Server with Docker because the founder is familiar with that operational model. This is a deployment choice, not a permanent architectural dependency.

## Storage Principles

Container writable layers and image caches must not consume the operating-system root filesystem without bounds. Persistent PCI data, model data, knowledge stores, backups, and large artifacts should reside on explicitly managed data storage.

## Deployment Layers

```text
Hardware / VM
    |
Ubuntu Server
    |
Container Runtime
    |
PCI Platform Services
    |
Persistent Data / Knowledge / Models
    |
External Integrations
```

## Operational Requirements

The implementation must eventually provide:

- health checks;
- structured logs;
- metrics and traces;
- backup/restore;
- configuration validation;
- upgrade procedure;
- rollback procedure;
- disaster recovery documentation;
- capacity monitoring.

## Production Rule

No production deployment should rely on manual, undocumented host configuration when the configuration can be safely automated and validated.
