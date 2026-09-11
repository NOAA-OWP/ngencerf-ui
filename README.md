# ngencerf UI

A [Nuxt 4](https://nuxt.com/) (Vue 3) application for the ngencerf platform.

## Prerequisites

- **Node.js** — pinned in [`.nvmrc`](.nvmrc) (currently **24.16.0**). Manage versions with
  [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating). You don't have to switch
  Node by hand for local development — `./runUI.sh` reads `.nvmrc` and installs/switches for you. To do it
  manually:

  ```bash
  nvm install 24.16.0
  nvm use 24.16.0
  ```

- **Docker** (with the Compose plugin) — only needed for the container workflows in Section 1 below.

---

## 1. Bring up the UI

The UI talks to `ngencerf-server`. Point it at your server with `NGENCERF_BASE_URL` (defaults to
`http://localhost:8000` when unset):

```bash
export NGENCERF_BASE_URL=http://your-ngencerf-server:8000
```

You can run it directly on your machine or in Docker.

### On your machine

**Development** (hot reload, `http://localhost:3000`):

```bash
./runUI.sh
```

`runUI.sh` is the dev launcher. It first syncs your environment to the repo: it switches Node to `.nvmrc`
via nvm (installing it if needed), and does a clean `npm ci` whenever Node was switched, `node_modules` is
missing, or `package-lock.json` changed. If you're already in sync it just starts the dev server without
reinstalling anything. Use `--clean` to force a fresh install, `--help` for usage.

**Why prefer `./runUI.sh` over running `npm install` by hand?** It keeps a tiny bookkeeping file inside
`node_modules` that remembers which `package-lock.json` it last installed from. Each time you run it, it
checks two things:

- Does your installed Node version match what `.nvmrc` says? If not, it switches Node for you.
- Does the current `package-lock.json` match the one in the bookkeeping file? If not (for example, you
  just pulled a teammate's changes that touched dependencies), it wipes `node_modules`/`.nuxt`/`.output`
  and does a fresh `npm ci`, then updates the bookkeeping file.

If everything already matches, it skips straight to starting the dev server — no reinstalling, nothing
deleted.

If you install packages by hand (`npm install` or `npm ci`) outside of `./runUI.sh`, the bookkeeping file
isn't updated. Nothing breaks, but the next time you run `./runUI.sh` it will do one extra clean reinstall
to catch up. Sticking with `./runUI.sh` keeps your environment in sync automatically and avoids that extra
wait.

**Production** (build the optimized output, then serve it on `http://localhost:3000`):

```bash
npm ci            # first run, or after dependency changes
npm run build
npm run start
```

(`npm run preview` also serves a production build.)

### In Docker

One [`Dockerfile`](Dockerfile) and one [`compose.yaml`](compose.yaml) cover both the standard and Parallel
Works cases.

**Standard** (`http://localhost:3000`):

```bash
docker compose up --build
```

**Parallel Works** (custom host, base path, and port) — export the variables, then run the *same* command:

```bash
export pw_platform_host=your-host.example.com
export basepath=/ngencerf-ui
export ngencerf_port=8080
docker compose up --build
```

This bakes `NGENCERF_BASE_URL=https://$pw_platform_host$basepath/api/` into the image, serves the app under
`$basepath/`, and publishes it on `$ngencerf_port`. With none of those variables set, the same file builds
the plain local image.

To stop the container, press `Ctrl+C` (or `docker compose down` if you ran it detached). To open a shell
inside the running container for troubleshooting, run `docker compose exec ngencerf-app bash`.

## 2. Pull in node-package updates

After pulling changes that touch `.nvmrc`, `package.json`, or `package-lock.json`:

- **Local dev:** just run `./runUI.sh` — it detects the drift (Node version and/or dependencies) and does a
  clean reinstall before starting. Nothing to delete by hand.
- **Local prod:** `npm ci && npm run build && npm run start`.
- **Docker:** re-run the compose command with `--build` to rebuild the image.

## 3. Safely update node packages (maintainers)

Updating dependencies is a deliberate, tested process — never something the launcher does automatically.
Work in small, reversible steps:

1. **Baseline.** On a clean branch, confirm dev *and* prod both come up (see Section 1) before changing anything.
2. **Update in tiers, one commit per tier:**
   - In-range / transitive bumps: `npm update`.
   - A specific major: `npx npm-check-updates -u <package>` then `npm install`. Read that package's
     migration notes/changelog first.
   - Don't bump everything at once — isolate changes so a regression is easy to bisect and revert.
3. **Always verify from a clean state** (in-place installs can hide problems):

   ```bash
   rm -rf node_modules .nuxt .output
   npm ci               # or `npm install` if you changed package.json
   npm run build
   npm run start        # prod — expect HTTP 200 at http://localhost:3000
   npm run dev          # dev  — expect HTTP 200 at http://localhost:3000
   ```

   Watch the output for warnings/errors, not just the 200, and click through the UI.
4. **`npm audit`** — confirm no new vulnerabilities were introduced.
5. **Commit small**, describing what changed, so any tier can be reverted on its own.

### Updating the pinned Node / npm version

The Node and npm versions are pinned in four places — keep them in sync:

- [`.nvmrc`](.nvmrc)
- [`package.json`](package.json) — `engines.node`
- [`Dockerfile`](Dockerfile) — `NODE_VERSION`, `NPM_VERSION`
- [`.github/workflows/cicd.yml`](.github/workflows/cicd.yml) — `NODE_VERSION`

Prefer a Node **LTS** release. After bumping, re-verify from clean as in step 3, and rebuild the Docker
image (`docker compose build`) since the container installs its own Node.
