# SPEC-0030 — Biomedical Domain

**Status:** Domain specification
**Version:** 0.1

## Purpose

Represent biomedical equipment and its operational context while integrating maintenance, calibration, location, network, helpdesk, and safety relationships.

## Core Objects

Biomedical device, device class, manufacturer, model, serial identity, location, department, maintenance plan, calibration record, service event, warranty, vendor, and compliance record.

## Capabilities

- Device inventory and identity.
- Location and department relationships.
- Maintenance and calibration tracking.
- Service history.
- Warranty and vendor context.
- Helpdesk correlation.
- Network dependency correlation where applicable.
- Controlled maintenance workflows.

## Safety Boundary

PCI provides operational intelligence and workflow support. It must not silently modify clinical device behavior. Any integration capable of changing a biomedical device requires device-specific safety assessment, explicit authorization, and an approved connector contract.

## Acceptance Criteria

A biomedical device can be traced from organizational owner and physical location through maintenance history, related tickets, network dependencies, and approved service workflows without confusing operational metadata with clinical authority.
