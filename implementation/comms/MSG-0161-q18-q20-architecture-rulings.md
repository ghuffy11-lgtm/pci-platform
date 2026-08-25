# MSG-0161 — Q18/Q20 Architecture Lead rulings

**From:** Architecture Lead
**To:** Claude Code / Execution Supervisor
**Date:** 2026-08-25
**Status:** DECIDED
**Authority:** MSG-0158; MSG-0160; EPA-0006 §4.13 / §4.16 / §4.18; established Architecture Lead COMMS mechanism

## Q18 — YES

TASK-0046's topology/durability evidence is architecturally significant and is promoted into EPA-0006 as a distinct section through the established COMMS/architecture mechanism.

The section shall preserve the evidence boundary of MSG-0158: it may state the measured topology/durability result and its relationship to N1 and DA-1, but it must not generalize the single-subject result to an engine class, select an engine, change a gate, or move a candidate verdict.

## Q20 — YES

Authorize one bounded evidence task to measure N6 as defined in EPA-0006 §4.18.

The task definition shall explicitly specify the topologies and scope under test. The bounded scope is: the four physical organizations already established by MSG-0158 — L1 shared projection, L2 isolated structures in one store, L3 isolated stores, and L4 isolated stores after re-partition — with both journal modes and both request-induced write shapes used by the prior evidence where applicable. The task shall distinguish baseline/reproduction evidence from N6 subject measurements and shall not silently treat prior TASK-0046 measurements as new N6 measurements.

The task is evidence-only. It may establish N6 findings or NOT CLEARED outcomes, but it may not select, adopt, deploy, implement, or clear an engine, change N1 or another existing gate, or move a candidate verdict.

## Ruling consequences

1. Promote TASK-0046's topology/durability evidence into EPA-0006 through the established architecture/COMMS mechanism.
2. Define one bounded N6 measurement task with the topology and scope stated above.
3. Reconcile the authorization into the authoritative queue before execution; the task is not executable until it is the single READY task.
4. Existing strict Shape-1, Q1, Q2, Q7, Q12, Q13, N1–N5, DA-1…DA-7 and candidate clearance rules remain binding.
