# SPEC-0003 — Governed Network Automation

**Status:** Approved for design; implementation not started  
**Version:** 0.1

## Purpose

Allow PCI agents to diagnose and configure network infrastructure while preventing uncontrolled production changes.

## Scope

Initial scope covers managed switches and common enterprise network devices. Vendor-specific drivers/connectors are implementation components behind a normalized capability interface.

## Required Workflow

```text
DISCOVER
  -> NORMALIZE DEVICE STATE
  -> IDENTIFY INTENT
  -> GENERATE PROPOSED CHANGE
  -> VALIDATE SYNTAX / POLICY
  -> SHOW DIFF
  -> RISK CLASSIFY
  -> APPROVE
  -> APPLY
  -> VERIFY STATE
  -> RECORD EVIDENCE
```

## Safety Requirements

1. Read-only discovery is the default.
2. No configuration mutation from an unapproved natural-language response.
3. Configuration changes must produce a machine-readable diff before execution.
4. The agent must know the target device identity and environment.
5. Production changes require explicit authorization according to policy.
6. Credentials are never exposed to the model unnecessarily.
7. Post-change validation is mandatory.
8. Failed or partial changes must be surfaced immediately.
9. Configuration snapshots/backups must be taken when supported.
10. Every change must produce an audit record linking user, agent, device, intent, proposed change, approval, execution, and validation.

## Vendor Abstraction

PCI must define capabilities such as `get_running_config`, `get_interfaces`, `get_vlans`, `validate_config`, `apply_config`, and `verify_state`. Vendor connectors map these capabilities to device-specific mechanisms.

## Lab-First Requirement

The first implementation must be validated against non-production/lab devices before Customer Zero production use.
