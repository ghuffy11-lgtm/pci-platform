# PCI Kernel container image
#
# Sources: docs/security/supply-chain-security.md ("Keep build and runtime images minimal",
#          "Pin or constrain production dependencies", "Prefer reproducible builds"),
#          docs/architecture/technology-standards.md (OCI-compatible images),
#          SPEC-0026 (offline artifact acquisition).
#
# ⚠ NEVER BUILT. Docker was unavailable on the authoring host during WP-0001.
#   See implementation/blockers/BLK-0001-no-execution-environment.md.

# --------------------------------------------------------------------- deps
# Pin by digest before production use; the tag alone is not a reproducible reference.
FROM node:24.15.0-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

# `npm ci` installs exactly the lockfile, which is what makes the build reproducible.
# --omit=dev keeps the test and typechecking toolchain out of the runtime image.
RUN npm ci --omit=dev --ignore-scripts

# ------------------------------------------------------------------ runtime
FROM node:24.15.0-alpine AS runtime

# Node 24 runs TypeScript directly via native type-stripping, so there is no build output to
# copy and no compiler in the runtime image (ADR-0015, proposed).

ENV NODE_ENV=production \
    PCI_HOST=0.0.0.0 \
    PCI_PORT=8080

WORKDIR /app

# tini gives the container a real init so SIGTERM reaches Node and the graceful shutdown in
# src/main.ts actually runs.
RUN apk add --no-cache tini=~0.19

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY migrations ./migrations

# The `node` user ships with the base image (uid 1000). Running as root would undermine the
# least-privilege posture in security-architecture.md.
USER node

EXPOSE 8080

# The container is started read-only with all capabilities dropped by the compose stack.
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/main.ts"]

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=6 \
    CMD node -e "fetch('http://127.0.0.1:8080/health/ready').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
