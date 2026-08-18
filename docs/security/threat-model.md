# PCI Threat Model

**ID:** SEC-THREAT-0001  
**Status:** Founding Draft

## Primary Assets

- Customer organizational knowledge.
- Credentials and secrets.
- Network and infrastructure configuration.
- AI prompts/context and model interactions.
- Agent execution authority.
- Audit records.
- Identity data.

## Threat Classes

| Threat | Example | Primary Control |
|---|---|---|
| Unauthorized access | User reaches restricted knowledge | RBAC/ABAC + identity |
| Agent overreach | Agent changes production without approval | Tool authorization + policy |
| Prompt injection | Malicious source manipulates agent behavior | Trust boundaries + content isolation |
| Data exfiltration | Sensitive context leaves environment | Offline-first + egress controls |
| Credential theft | Token exposed to agent | Secret isolation + short-lived credentials |
| Knowledge poisoning | False data becomes authoritative | Provenance + validation |
| Configuration damage | Invalid switch configuration | Diff + approval + pre/post validation |
| Supply-chain compromise | Malicious dependency/image | Pinning + scanning + provenance |
| Availability failure | Knowledge service unavailable | HA/backup/recovery strategy |
| Audit tampering | Action evidence altered | Protected audit storage |

## Security Boundary

External content is untrusted until validated. AI output is untrusted until evaluated against policy, authorization, and system validation.

## Network Automation Risk

Network automation is treated as a privileged action domain. The platform must not allow natural-language requests alone to directly mutate production network state.

## Review

This threat model must evolve as capabilities and deployment models are introduced.
