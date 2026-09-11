#!/usr/bin/env bash
#
# runUI.sh — run ngencerf-ui locally in dev mode.
#
# Brings your local environment into sync with what the repo declares, then
# starts the dev server. It only does work when something has actually drifted:
#
#   1. Node version — if `node -v` differs from .nvmrc, install (if needed) and
#      switch to that version via nvm, and use it for the rest of this run. If
#      it already matches, nvm is never touched.
#   2. Dependencies — if anything has drifted (Node was just switched,
#      node_modules is missing, or package-lock.json changed), wipe
#      node_modules/.nuxt/.output and reinstall with `npm ci` so the state is
#      always fresh and clean. If everything already matches, nothing is
#      installed or deleted.
#   3. Regenerate git build info, then start the dev server (`npm run dev`).
#
# It never UPGRADES anything — it only matches the committed .nvmrc and
# package-lock.json. Upgrading Node or packages is a deliberate, manual
# process performed by a maintainer (see the README).

set -euo pipefail

# Resolve the repo root (this script's directory) and run from there, no matter
# where the script was invoked from.
ngencerf_ui="$(cd "$(dirname "$(realpath "${BASH_SOURCE[0]}")")" && pwd)"
cd "$ngencerf_ui"

clean=0
for arg in "$@"; do
    case "$arg" in
        --clean) clean=1 ;;
        -h|--help)
            cat <<'EOF'
Usage: ./runUI.sh [--clean] [--help]

Runs ngencerf-ui locally in dev mode, first syncing your environment to the
repo. If your Node differs from .nvmrc it switches to that version via nvm,
installing it first if you don't already have it. If anything has drifted (Node switched, node_modules missing, or
package-lock.json changed) it wipes node_modules/.nuxt/.output and runs
`npm ci` for a fresh, clean install. If you are already in sync it starts the
dev server without reinstalling or deleting anything.

  --clean      Force a fresh install even if nothing has drifted (wipes
               node_modules, .nuxt and .output before installing).
  -h, --help   Show this help and exit.
EOF
            exit 0 ;;
        *) echo "Unknown option: $arg (try --help)" >&2; exit 1 ;;
    esac
done

# Make generate_git_info() available (the source step itself prints a
# confirmation line we don't need to see).
source "$ngencerf_ui/generate_git_info.sh" >/dev/null

# --- 1. Node version: install/switch to .nvmrc only if it differs ------------
node_switched=0
required_node="$(cat "$ngencerf_ui/.nvmrc")"
current_node="$(node -v 2>/dev/null | sed 's/^v//' || true)"

if [[ "$current_node" != "$required_node" ]]; then
    echo "Node version mismatch: found ${current_node:-<none>}, this repo requires ${required_node} (per .nvmrc)."
    export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
    if [[ ! -s "$NVM_DIR/nvm.sh" ]]; then
        echo "nvm not found at \$NVM_DIR ($NVM_DIR)." >&2
        echo "Install it: https://github.com/nvm-sh/nvm#installing-and-updating" >&2
        exit 1
    fi
    echo "Switching to Node ${required_node} via nvm (installing it first if not already present)..."
    # nvm's scripts reference unset variables; relax `set -u` while we use it.
    set +u
    \. "$NVM_DIR/nvm.sh"
    nvm install "$required_node"
    nvm use "$required_node"
    set -u
    node_switched=1
    echo "Now using Node $(node -v) for this run."
    echo "This switch applies to this run only. To make ${required_node} the default"
    echo "in every new shell (so you don't have to switch each time), run:"
    echo "    nvm alias default ${required_node}"
else
    echo "Node ${current_node} matches .nvmrc; no switch needed."
fi

# --- 2. Dependencies: any drift triggers a full clean reinstall --------------
# Stale build artifacts (.nuxt/.output) or node_modules left over from a
# different Node version or an older lockfile cause subtle, hard-to-debug
# failures, so any drift wipes everything and reinstalls fresh. The only path
# that deletes nothing is when Node and the lockfile already match.
#
# To tell whether node_modules is current, we snapshot the package-lock.json we
# installed from into node_modules/.runui-package-lock.json and compare against
# it on the next run. (npm's own node_modules/.package-lock.json is a reduced
# form of the lockfile, not byte-identical to it, so it can't be compared
# directly.) The snapshot lives in node_modules, so a wipe correctly forces a
# reinstall.
lock_snapshot="node_modules/.runui-package-lock.json"
install_reason=""
if [[ "$clean" -eq 1 ]]; then
    install_reason="--clean requested"
elif [[ "$node_switched" -eq 1 ]]; then
    install_reason="Node version changed"
elif [[ ! -d node_modules ]]; then
    install_reason="node_modules not found"
elif [[ ! -f "$lock_snapshot" ]]; then
    install_reason="no record of which lockfile node_modules was built from"
elif ! cmp -s package-lock.json "$lock_snapshot"; then
    install_reason="package-lock.json changed since last install"
fi

if [[ -n "$install_reason" ]]; then
    echo "Reinstalling (${install_reason}); wiping node_modules, .nuxt and .output for a clean state..."
    rm -rf node_modules .nuxt .output
    npm ci
    # Record the lockfile we just installed from so the next run can detect drift.
    cp package-lock.json "$lock_snapshot"
else
    echo "Node and dependencies already in sync; nothing to install."
fi

# --- 3. Git build info, then the dev server ----------------------------------
generate_git_info || echo "Warning: could not generate git build info (continuing)." >&2
echo
echo "Starting ngencerf-ui in dev mode (npm run dev)..."
npm run dev
