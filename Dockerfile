FROM node:24.4.1-alpine3.22

ENV PORT 8080
ENV NODE_ENV production

WORKDIR /usr/src/app

# Upgrade all packages and install specific OpenSSL version to patch CVE-2025-9230, CVE-2025-9231, CVE-2025-9232
# CVE-2025-9230 and CVE-2025-9232 require OpenSSL >= 3.5.4 (fixed in 3.5.4, 3.4.3, 3.3.5, 3.2.6, 3.0.18)
# Use edge repository to get the latest OpenSSL version
RUN echo "@edge https://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories && \
    apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache \
      "openssl@edge" \
      "openssl-dev@edge" && \
    rm -rf /var/cache/apk/*

COPY package*.json ./

RUN npm ci

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
