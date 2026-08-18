# Threat Model — Agentic Operations

## Assets

- Customer data
- Credentials
- Network infrastructure
- Enterprise applications
- Knowledge model
- Audit evidence
- Agent authority

## Threats

### T1 — Prompt Injection

Untrusted content attempts to alter agent behavior.

**Mitigation:** treat retrieved content as untrusted data; keep policy and authority outside model instructions.

### T2 — Excessive Agency

An agent performs an action beyond intended authority.

**Mitigation:** scoped tool permissions, policy evaluation, approval gates, and execution-time enforcement.

### T3 — Credential Exposure

Credentials enter model context or logs.

**Mitigation:** external secrets management and execution-time credential injection.

### T4 — Cross-Tenant Leakage

Agent context includes another organization's data.

**Mitigation:** tenant-aware retrieval and authorization enforced before context assembly.

### T5 — Unsafe Network Change

An incorrect or malicious proposal modifies production infrastructure.

**Mitigation:** target identification, diff generation, validation, approval, backup, execution, verification, and audit.

### T6 — Tool Compromise

A connector behaves outside its declared contract.

**Mitigation:** connector identity, signed/versioned artifacts where supported, capability declarations, sandboxing, least privilege, and contract tests.

## Risk Principle

The agent must never be the final enforcement point for a security decision. Policy enforcement must occur outside the model and before privileged execution.
