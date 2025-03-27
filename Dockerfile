FROM registry.sh.nextgenwaterprediction.com/infrastructure/rockylinux/rockylinux:latest


# runtime dependencies
RUN set -eux; \
    dnf install -y yum-utils ; \
    dnf config-manager --set-enabled crb; \
    dnf install -y \
        file \
        findutils \
        git \
        openssl openssl-devel \
        which \
        xz \
        jq \
    ; \
    dnf clean all

ARG NODE_TAR_URL="https://nodejs.org/dist/v22.13.1/node-v22.13.1-linux-x64.tar.xz"

# install Node.js
RUN curl --fail --silent --show-error --location "$NODE_TAR_URL" | \
    tar --extract --xz --directory=/usr/local --strip-components=1

# add Node.js binaries to PATH
ENV PATH="/usr/local/bin:${PATH}"

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
