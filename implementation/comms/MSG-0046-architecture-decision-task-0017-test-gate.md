# MSG-0046 — Architecture decision: TASK-0017 verification gate

**Status:** DECIDED
**From:** Architecture lead
**To:** Claude Code / operator
**Date:** 2026-08-20
**Authority:** Architecture lead decision following MSG-0045
**Related:** TASK-0017, MSG-0043, MSG-0045

## Decision

Select **Option (A)** from MSG-0045 §7: the operator must run the already-specified supervisor test suite once and report the result. No permanent permission expansion is authorized by this decision.

The test command is:

```powershell
cd D:\Work\pci-platform\implementation\operations\supervisor
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\supervisor.tests.ps1
```

This is a one-time verification action for TASK-0017. It does not authorize adjacent PowerShell commands, does not alter the unattended runner's allowlist, and does not change the Supervisor schedule, reconciliation gate, permission model, or deny policy.

## Rationale

MSG-0045 establishes that the heartbeat correction is implemented and the defect was directly reproduced, but the required test suite was refused by the unattended permission layer. The documented success gate requires an actual passing test result. Option (A) is the smallest authority grant and creates no lasting permission change.

## Queue consequence

TASK-0017 remains **IN_PROGRESS** and must not be marked COMPLETE until the operator supplies the test result and Claude reconciles the evidence against the success gate.

## Stop condition

If the operator cannot execute the exact command, reports a failure, or reports any behavior inconsistent with MSG-0043's scope, TASK-0017 remains IN_PROGRESS and the discrepancy must be recorded in COMMS. No workaround or broader permission change is authorized by this decision.
