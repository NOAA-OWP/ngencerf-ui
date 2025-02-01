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

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

ENTRYPOINT [ "npm" ] 
CMD [ "run", "start" ]

EXPOSE 3000
