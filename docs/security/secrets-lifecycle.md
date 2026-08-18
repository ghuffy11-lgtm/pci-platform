# PCI Secrets Lifecycle

**Status:** Foundation security specification
**Version:** 0.1

## Lifecycle

```text
Provision -> Store -> Retrieve Just-in-Time -> Use -> Rotate -> Revoke -> Destroy
```

## Requirements

- Secrets are stored only in an approved secrets-management system.
- Services receive only the credentials required for the operation.
- Short-lived credentials are preferred.
- Secrets are never committed to Git or included in ordinary audit events.
- Secret values are redacted from logs and model context.
- Rotation and revocation are auditable.
- Emergency credential revocation must be possible without redeploying the entire platform.

## Agent Rule

The reasoning model should receive a capability result, not a raw credential. Credential resolution belongs to the privileged execution layer.

## Acceptance Criteria

A connector can perform an authorized operation without exposing reusable credentials to the model, logs, or repository.
