ARG BASE_REPO=rockylinux
ARG BASE_TAG=9.3

FROM ${BASE_REPO}:${BASE_TAG}

# OCI Metadata Arguments
ARG BASE_REPO
ARG BASE_TAG
ARG BASE_NAME="${BASE_REPO}:${BASE_TAG}"
ARG BASE_DIGEST="unknown"
ARG BASE_REVISION="unknown"
ARG IMAGE_SOURCE="unknown"
ARG IMAGE_VENDOR="unknown"
ARG IMAGE_VERSION="unknown"
ARG IMAGE_REVISION="unknown"
ARG IMAGE_CREATED="unknown"

# OCI Standard Labels
LABEL org.opencontainers.image.base.name="${BASE_NAME}" \
    org.opencontainers.image.base.digest="${BASE_DIGEST}" \
    io.ngwpc.image.base.revision="${BASE_REVISION}" \
    org.opencontainers.image.source="${IMAGE_SOURCE}" \
    org.opencontainers.image.vendor="${IMAGE_VENDOR}" \
    org.opencontainers.image.version="${IMAGE_VERSION}" \
    org.opencontainers.image.revision="${IMAGE_REVISION}" \
    org.opencontainers.image.created="${IMAGE_CREATED}" \
    org.opencontainers.image.title="NGENCERF UI" \
    org.opencontainers.image.description="Docker image for the NGENCERF UI application"

# runtime dependencies
RUN set -eux; \
    dnf install -y dnf-plugins-core; \
    dnf config-manager --set-enabled crb; \
    dnf install -y --allowerasing \
        file \
        findutils \
        git \
        openssl openssl-devel \
        which \
        xz \
        jq \
        curl \
    ; \
    dnf clean all; \
    rm -rf /var/cache/dnf

# set node and npm versions
ARG NODE_VERSION=22.17.0
ARG NPM_VERSION=10.9.2
ARG NODE_TAR_URL="https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz"

# install node
RUN curl --fail --silent --show-error --location "$NODE_TAR_URL" | \
    tar --extract --xz --directory=/usr/local --strip-components=1

# add node binaries to PATH
ENV PATH="/usr/local/bin:${PATH}"

# update npm version
RUN npm install -g npm@${NPM_VERSION} && npm cache clean --force

# create and set working directory
RUN mkdir --parents /var/www/ngencerf/nuxt-app
WORKDIR /var/www/ngencerf/nuxt-app

# install node dependencies
COPY package*.json ./
RUN set -eux; \
    npm ci

COPY . .

RUN set -eux; \
    npm run build

# Extract Git information and write it to a JSON file at $GIT_INFO_PATH
COPY .git .git

RUN set -eux; \
    # Get the remote URL from Git configuration
    repo_url=$(git config --get remote.origin.url); \
    # Extract the repo name (everything after the last slash) and remove any trailing .git
    key=${repo_url##*/}; \
    key=${key%.git}; \
    # Construct the file path using the derived key
    GIT_INFO_PATH="${key}_git_info.json"; \
    jq -n \
      --arg commit_hash "$(git rev-parse HEAD)" \
      --arg branch "$(git rev-parse --abbrev-ref HEAD)" \
      --arg tags "$(git tag --points-at HEAD | tr '\n' ' ')" \
      --arg author "$(git log -1 --pretty=format:'%an')" \
      --arg commit_date "$(date -u -d @$(git log -1 --pretty=format:'%ct') +'%Y-%m-%d %H:%M:%S UTC')" \
      --arg message "$(git log -1 --pretty=format:'%s' | tr '\n' ';')" \
      --arg build_date "$(date -u +'%Y-%m-%d %H:%M:%S UTC')" \
      "{\"$key\": {commit_hash: \$commit_hash, branch: \$branch, tags: \$tags, author: \$author, commit_date: \$commit_date, message: \$message, build_date: \$build_date}}" \
      > $GIT_INFO_PATH

RUN rm --recursive --force .git

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

ENTRYPOINT [ "npm" ] 
CMD [ "run", "start" ]

EXPOSE 3000
