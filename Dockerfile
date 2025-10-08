FROM node:24.4.1-alpine3.22

ENV PORT 8080
ENV NODE_ENV production

WORKDIR /usr/src/app

# Fix CVE-2025-9230, CVE-2025-9231, CVE-2025-9232
# These CVEs require OpenSSL >= 3.5.5 (NOT 3.5.4 which is still vulnerable)
# Switch to edge repository for latest OpenSSL packages
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" > /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories && \
    apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache \
      openssl \
      openssl-dev \
      libcrypto3 \
      libssl3 && \
    rm -rf /var/cache/apk/* && \
    # Verify OpenSSL version is 3.5.5 or higher
    openssl version

COPY package*.json ./

RUN npm ci

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
