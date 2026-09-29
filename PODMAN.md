# Podman Support (Additive Path)

This repository maintains Docker as its primary documented and production CI path. Podman is supported as an **additional** option for local development, rootless execution, and container build/smoke verification.

Existing Docker workflows (`.github/workflows/cicd.yml`), Docker compose configurations, and production release tags remain untouched and active.

---

## Prerequisites

Verify that Podman is installed on your workstation:

```bash
podman version
podman info
```

For Ubuntu 24.04+ (Noble) or RHEL 8/9, Podman 4.9+ is recommended.

---

## Building with Podman

Build the image directly using the existing `Dockerfile`. Following NOAA-OWP/WRES conventions, use `--format docker` to ensure standard OCI/Docker compatibility:

```bash
podman build --ulimit nofile=65535:65535 --format docker -t local/ngencerf-ui:podman-test .
```

*Note: The Dockerfile uses BuildKit syntax (`# syntax=docker/dockerfile:1.4`) and `--mount=type=cache` for apt and npm cache. Modern Podman (via Buildah $\ge$ 1.24) natively resolves these cache mounts locally without requiring a Docker daemon. The `--ulimit nofile=65535:65535` flag ensures Vite and PostCSS have sufficient file descriptors when bundling assets during `npm run build`.*

---

## Smoke Verification

### 1. Test Entrypoint & Node/npm CLI
```bash
podman run --rm local/ngencerf-ui:podman-test --version
podman run --rm --entrypoint node local/ngencerf-ui:podman-test --version
# Expected: prints npm and Node versions (e.g. 11.13.0, v24.16.0) and exits 0
```

### 2. Verify Compiled Nitro Server Bundle
Verify that `npm run build` completed properly and the Nitro output bundle exists:
```bash
podman run --rm --entrypoint ls local/ngencerf-ui:podman-test -lh .output/server/index.mjs
podman run --rm --entrypoint test local/ngencerf-ui:podman-test -s .output/server/index.mjs
# Expected: displays bundle details and exits 0
```

---

## Compose Notes

The repository `compose.yaml` defines the `ngencerf-app` service with `pull_policy: build` and maps port `3000:3000`. It does **not** declare persistent volume mounts. Therefore, SELinux volume relabeling (`:Z`) is not required for the current UI compose setup.

To validate compose configuration using Podman:
```bash
podman compose -f compose.yaml config
```
*(Note: Requires `podman-compose` or `PODMAN_COMPOSE_PROVIDER` configured on your host).*

---

## CI / Automation

* **Workflow:** `.github/workflows/podman-smoke.yml`
* **Triggers:** Manual (`workflow_dispatch`) and automated checks on pull requests modifying container files (`Dockerfile`, `compose.yaml`, `package*.json`, `nuxt.config.ts`).
* **Runner Environment:** Pinned to `ubuntu-24.04`.
* **Registry Policy:** By default, builds remain local to the runner. When `push_images=true` is dispatched, only `:podman-test` and `:<sha>-podman-test` tags are published to GHCR. Production aliases (`:latest`, release tags) are never touched.
