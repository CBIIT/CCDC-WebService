FROM node:25.6.1-slim

ENV PORT 8080
ENV NODE_ENV production

# Upgrade npm to latest version to address CVE-2026-0775 (npm 11.8.0 vulnerability)
RUN npm install -g npm@latest

# Update tar to 7.5.8 to fix CVE in npm's bundled tar (7.5.4)
RUN mkdir -p /tmp/tar-update && \
    cd /tmp/tar-update && \
    npm init -y && \
    npm install tar@7.5.8 --legacy-peer-deps && \
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

# Fix minimatch vulnerability: Update npm's bundled minimatch from 10.1.2 to 10.2.1
RUN mkdir -p /tmp/minimatch-update && \
    cd /tmp/minimatch-update && \
    npm init -y && \
    npm install minimatch@10.2.1 --legacy-peer-deps && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/minimatch && \
    cp -r node_modules/minimatch /usr/local/lib/node_modules/npm/node_modules/ && \
    rm -rf /tmp/minimatch-update

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
