# PCI AI Model Lifecycle

## Goal

Allow PCI to adopt better AI models without redesigning the platform or corrupting historical evidence.

## Lifecycle

```text
Candidate
  -> Evaluated
  -> Approved
  -> Available
  -> Production
  -> Deprecated
  -> Retired
```

## Model Record

Each production model must have:

- provider/runtime;
- model identifier and version;
- capabilities;
- context characteristics;
- license/source;
- evaluation results;
- security review;
- resource requirements;
- known limitations;
- approved workloads;
- retirement/replacement plan.

## Routing

Model selection is a policy decision based on task requirements, quality, latency, resource availability, privacy, and operational constraints.

## Historical Integrity

Past agent actions retain the exact model/runtime identity used at execution time. Replacing a model must not rewrite historical records.
