# PCI Data Classification Standard

## Classes

### Public

Information intentionally published outside the organization.

### Internal

Normal business or engineering information that is not intended for public release.

### Confidential

Information whose disclosure could materially affect operations, customers, employees, or security.

### Restricted

Highly sensitive information requiring explicit access controls, such as credentials, regulated data, security secrets, or highly sensitive customer information.

## Rules

- Restricted data must never be placed in prompts, logs, Git, or Knowledge Objects unless specifically designed for that data class and protected accordingly.
- AI context assembly must enforce data classification and authorization.
- Exports inherit the highest classification of included content.
- Audit events must avoid secret values.
- Retention and deletion policies must be classification-aware.

## AI Requirement

A model being local does not make data automatically safe. Authorization, classification, minimization, and audit controls apply equally to local and remote model runtimes.
