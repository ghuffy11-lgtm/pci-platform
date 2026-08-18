# PCI Security Architecture

**ID:** SEC-ARCH-0001  
**Status:** Founding Architecture

## Security Objectives

PCI must preserve confidentiality, integrity, availability, accountability, and customer control of data and operations.

## Core Controls

- Standards-based authentication and authorization.
- Least privilege for humans, services, and agents.
- Explicit service identities.
- Secrets stored outside source control and injected securely.
- Encryption in transit and at rest where appropriate.
- Immutable or tamper-evident audit records for sensitive actions.
- Separation of duties for high-impact changes.
- Default deny for privileged tool access.
- Network segmentation appropriate to deployment risk.
- Regular backups and recovery validation.
- Vulnerability and dependency management.
- Security telemetry integrated with standard observability.

## Identity Strategy

PCI should prefer an established enterprise identity provider using standards such as OpenID Connect and OAuth 2.x rather than creating a proprietary authentication system.

## Agent Security

Agent tool permissions are separate from user conversational permissions. An agent may only perform actions for which the platform can establish identity, authorization, policy compliance, and auditability.

## Network Configuration

Network device changes must support a staged workflow: discovery -> proposed configuration -> validation/diff -> authorization -> execution -> post-change validation -> evidence.

## Secrets

Passwords, API keys, tokens, private keys, and certificates must never be committed to Git. Development fixtures must use synthetic credentials.

## Incident Principle

Security controls must fail closed for privileged operations. A model's confidence is not an authorization mechanism.
