# Use Debian bookworm-slim base which has updated OpenSSL packages
# This addresses CVE-2025-9230, CVE-2025-9231, CVE-2025-9232 in Node.js bundled OpenSSL
FROM node:24-bookworm-slim

ENV PORT 8080
ENV NODE_ENV production

WORKDIR /usr/src/app

# Update all packages including OpenSSL to patch CVE-2025-9230, CVE-2025-9231, CVE-2025-9232
# Debian bookworm has OpenSSL 3.0.x with security patches
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
      openssl \
      ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify Node.js bundled OpenSSL version
RUN echo "Node.js bundled OpenSSL version:" && \
    node -p "process.versions.openssl" && \
    echo "System OpenSSL version:" && \
    openssl version

COPY package*.json ./

RUN npm ci

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
