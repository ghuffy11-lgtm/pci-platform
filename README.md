# PCI Platform

**Working Codename:** PCI  
**Program:** PCI Enterprise Intelligence Platform  
**Status:** Project Genesis / Foundation

> **Model reality. Everything else follows.**

PCI is being designed as a private, modular Enterprise Intelligence Platform that models organizational reality so humans, AI, and automation can operate over shared governed context.

## Current State

The repository now contains the founding engineering architecture, governance, Reality Model, Knowledge Fabric design, agent rules, security principles, standards register, specifications, and initial work packages.

Production implementation has **not** yet begun.

## Read First

1. `knowledge/governance/constitution.md`
2. `docs/product/vision.md`
3. `docs/architecture/reality-model.md`
4. `docs/architecture/knowledge-fabric.md`
5. `docs/architecture/architecture-principles.md`
6. `docs/engineering/claude-code-rules.md`
7. `docs/program/work-packages.md`

## Authority

The PCI Engineering Constitution is the highest engineering authority. Lower-level artifacts must not contradict it.

## Engineering Model

PCI treats knowledge as a first-class, connected asset. Canonical entities receive stable identity; relationships, events, provenance, policies, and state are represented explicitly. Applications and agents consume governed knowledge rather than becoming independent sources of truth.

## Implementation Philosophy

- Integrate mature standards before inventing new ones.
- Keep AI models and infrastructure replaceable.
- Keep customer data under customer control.
- Prefer offline-first operation.
- Automate deployment and operations where practical.
- Require explicit authorization for privileged agent actions.
- Record architecture and engineering decisions in Git.

## Source of Truth

Git is the canonical engineering source of truth. Runtime systems may hold operational state, but architectural intent and engineering knowledge must remain version-controlled here.
