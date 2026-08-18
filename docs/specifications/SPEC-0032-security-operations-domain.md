# SPEC-0032 — Security Operations Domain

**Status:** Domain specification
**Version:** 0.1

## Purpose

Connect identities, assets, vulnerabilities, alerts, policies, incidents, evidence, and response workflows into a governed security model.

## Core Objects

Identity, principal, asset, vulnerability, finding, alert, security incident, control, policy, risk, evidence, exception, and response action.

## Capabilities

- Security event correlation.
- Asset and identity context.
- Finding management.
- Risk analysis.
- Incident investigation.
- Evidence collection.
- Policy compliance views.
- Governed response workflows.

## Safety

Security automation must use the same authorization, approval, audit, and connector controls as all other privileged automation. Detection data is evidence and does not itself authorize an action.

## Acceptance Criteria

An alert can be correlated with affected identities and assets, related risks and controls can be identified, and an authorized response workflow can execute with complete evidence.
