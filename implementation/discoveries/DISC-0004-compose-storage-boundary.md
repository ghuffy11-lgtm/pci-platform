# DISC-0004 — Compose Stack Predates the `/data/docker` Boundary

**Status:** RESOLVED — 2026-08-19. The daemon `data-root` question is answered by a pre-staged `/data/docker/daemon.json` on the authorized host. No compose change is strictly required.
**Raised:** 2026-08-19
**Work package:** WP-0001 — PCI Kernel Foundation
**Related:** `docs/operations/pci-server-bootstrap.md`, MSG-0001, BLK-0001

## Discovery

`deploy/compose/docker-compose.yml` (committed in `be4502d`) uses a **named Docker volume** for
PostgreSQL persistence:

```yaml
volumes:
  - postgres-data:/var/lib/postgresql/data
...
volumes:
  postgres-data:
    driver: local
```

It was authored while the persistent-storage boundary was unrecorded, and says so in its own
header: named volumes were chosen deliberately over inventing a host path, with the substitution
deferred until MSG-0001 was answered.

MSG-0001 is now answered. `docs/operations/pci-server-bootstrap.md` is an accepted contract and
states that all PCI application, Docker, database, search, log, configuration, and persistent
service data **must** reside under `/data/docker`, and that persistent Docker data must use
explicit paths below that root "rather than uncontrolled container writable layers".

A `driver: local` named volume lands under the Docker daemon's `data-root`, which defaults to
`/var/lib/docker`. On a host whose daemon has not been relocated, the committed stack therefore
writes PCI database state **outside the mandatory boundary**.

## Why this was not fixed in place

The compose stack has never been executed — no Docker existed on the authoring host. Editing it
to bind-mount `/data/docker/...` would produce an unverified deployment change committed blind,
and the correction is properly part of standing up the authorised host, where it can actually be
run and checked. It is recorded here so the gap is visible rather than silently carried.

Two details also want confirmation on the real host rather than assumption:

1. **Daemon relocation.** "All … Docker … data MUST reside under `/data/docker`" reads as
   requiring `data-root` to be set to `/data/docker` in `/etc/docker/daemon.json`, not merely
   that individual bind mounts point there. If the daemon is relocated, named volumes would
   already satisfy the boundary and explicit bind mounts become belt-and-braces.
2. **Sub-path layout.** The contract fixes the root but not the tree beneath it. WP-0001 assumes
   `/data/docker/pci/<service>` pending any convention the architecture lead prefers.

Neither point blocks WP-0001. If (1) is resolved by relocating `data-root`, no compose change is
strictly required; if it is not, the bind mounts are required.

## Recommended action

While bootstrapping the authorised Ubuntu host:

- set Docker `data-root` to `/data/docker` (or confirm the intended equivalent);
- replace the `postgres-data` named volume with an explicit bind mount under the authorised root;
- verify with `docker inspect` that no PCI container writes persistent state outside
  `/data/docker`;
- record the result in the WP-0001 report as evidence for AC-01 and AC-02.

---

## Resolved — 2026-08-19

Inspection of the authorized host settles the question this discovery raised. `/data/docker/daemon.json`
was pre-staged on 2026-08-18:

```json
{
    "data-root": "/data/docker"
}
```

Point 1 of "why this was not fixed in place" asked whether the contract requires relocating the
daemon's `data-root` or only per-service bind mounts. **It requires relocation, and the operator
has already staged it.** Consequences:

- The `postgres-data` named volume in `deploy/compose/docker-compose.yml` resolves under
  `/data/docker/volumes/`, inside the mandatory boundary. **The compose stack is compliant as
  written; no bind-mount change is needed.**
- Relocation is the stronger guarantee, since image layers and container writable state are
  captured too, not only the volumes that were explicitly bind-mounted.
- Point 2 (sub-path layout beneath the root) is moot for WP-0001: Docker owns the tree under its
  data-root, and PCI does not place files there by hand.

The comment block at the head of the compose file still describes the boundary as unresolved and
recommends substituting bind mounts. That guidance is now obsolete and should be replaced when the
stack is first executed on the host — deliberately deferred to that point, since the file has
still never been run.

One caution recorded in BLK-0004: `/data` also contains a pre-existing non-PCI layout including
`/data/postgres`. That directory is **not** the PCI database location and must not be used as
such. PCI's PostgreSQL state belongs inside the relocated Docker root.
