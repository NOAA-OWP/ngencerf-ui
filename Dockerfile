# syntax=docker/dockerfile:1.4

############################################################################
# Change/Verify these values when adopting this Dockerfile into another org:
#   IMAGE_NAMESPACE
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
ARG NODE_VERSION=24.16.0
ARG BASE_IMAGE=node:${NODE_VERSION}-bookworm-slim

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
RUN mkdir --parents /var/www/ngencerf/nuxt-app
WORKDIR /var/www/ngencerf/nuxt-app

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

# TODO: Determine whether this override is still needed for AWS deployments.
# Override the NGENCERF URL to facilitate Parallel Works session sharing.
# When this argument is not provided, NGENCERF_BASE_URL is set to an empty
# string; nuxt.config.ts must treat that as a request to use its default URL.
ARG NGENCERF_BASE_URL
ENV NGENCERF_BASE_URL="${NGENCERF_BASE_URL}"

RUN set -eux; \
    npm run build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

ENTRYPOINT ["npm"]
CMD ["run", "start"]

EXPOSE 3000
