# PCI Testing Strategy

## Testing Pyramid

### Unit

Validate pure domain logic, policy evaluation, transformations, schemas, and parsers.

### Contract

Validate API, event, connector, and model-runtime contracts.

### Integration

Validate real service interactions using controlled dependencies.

### System

Validate end-to-end workflows across identity, knowledge, AI, agents, and external systems.

### Operational

Validate backup/restore, upgrades, observability, failure recovery, and deployment procedures.

### Security

Validate authorization boundaries, tenant isolation, secret handling, prompt/tool boundaries, and high-risk execution controls.

## Agent Testing

Agent behavior must be tested against deterministic scenarios where possible. Tests must verify both the desired action and prohibited actions. Tool access must be mocked or isolated during reasoning tests and exercised against lab systems during integration tests.

## Network Automation Testing

Production network mutation is prohibited in automated tests. Vendor connectors are tested against simulators, fixtures, or dedicated lab devices before Customer Zero deployment.

## Release Gate

A release cannot be considered production-ready without passing required functional, security, migration, backup/restore, and observability checks.
