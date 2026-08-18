# PCI Agent Architecture

**ID:** ARCH-AGENT-0001  
**Status:** Founding Architecture

## Principle

Agents are controlled execution components. They do not become the source of truth and they do not silently redefine architecture.

## Agent Classes

### Reasoning Agent
Interprets knowledge and produces recommendations or explanations.

### Implementation Agent
Performs approved engineering tasks, including configuration and installation, within explicit boundaries.

### Operations Agent
Performs approved operational actions such as diagnostics, remediation, or routine maintenance.

### Synchronization Agent
Imports or reconciles information from external systems.

### Governance Agent
Validates proposed changes against policies, standards, architecture, and authorization rules.

## Execution Model

```text
Intent
  -> Authorization
  -> Context Retrieval
  -> Plan
  -> Risk Evaluation
  -> Approval if required
  -> Tool Execution
  -> Validation
  -> Evidence / Audit
  -> Knowledge Update
```

## Safety Rules

- Agents must have least-privilege identities.
- Tool access must be explicitly granted.
- High-impact actions require approval unless an approved policy explicitly permits automation.
- Configuration changes must be validated after execution.
- Agents must preserve command/action evidence.
- Failed actions must not be represented as successful.
- Agent-generated knowledge must include provenance.

## Claude Code

Claude Code is an implementation agent for PCI. It follows the PCI Constitution, approved architecture, ADRs, specifications, and task instructions. It may propose changes to those artifacts but may not silently override them.

## Model Independence

Agent orchestration must not depend on a single LLM provider. Model selection is an implementation/runtime decision behind stable agent interfaces.
