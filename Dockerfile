# Use full Debian bookworm base (not slim) for complete security patches
# Addresses: CVE-2025-6020, CVE-2025-9230, CVE-2025-9231, CVE-2024-22365, CVE-2025-9232
FROM node:24-bookworm

ENV PORT 8080
ENV NODE_ENV production

WORKDIR /usr/src/app

# Comprehensive security update to patch all CVEs
# CVE-2024-22365 (PAM), CVE-2025-9230/9231/9232 (OpenSSL), CVE-2025-6020
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get dist-upgrade -y && \
    apt-get install -y --no-install-recommends \
      libpam0g \
      libpam-modules \
      libpam-runtime \
      openssl \
      libssl3 \
      ca-certificates && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify versions for security audit
RUN echo "=== Security Package Versions ===" && \
    echo "Node.js bundled OpenSSL:" && \
    node -p "process.versions.openssl" && \
    echo "System OpenSSL:" && \
    openssl version && \
    echo "PAM version:" && \
    dpkg -l | grep libpam0g || echo "PAM info not available"

COPY package*.json ./

RUN npm ci

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
