# MSG-0028 — TASK-0003 implemented but not complete; architecture decision

**Status:** DECIDED
**From:** Claude Code (session started automatically by the Execution Supervisor)
**To:** Architecture lead / operator
**Date:** 2026-08-20
**Related:** TASK-0003, MSG-0027, DISC-0006, MSG-0026, TASK-0010

## Decision

The architecture lead has reviewed the three requested decisions and authorizes the following:

1. **Working-tree refresh: Option B — narrowly widen the unattended runner allowlist.**
   Authorize only the path-scoped markdown refresh required by TASK-0003:

   ```bash
   git ls-files -z "*.md" | git checkout-index -f -z --stdin
   ```

   The executor must verify afterward that tracked `*.md` files report zero `w/crlf`. No unscoped
   `git reset --hard`, repository-wide checkout, cache removal, or equivalent substitute is authorized.
   The allowlist must be as narrow as the runner mechanism permits and must not weaken the existing deny
   rules.

2. **Mid-run HEAD movement: abort the supervisor session.**
   If `HEAD` or `origin/main` changes unexpectedly after a supervisor session has started, the session
   must stop at the next safe checkpoint, document the discrepancy, and must not continue making changes
   against a moving repository state. This is a fail-closed recovery boundary. A run may only continue
   after reconciliation confirms the repository state is again consistent with the session's recorded
   start state.

3. **Unattended push: authorized, narrowly scoped.**
   Add exactly this allowlist capability:

   ```text
   Bash(git push origin main)
   ```

   Plain `git push` with arbitrary refspecs remains disallowed. Existing `git push --force` / `-f` deny
   rules remain unchanged. The runner must push only the current authorized `main` branch and must verify
   after push that local HEAD equals `origin/main`.

## Execution constraints

- These decisions apply only to the already-authorized execution-control and TASK-0003 delivery work.
- Do not authorize TASK-0012 or any unrelated work.
- Preserve `acceptEdits`; do not use `--dangerously-skip-permissions` or `bypassPermissions`.
- Preserve the existing deny list and fail-closed behavior.
- Do not silently broaden the allowlist beyond the two exact capabilities above.
- Record implementation and verification in a new COMMS message and update the authoritative queue when
  TASK-0003 is actually verified COMPLETE.

## Prior TASK-0003 result

The authorized `.gitattributes` change was applied and verified. All 195 tracked markdown index blobs were
already LF, so the committed-content renormalization produced no document changes. The remaining 152
working-tree markdown files require the path-scoped refresh above to remove their CRLF working-tree residue.

The first Supervisor-launched TASK-0003 session also proved the start path. Its work was left
IMPLEMENTED — NOT COMPLETE pending this decision.

## Important repository-state rule

The implementation must reconcile against the current `HEAD`/`origin/main` before applying the refresh or
allowlist changes. If the repository has moved since this decision was recorded, stop and reconcile first.
