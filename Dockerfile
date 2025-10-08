FROM node:24.4.1-alpine3.22

ENV PORT 8080
ENV NODE_ENV production

WORKDIR /usr/src/app

# Upgrade all packages including OpenSSL to patch CVE-2025-9230, CVE-2025-9231, CVE-2025-9232
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache --upgrade openssl openssl-dev && \
    apk cache clean

RUN apk update && \
    apk add --no-cache \
      "openssl=3.5.4-r0" \
      "openssl-dev=3.5.4-r0" && \
    rm -rf /var/cache/apk/*

COPY package*.json ./

RUN npm ci

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
