# PCI Repository Map

The repository is organized around engineering knowledge and implementation boundaries, not around a flat documentation folder.

## Top-Level Areas

```text
pci-platform/
├── knowledge/
│   ├── governance/       # Constitution and governance objects
│   ├── product/          # Product vision and product-level knowledge
│   ├── architecture/     # Architecture principles and views
│   ├── model/            # Knowledge Object and Reality Model definitions
│   ├── decisions/        # ADRs
│   ├── engineering/      # Engineering standards and agent rules
│   ├── roadmap/          # Program roadmap and milestones
│   ├── templates/        # ADR/SPEC/RFC and future object templates
│   └── ...               # Additional knowledge domains as the model evolves
├── platform/             # Future PCI platform implementation
├── applications/         # Future domain/application implementations
├── integrations/         # Future connectors and external system adapters
├── deployment/           # Future deployment/install/upgrade automation
├── tests/                # Future automated tests
└── .github/              # Future CI/CD and repository governance
```

## Repository Rule

Knowledge and implementation are related but distinct. Production code must implement approved knowledge objects/specifications; it must not become the hidden source of architectural truth.

## Future Evolution

This structure is intentionally provisional. Once the Knowledge Fabric implementation is designed, some knowledge objects may be generated, indexed, or materialized into databases while Git remains the versioned canonical engineering source.
