FROM node:24.16.0-alpine3.23

ENV PORT 8080
ENV NODE_ENV production

# Upgrade npm to latest version to address CVE-2026-0775 (npm 11.8.0 vulnerability)
RUN npm install -g npm@latest

# Update tar to 7.5.11 to fix CVE in npm's bundled tar (7.5.4)
RUN mkdir -p /tmp/tar-update && \
    cd /tmp/tar-update && \
    npm init -y && \
    npm install tar@7.5.11 --legacy-peer-deps && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/tar && \
    cp -r node_modules/tar /usr/local/lib/node_modules/npm/node_modules/ && \
    rm -rf /tmp/tar-update

# Fix CVE GHSA-7h2j-956f-4vf2: Update @isaacs/brace-expansion from 5.0.0 to 5.0.1 in npm's node_modules
RUN mkdir -p /tmp/brace-expansion-update && \
    cd /tmp/brace-expansion-update && \
    npm init -y && \
    npm install @isaacs/brace-expansion@5.0.1 --legacy-peer-deps && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/@isaacs/brace-expansion && \
    cp -r node_modules/@isaacs/brace-expansion /usr/local/lib/node_modules/npm/node_modules/@isaacs/ && \
    rm -rf /tmp/brace-expansion-update

# Fix minimatch vulnerability and CVE-2026-25547: keep npm's unscoped brace-expansion outside vulnerable 5.0.0-5.0.6 range
RUN mkdir -p /tmp/minimatch-update && \
    cd /tmp/minimatch-update && \
    npm init -y && \
    npm install minimatch@10.2.3 --legacy-peer-deps && \
    npm install brace-expansion@4.0.1 balanced-match@3.0.1 --legacy-peer-deps --force && \
    rm -rf node_modules/minimatch/node_modules/brace-expansion && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/minimatch && \
    cp -r node_modules/minimatch /usr/local/lib/node_modules/npm/node_modules/ && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/brace-expansion && \
    cp -r node_modules/brace-expansion /usr/local/lib/node_modules/npm/node_modules/ && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/balanced-match && \
    cp -r node_modules/balanced-match /usr/local/lib/node_modules/npm/node_modules/ && \
    rm -rf /tmp/minimatch-update

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
