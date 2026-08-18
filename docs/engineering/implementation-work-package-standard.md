# PCI Implementation Work Package Standard

**Status:** Foundation engineering specification
**Version:** 0.1

## Purpose

Convert architecture into small, traceable implementation units for human engineers or coding agents.

## Required Fields

- Work package ID
- Objective
- Source ADRs/specifications
- Scope
- Non-scope
- Dependencies
- Inputs
- Expected repository changes
- Acceptance criteria
- Tests
- Security considerations
- Migration considerations
- Operational considerations
- Evidence required

## Sequencing

Work packages should follow dependency order: contracts before implementations, kernel before domains, read capabilities before mutation capabilities, and observability before production automation.

## Completion Rule

A work package is not complete when code merely compiles. It is complete when acceptance criteria pass and the repository contains the required implementation and evidence.
