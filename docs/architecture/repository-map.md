# PCI Repository Map

**ID:** ARCH-REPO-0001  
**Status:** Founding

```text
/
├── AGENTS.md
├── README.md
├── knowledge/
│   ├── governance/
│   ├── model/
│   └── examples/
└── docs/
    ├── architecture/
    ├── decisions/
    ├── engineering/
    ├── operations/
    ├── product/
    ├── program/
    ├── security/
    ├── specifications/
    └── templates/
```

## Directory Responsibilities

### `knowledge/`
Canonical structured knowledge, governance records, model definitions, and examples.

### `docs/architecture/`
Architecture descriptions and system-level design.

### `docs/decisions/`
Architecture Decision Records.

### `docs/engineering/`
Engineering process and agent implementation rules.

### `docs/operations/`
Deployment, backup, recovery, and operational design.

### `docs/security/`
Security architecture, threat models, and security requirements.

### `docs/specifications/`
Approved technical specifications ready for implementation.

### `docs/templates/`
Templates for recurring engineering artifacts.

### `AGENTS.md`
Repository-wide instructions for coding agents.

## Future Code Layout

Production code directories are intentionally not created until the platform runtime architecture is sufficiently specified. This prevents early implementation choices from becoming accidental architecture.
