# SPEC-0027 — Network Domain

**Status:** Domain specification
**Version:** 0.1

## Purpose

Model and operate enterprise network infrastructure through the PCI Reality Model and governed automation layer.

## Core Objects

Network, site, location, device, interface, VLAN, subnet, route, firewall, wireless network, circuit, credential reference, configuration snapshot, and network event.

## Capabilities

- Discovery and inventory.
- Topology mapping.
- Configuration retrieval.
- Health correlation.
- Configuration analysis.
- Change planning and diff generation.
- Vendor-neutral tool contracts.
- Lab validation.
- Governed production execution.
- Post-change verification.

## Safety

Mutating operations require target validation, authorization, policy evaluation, change evidence, and verification. Vendor-specific adapters must not bypass the normalized execution path.

## Acceptance Criteria

PCI can discover supported network devices, relate them to locations and services, explain dependencies, produce a proposed configuration change, validate it in a safe environment, and execute it only when policy permits.
