FROM node:24.19.0-alpine3.23

ENV PORT 8080
ENV NODE_ENV production

# OS: Alpine OpenSSL 3.5.7-r0 closes CVE-2026-34182 (critical) and related OpenSSL highs
# (CVE-2026-45445, CVE-2026-9076, CVE-2026-7383, CVE-2026-34180, CVE-2026-42764,
#  CVE-2026-34183, CVE-2026-45447, CVE-2026-34181). Official node alpine tags can
# lag the v3.23 package repo, so upgrade OpenSSL at build time.
RUN apk upgrade --no-cache \
    && apk add --no-cache --upgrade \
        'openssl>=3.5.7-r0' \
        'libcrypto3>=3.5.7-r0' \
        'libssl3>=3.5.7-r0'

# Node 24.19.0 includes the June 2026 (v24.17.0) and July 2026 (v24.18.1) security
# releases: CVE-2026-48930 (critical), CVE-2026-58043, CVE-2026-48615,
# CVE-2026-48617, CVE-2026-48619, CVE-2026-48937.

# Keep npm on the 11.x line that ships with Node 24, then replace bundled copies
# scanners still flag under npm's node_modules.
RUN npm install -g npm@11.19.0

# tar@7.5.22: CVE-2026-59871, CVE-2026-59873, CVE-2026-59874, CVE-2026-73566
# brace-expansion@5.0.9: CVE-2026-13149, CVE-2026-14257
# ip-address@10.5.0: CVE-2026-69192
RUN mkdir -p /tmp/cve-fix && \
    cd /tmp/cve-fix && \
    npm init -y && \
    npm install tar@7.5.22 brace-expansion@5.0.9 ip-address@10.5.0 minimatch@10.2.6 @isaacs/brace-expansion@5.0.1 --legacy-peer-deps && \
    NPM_ROOT=/usr/local/lib/node_modules/npm && \
    rm -rf "$NPM_ROOT/node_modules/tar" && \
    cp -r node_modules/tar "$NPM_ROOT/node_modules/" && \
    rm -rf "$NPM_ROOT/node_modules/brace-expansion" && \
    cp -r node_modules/brace-expansion "$NPM_ROOT/node_modules/" && \
    rm -rf "$NPM_ROOT/node_modules/ip-address" && \
    cp -r node_modules/ip-address "$NPM_ROOT/node_modules/" && \
    rm -rf "$NPM_ROOT/node_modules/minimatch" && \
    cp -r node_modules/minimatch "$NPM_ROOT/node_modules/" && \
    mkdir -p "$NPM_ROOT/node_modules/@isaacs" && \
    rm -rf "$NPM_ROOT/node_modules/@isaacs/brace-expansion" && \
    cp -r node_modules/@isaacs/brace-expansion "$NPM_ROOT/node_modules/@isaacs/" && \
    find "$NPM_ROOT/node_modules" -type d -path '*/node_modules/tar' ! -path "$NPM_ROOT/node_modules/tar" -exec rm -rf {} + 2>/dev/null || true && \
    find "$NPM_ROOT/node_modules" -type d -path '*/node_modules/brace-expansion' ! -path "$NPM_ROOT/node_modules/brace-expansion" ! -path '*/@isaacs/*' -exec rm -rf {} + 2>/dev/null || true && \
    find "$NPM_ROOT/node_modules" -type d -path '*/node_modules/ip-address' ! -path "$NPM_ROOT/node_modules/ip-address" -exec rm -rf {} + 2>/dev/null || true && \
    rm -rf /tmp/cve-fix

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
