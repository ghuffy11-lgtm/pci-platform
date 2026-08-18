# PCI Release Management

## Release Principles

Releases are reproducible, traceable, testable, and reversible where practical.

## Required Release Metadata

- version;
- source commit;
- build provenance;
- included capabilities;
- schema/API changes;
- security changes;
- migration requirements;
- known limitations;
- rollback plan.

## Environments

```text
Development -> Integration -> Lab -> Customer Zero -> Production
```

Production promotion requires evidence from the appropriate prior environment. Network mutation capabilities must pass lab validation before Customer Zero use.

## Versioning

Platform releases, Knowledge Object schemas, APIs, events, connectors, and AI models have independent version identities. Compatibility rules are documented rather than inferred from package versions alone.
