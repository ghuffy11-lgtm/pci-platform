# SPEC-0009 — Tool and Connector Contract

**Status:** Foundation specification
**Version:** 0.1

## Purpose

Define how PCI exposes external capabilities to agents and workflows without coupling reasoning logic to vendor-specific integrations.

## Requirements

Every connector must declare:

- connector identity and version;
- capability names;
- input/output schemas;
- required permissions;
- risk classification;
- target types;
- authentication method;
- timeout and retry behavior;
- idempotency behavior where applicable;
- audit requirements.

Tools must return structured results and explicit errors. A connector must never silently widen its authority beyond its declared contract.

## Network Example

A switch connector may expose `get_interfaces`, `get_vlans`, `get_running_config`, `validate_config`, `apply_config`, and `verify_state` while hiding vendor-specific SSH/API/NETCONF details.

## Acceptance Criteria

An agent can discover a connector's capabilities and required authority before invocation and can execute the same normalized capability against multiple vendor implementations.
