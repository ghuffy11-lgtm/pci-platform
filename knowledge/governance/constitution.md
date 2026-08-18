# PCI Engineering Constitution

**ID:** GOV-CONST-0001  
**Version:** 1.0  
**Status:** Ratified Founding Edition  
**Authority:** Highest engineering authority

## Purpose

This Constitution establishes the non-negotiable engineering principles and governance rules for PCI. It governs architecture, engineering, security, knowledge management, deployment, and product evolution.

## Core Principles

1. **Customer Data Ownership** — customer data remains under customer control and PCI must not require customer data to leave the customer's environment.
2. **Open by Design** — prefer open standards, documented APIs, portable formats, and mature open-source components.
3. **Zero Mandatory Software Licensing** — PCI must have no mandatory software licensing fees; optional commercial integrations may be supported.
4. **Integrate Before Invent** — do not build a mature capability that can responsibly be adopted through an existing standard or component.
5. **Model Agnostic** — AI models and inference runtimes are replaceable implementation components.
6. **Component Agnostic** — core infrastructure services should have defined interfaces and practical replacement paths.
7. **Offline First** — after installation, core operation must not depend on Internet connectivity.
8. **Security by Design** — identity, authorization, secrets, encryption, auditability, least privilege, and secure defaults are architectural requirements.
9. **API First** — capabilities should be exposed through stable, documented interfaces.
10. **Knowledge as a First-Class Asset** — PCI stores structured, connected engineering and organizational knowledge rather than relying on isolated documents.
11. **Reality Once** — a real-world entity should have one canonical identity in the PCI model; views and integrations reference that identity.
12. **Automation First** — deployment, validation, backup, recovery, upgrades, and routine operations should be automated where practical.
13. **No Silent Architecture Changes** — implementation must not silently alter approved architecture, standards, or decisions.
14. **Maintainability Over Novelty** — new technology is adopted because it materially improves PCI, not because it is fashionable.
15. **Five-Year Test** — significant decisions must be evaluated for long-term maintainability, operability, and replaceability.

## Authority Hierarchy

1. Constitution
2. Architecture principles and approved architecture
3. Architecture Decision Records (ADRs)
4. Approved specifications (SPECs)
5. Implementation tasks
6. Source code

Lower-level artifacts must not contradict higher-level artifacts.

## AI Engineering Rule

AI coding agents are implementation agents. They may identify conflicts, risks, or better alternatives, but they must not silently change architecture. Conflicts require an RFC or ADR review.

## Amendment

Constitutional changes require a written proposal, architectural review, rationale, version increment, and explicit approval before implementation.
