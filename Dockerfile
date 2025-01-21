FROM registry.sh.nextgenwaterprediction.com/infrastructure/rockylinux/rockylinux:latest


# runtime dependencies
RUN set -eux; \
    dnf install -y yum-utils ; \
    dnf config-manager --set-enabled crb; \
    dnf module install -y nodejs:20; \
    dnf install -y \
        file \
        findutils \
        git \
        openssl openssl-devel \
        which \ 
    ; \
    dnf clean all

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

ENTRYPOINT [ "/usr/bin/npm" ] 
CMD [ "run", "start" ]

EXPOSE 3000
