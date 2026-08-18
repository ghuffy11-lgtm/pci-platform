# PCI Platform Kernel Architecture

## Purpose

Define the smallest set of capabilities that must remain stable while domains and implementations evolve.

## Kernel Responsibilities

- Identity context.
- Authorization and policy enforcement.
- Knowledge Object semantics.
- Relationship semantics.
- Provenance.
- Event envelope.
- Audit/evidence.
- Workflow primitives.
- Connector/tool contract.
- Tenant boundaries.
- Extension lifecycle.

## Explicitly Outside the Kernel

- Vendor-specific network logic.
- Helpdesk vendor behavior.
- Facilities-specific workflows.
- Biomedical device protocols.
- A particular AI model.
- A particular vector database.
- A particular UI framework.
- A particular monitoring backend.

## Stability Rule

Kernel contracts change slowly and require architecture review. Domain capabilities evolve independently behind those contracts.
