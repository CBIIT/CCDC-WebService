FROM node:25.6.0-alpine3.23

ENV PORT 8080
ENV NODE_ENV production

# Update tar to 7.5.7 to fix CVE in npm's bundled tar (7.5.4)
RUN mkdir -p /tmp/tar-update && \
    cd /tmp/tar-update && \
    npm init -y && \
    npm install tar@7.5.7 --legacy-peer-deps && \
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

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
