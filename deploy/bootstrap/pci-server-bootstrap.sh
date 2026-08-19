#!/usr/bin/env bash
#
# PCI server bootstrap — WP-0001
#
# Contract : docs/operations/pci-server-bootstrap.md (Accepted, v0.1)
# Blocker  : implementation/blockers/BLK-0004-host-privilege-unavailable.md
#
# ⚠ NEVER EXECUTED as committed. Written after inspecting the authorized host read-only;
#   the `claude` account has no passwordless sudo, so it could not be run. Whoever runs it
#   first should treat the output as the evidence of record and report the result.
#
# Requires root. Idempotent: safe to re-run.
#
#   sudo bash deploy/bootstrap/pci-server-bootstrap.sh
#
set -euo pipefail

DATA_ROOT=/data/docker
STAGED_DAEMON_JSON="${DATA_ROOT}/daemon.json"
PCI_USER=claude

log()  { printf '[bootstrap] %s\n' "$*"; }
fail() { printf '[bootstrap] FAILED: %s\n' "$*" >&2; exit 1; }

[[ ${EUID} -eq 0 ]] || fail "must run as root (sudo)"

# ---------------------------------------------------------------------------
# 1. Preconditions
# ---------------------------------------------------------------------------
log "verifying preconditions"

. /etc/os-release
[[ "${ID}" == "ubuntu" ]] || fail "expected Ubuntu, found ${ID}"
log "os: ${PRETTY_NAME}"

mountpoint -q /data || fail "/data is not a mount point; refusing to write platform state to the root filesystem"
log "/data: $(findmnt -no SOURCE,SIZE /data)"

[[ -d "${DATA_ROOT}" ]] || fail "${DATA_ROOT} does not exist; the storage boundary must be prepared first"

# ---------------------------------------------------------------------------
# 2. Docker Engine + Compose
#
# Ubuntu archive packages are used deliberately in preference to a third-party apt
# source: fewer supply-chain surfaces, and no new signing key on the host. If the
# programme later requires upstream Docker CE, that is an architecture decision to
# record, not a change to make here.
# ---------------------------------------------------------------------------
if command -v docker >/dev/null 2>&1; then
    log "docker already installed: $(docker --version)"
else
    log "installing docker.io and docker-compose-v2 from the Ubuntu archive"
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -qq
    apt-get install -y --no-install-recommends docker.io docker-compose-v2
fi

# ---------------------------------------------------------------------------
# 3. Storage boundary — daemon data-root
#
# The contract requires that all Docker data live under /data/docker. Relocating
# data-root satisfies that for named volumes, image layers, and container state
# alike, which is stronger than per-service bind mounts.
# ---------------------------------------------------------------------------
install -d -m 0755 /etc/docker

if [[ -f "${STAGED_DAEMON_JSON}" ]]; then
    log "installing pre-staged daemon.json from ${STAGED_DAEMON_JSON}"
    install -m 0644 -o root -g root "${STAGED_DAEMON_JSON}" /etc/docker/daemon.json
else
    log "writing daemon.json (no pre-staged file found)"
    cat > /etc/docker/daemon.json <<JSON
{
    "data-root": "${DATA_ROOT}"
}
JSON
fi

grep -q '"data-root"' /etc/docker/daemon.json || fail "/etc/docker/daemon.json does not set data-root"

# Docker manages the contents; the root itself must not be world-readable.
chown root:root "${DATA_ROOT}"
chmod 0710 "${DATA_ROOT}"

# ---------------------------------------------------------------------------
# 4. Service
# ---------------------------------------------------------------------------
log "enabling and restarting docker"
systemctl enable --now docker >/dev/null
systemctl restart docker
systemctl is-active --quiet docker || fail "docker service is not active"

# ---------------------------------------------------------------------------
# 5. Platform access
#
# Membership of the docker group is equivalent to root on this host. It is granted
# because the contract authorizes Claude Code to operate the container runtime, and
# it is recorded here so the grant is never invisible.
# ---------------------------------------------------------------------------
if id -nG "${PCI_USER}" | tr ' ' '\n' | grep -qx docker; then
    log "${PCI_USER} already in docker group"
else
    log "adding ${PCI_USER} to the docker group (equivalent to root — recorded deliberately)"
    usermod -aG docker "${PCI_USER}"
    log "NOTE: ${PCI_USER} must open a new session for this to take effect"
fi

# ---------------------------------------------------------------------------
# 6. Verification — evidence of record
# ---------------------------------------------------------------------------
log "verifying"

ACTUAL_ROOT="$(docker info --format '{{.DockerRootDir}}')"
[[ "${ACTUAL_ROOT}" == "${DATA_ROOT}"* ]] \
    || fail "docker root is ${ACTUAL_ROOT}, expected ${DATA_ROOT} — the storage boundary is NOT satisfied"

cat <<REPORT

[bootstrap] ---------------- evidence ----------------
 host          : $(hostname)
 os            : ${PRETTY_NAME}
 kernel        : $(uname -r)
 docker        : $(docker --version)
 compose       : $(docker compose version 2>/dev/null | head -1)
 docker root   : ${ACTUAL_ROOT}
 /data mount   : $(findmnt -no SOURCE,SIZE,USE% /data)
 time synced   : $(timedatectl show -p NTPSynchronized --value)
 docker active : $(systemctl is-active docker)
[bootstrap] ------------------------------------------

REPORT

log "complete. All Docker state now resides under ${DATA_ROOT}."
log "Record this output in the WP-0001 implementation report as AC-01 evidence."
