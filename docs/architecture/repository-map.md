# PCI Repository Map

**ID:** ARCH-REPO-0001  
**Status:** Founding

```text
/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── knowledge/
│   ├── governance/
│   ├── model/
│   └── examples/
├── docs/
│   ├── architecture/
│   ├── decisions/
│   ├── engineering/
│   ├── knowledge/
│   ├── operations/
│   ├── product/
│   ├── program/
│   ├── security/
│   ├── specifications/
│   └── templates/
├── services/
│   └── kernel/
├── deploy/
│   ├── bootstrap/
│   └── compose/
└── implementation/
    ├── blockers/
    ├── comms/
    ├── decisions/
    ├── discoveries/
    ├── operations/
    ├── reports/
    └── status/
```

## Directory Responsibilities

### `knowledge/`
`knowledge/governance/constitution.md` is authoritative for the PCI Constitution. Other
governance content in this tree is legacy and does not override `docs/`; see the Governance Tree
Authority section of `AGENTS.md`.

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

### `docs/program/`
Programme management, implementation sequencing, and work packages.
`docs/program/work-packages/` is the canonical work-package location.

### `docs/templates/`
Templates for recurring engineering artifacts.

### `services/`
Deployable platform services. Each subdirectory is one independently buildable service.
`services/kernel/` is the WP-0001 platform kernel.

### `deploy/`
Deployment topology and orchestration definitions. `deploy/compose/` holds the Docker Compose
stack and `deploy/bootstrap/` the host bootstrap script. Persistent runtime state belongs under
the `/data/docker` boundary defined in
`docs/operations/pci-server-bootstrap.md`, never inside the repository.

### `implementation/`
Claude Code's implementation communication channel: status, reports, blockers, discoveries,
proposed decisions, and direct messages to the architecture lead. Mandated by `CLAUDE.md`.
`implementation/operations/CLAUDE-TASKS.md` is the authoritative execution queue: every session
reads it at startup and executes the highest-priority READY task.

### `AGENTS.md`
Repository-wide instructions for coding agents.

### `CLAUDE.md`
Permanent Claude Code operating rules, authority order, and communication protocol.

## Code Layout

Production code directories were intentionally withheld until the platform runtime architecture
was sufficiently specified, so that early implementation choices could not become accidental
architecture. That gate was lifted by the approval of WP-0001, which specifies the kernel runtime
and mandates a service layout. `services/`, `deploy/`, and `implementation/` exist under that
authority, ratified in `implementation/comms/MSG-0005-architecture-lead-decisions.md`.

New top-level code areas still require an approved work package or ADR.
