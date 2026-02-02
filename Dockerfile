FROM node:25.5.0-alpine3.23

ENV PORT 8080
ENV NODE_ENV production

# Fix CVE-2025-64756: Patch glob in npm's system installation
# Vulnerable paths found by AWS Inspector:
# - /usr/local/lib/node_modules/npm/node_modules/glob/
# - /usr/local/lib/node_modules/npm/node_modules/node-gyp/node_modules/glob/
# Fix CVE-2026-23745 and CVE-2026-23950: Patch tar in npm's system installation
# Vulnerable paths found by AWS Inspector:
# - /usr/local/lib/node_modules/npm/node_modules/tar/
# - /usr/local/lib/node_modules/npm/node_modules/node-gyp/node_modules/tar/
RUN npm install -g npm@latest && \
    cd /tmp && \
    # Download safe glob version once
    npm pack glob@11.1.0 && \
    # Download safe tar version (7.5.4 fixes both CVEs)
    npm pack tar@7.5.4 && \
    # Patch glob in npm's direct dependencies
    if [ -d "/usr/local/lib/node_modules/npm/node_modules/glob" ]; then \
        tar -xzf glob-11.1.0.tgz && \
        rm -rf /usr/local/lib/node_modules/npm/node_modules/glob && \
        mv package /usr/local/lib/node_modules/npm/node_modules/glob && \
        rm -f glob-11.1.0.tgz; \
    fi && \
    # Patch glob in node-gyp's dependencies (download again for second location)
    if [ -d "/usr/local/lib/node_modules/npm/node_modules/node-gyp/node_modules/glob" ]; then \
        npm pack glob@11.1.0 && \
        tar -xzf glob-11.1.0.tgz && \
        rm -rf /usr/local/lib/node_modules/npm/node_modules/node-gyp/node_modules/glob && \
        mv package /usr/local/lib/node_modules/npm/node_modules/node-gyp/node_modules/glob && \
        rm -f glob-11.1.0.tgz; \
    fi && \
    # Patch tar in npm's direct dependencies
    if [ -d "/usr/local/lib/node_modules/npm/node_modules/tar" ]; then \
        tar -xzf tar-7.5.4.tgz && \
        rm -rf /usr/local/lib/node_modules/npm/node_modules/tar && \
        mv package /usr/local/lib/node_modules/npm/node_modules/tar && \
        rm -f tar-7.5.4.tgz; \
    fi && \
    # Patch tar in node-gyp's dependencies (download again for second location)
    if [ -d "/usr/local/lib/node_modules/npm/node_modules/node-gyp/node_modules/tar" ]; then \
        npm pack tar@7.5.4 && \
        tar -xzf tar-7.5.4.tgz && \
        rm -rf /usr/local/lib/node_modules/npm/node_modules/node-gyp/node_modules/tar && \
        mv package /usr/local/lib/node_modules/npm/node_modules/node-gyp/node_modules/tar && \
        rm -f tar-7.5.4.tgz; \
    fi && \
    rm -rf /tmp/package /tmp/glob-* /tmp/tar-* 2>/dev/null || true

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci && \
    # Ensure project-level glob is also safe
    npm install glob@^11.1.0 --no-save || npm install glob@^10.5.0 --no-save || true && \
    # Ensure project-level tar is also safe (fixes CVE-2026-23745 and CVE-2026-23950)
    npm install tar@^7.5.4 --no-save || true

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
