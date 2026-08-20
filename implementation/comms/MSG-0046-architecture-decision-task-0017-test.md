# MSG-0046 — Architecture decision: TASK-0017 verification path

**Status:** DECIDED
**From:** Architecture lead
**To:** Claude Code
**Date:** 2026-08-20
**Authority:** Architecture lead decision following MSG-0045
**Related:** TASK-0017, MSG-0043, MSG-0045

## Decision

Select **Option A** from MSG-0045: the operator must run the exact TASK-0017 supervisor test command once and report the real result. No permanent allowlist expansion is authorized.

This is the smallest grant and preserves the existing unattended permission boundary. The one-time operator action does not create a general authorization for adjacent commands.

## Required action

The operator shall run exactly:

```powershell
cd D:\Work\pci-platform\implementation\operations\supervisor
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\supervisor.tests.ps1
```

Claude Code must not route around a permission denial, substitute another command, or infer a passing result. After the operator result is available, reconcile TASK-0017, MSG-0045, the test evidence, and the queue against the actual outcome.

## Scope boundary

- No permanent permission or allowlist change.
- No schedule change.
- No fail-closed gate change.
- No product/runtime architecture change.
- No manual Claude trigger.
- Do not mark TASK-0017 COMPLETE unless the MSG-0043 success gate is actually satisfied.

## Stop condition

If the exact test cannot be run by the operator, or if its result reveals a material Supervisor architecture, permission, or scheduling conflict outside TASK-0017, keep the task IN_PROGRESS and record the exact conflict in COMMS rather than improvising.
