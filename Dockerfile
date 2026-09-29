# syntax=docker/dockerfile:1.4

############################################################################
# Change/Verify these values when adopting this Dockerfile into another org:
#   IMAGE_NAMESPACE, WORKDIR_PATH, NGENCERF_UI_CONTAINER_PORT
############################################################################

# Ownership / branding overrides
ARG IMAGE_NAMESPACE=ngwpc

############################################################################
# Base image
############################################################################

# Use the official Node.js Bookworm image rather than installing Node manually
# into a generic operating-system image.
#
# Pin NODE_VERSION for reproducible builds. Update deliberately when adopting
# a newer supported Node.js release.
#
# The base is also pinned by digest so it cannot change underneath the same
# tag. The digest is what gets pulled; the tag stays for readability. It is the
# multi-arch index digest, so builds still resolve the right platform. Refresh
# NODE_VERSION and NODE_IMAGE_DIGEST together:
#   docker buildx imagetools inspect node:<version>-bookworm-slim
ARG NODE_VERSION=24.16.0
ARG NODE_IMAGE_DIGEST=sha256:2c87ef9bd3c6a3bd4b472b4bec2ce9d16354b0c574f736c476489d09f560a203
ARG BASE_IMAGE=node:${NODE_VERSION}-bookworm-slim@${NODE_IMAGE_DIGEST}

############################################################################
# Application image
############################################################################

FROM ${BASE_IMAGE}

# Re-expose args after FROM for use in this stage
ARG IMAGE_NAMESPACE
ARG NODE_VERSION

# OCI Metadata Arguments
ARG BASE_IMAGE
ARG BASE_NAME="${BASE_IMAGE}"
ARG BASE_DIGEST="unknown"
ARG BASE_REVISION="unknown"
ARG IMAGE_SOURCE="unknown"
ARG IMAGE_VENDOR="unknown"
ARG IMAGE_VERSION="unknown"
ARG IMAGE_REVISION="unknown"

# OCI Standard Labels
LABEL org.opencontainers.image.base.name="${BASE_NAME}" \
      org.opencontainers.image.base.digest="${BASE_DIGEST}" \
      io.${IMAGE_NAMESPACE}.image.base.revision="${BASE_REVISION}" \
      org.opencontainers.image.source="${IMAGE_SOURCE}" \
      org.opencontainers.image.vendor="${IMAGE_VENDOR}" \
      org.opencontainers.image.version="${IMAGE_VERSION}" \
      org.opencontainers.image.revision="${IMAGE_REVISION}" \
      org.opencontainers.image.title="NGENCERF UI" \
      org.opencontainers.image.description="Docker image for the NGENCERF UI application"

# Build and runtime dependencies
RUN --mount=type=cache,target=/var/cache/apt,id=apt-cache-ui-bookworm,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,id=apt-lib-ui-bookworm,sharing=locked \
    set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        file \
        findutils \
        git \
        openssl \
        xz-utils \
        jq \
        curl \
        ca-certificates \
    ; \
    rm -rf /var/lib/apt/lists/*

# npm version
ARG NPM_VERSION=11.13.0

# Update npm version
RUN set -eux; \
    npm install --global "npm@${NPM_VERSION}"; \
    npm cache clean --force

# Create and set working directory
ARG WORKDIR_PATH=/var/www/ngencerf/nuxt-app
RUN mkdir --parents "${WORKDIR_PATH}"
WORKDIR "${WORKDIR_PATH}"

# Install Node dependencies
COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm,id=npm-cache-ui-bookworm \
    set -eux; \
    npm ci

COPY . .

# Extract Git information and write it to the Nuxt public directory.
# Files in public/ are copied into the production output during npm run build
# and are served from the root URL.
RUN set -eux; \
    # Get the remote URL from Git configuration
    repo_url="$(git config --get remote.origin.url)"; \
    repo_url="${repo_url%/}"; \
    # Extract the repo name (everything after the last slash) and remove any trailing .git
    key="${repo_url##*/}"; \
    key="${key%.git}"; \
    # Construct the public file path using the derived repository name
    GIT_INFO_PATH="public/${key}_git_info.json"; \
    mkdir --parents "$(dirname "${GIT_INFO_PATH}")"; \
    jq -n \
      --arg commit_hash "$(git rev-parse HEAD)" \
      --arg branch "$(git rev-parse --abbrev-ref HEAD)" \
      --arg tags "$(git tag --points-at HEAD | tr '\n' ' ')" \
      --arg author "$(git log -1 --pretty=format:'%an')" \
      --arg commit_date "$(date -u -d "@$(git log -1 --pretty=format:'%ct')" +'%Y-%m-%d %H:%M:%S UTC')" \
      --arg message "$(git log -1 --pretty=format:'%s' | tr '\n' ';')" \
      --arg build_date "$(date -u +'%Y-%m-%d %H:%M:%S UTC')" \
      "{\"$key\": {commit_hash: \$commit_hash, branch: \$branch, tags: \$tags, author: \$author, commit_date: \$commit_date, message: \$message, build_date: \$build_date}}" \
      > "${GIT_INFO_PATH}"; \
    rm --recursive --force .git

# Optional build-time API base URL baked into the bundle. When not provided it
# is empty and nuxt.config.ts falls back to its default. AWS overrides it at run
# time instead, via NUXT_PUBLIC_NGENCERF_BASE_URL (Nuxt runtime config).
ARG NGENCERF_BASE_URL
ENV NGENCERF_BASE_URL="${NGENCERF_BASE_URL}"

RUN set -eux; \
    npm run build

# Port the server listens on. The production server (Nitro, `npm run start`)
# reads PORT; NUXT_PORT is only honored by `nuxt dev`/`nuxt preview`. Both are
# set from one value so dev and prod agree. Override at build time
# (--build-arg NGENCERF_UI_CONTAINER_PORT=...) or at run time (-e PORT=...).
ARG NGENCERF_UI_CONTAINER_PORT=3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=${NGENCERF_UI_CONTAINER_PORT} \
    PORT=${NGENCERF_UI_CONTAINER_PORT}

ENTRYPOINT ["npm"]
CMD ["run", "start"]

EXPOSE ${NGENCERF_UI_CONTAINER_PORT}
