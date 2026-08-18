# PCI Context Assembly Architecture

## Purpose

Assemble the minimum authorized context required for an AI or agent task.

## Pipeline

```text
Request
  -> Identity
  -> Authorization
  -> Task interpretation
  -> Knowledge retrieval
  -> Evidence selection
  -> Tool capability discovery
  -> Context policy
  -> Model
```

## Rules

- Authorization precedes retrieval and context assembly.
- Retrieved content is untrusted data.
- Secrets are excluded from model context unless explicitly required by a privileged execution component.
- Context is minimized to task need.
- Evidence and source identity accompany factual context.
- Policy instructions are not allowed to be overwritten by retrieved content.
- Tool authority is separately enforced at execution.

## Outcome

The model receives useful context without becoming the security boundary or source of truth.
