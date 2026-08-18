# PCI Network Automation Architecture

## Goal

Enable safe, vendor-neutral network operations while keeping the AI model away from direct privileged device access.

## Execution Path

```text
Human / Agent Intent
        -> Plan
        -> Target Resolution
        -> Current-State Discovery
        -> Proposed Change
        -> Validation / Diff
        -> Policy
        -> Approval (if required)
        -> Credential Resolution
        -> Connector
        -> Device
        -> Post-Change Verification
        -> Evidence
```

## Separation

The model reasons about intent and evidence. A governed execution service performs privileged operations. Vendor adapters implement normalized connector contracts.

## Safety Requirements

- Never infer the target device solely from a natural-language name when ambiguity exists.
- Validate device identity and current state.
- Generate a machine-readable change plan.
- Require policy evaluation before mutation.
- Back up or capture current state when supported.
- Verify post-change state.
- Record exact execution evidence.
- Support immediate stop/recovery controls.

## Initial Vendors

Vendor adapters will be selected based on Customer Zero requirements. Vendor support is an extension concern, not a kernel dependency.
