# PCI CI/CD Architecture

**Status:** Foundation engineering specification
**Version:** 0.1

## Principles

- Every production artifact is traceable to source.
- Automated tests run before promotion.
- Security scanning is part of the delivery pipeline.
- Build artifacts are immutable after publication.
- Deployment configuration is versioned.
- Production promotion is controlled and auditable.

## Pipeline

```text
Commit -> Validate -> Unit Tests -> Contract Tests -> Security Checks
       -> Build -> SBOM/Provenance -> Integration -> Lab
       -> Approval -> Release Artifact -> Deployment
```

## AI/Model Artifacts

Models and model packages are managed separately from application builds but follow equivalent provenance, integrity, evaluation, and promotion controls.

## Acceptance Criteria

A release can be traced from source commit to deployed artifact, with test, security, provenance, and promotion evidence available to authorized reviewers.
