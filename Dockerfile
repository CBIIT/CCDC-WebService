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

WORKDIR /usr/src/app

COPY package*.json ./

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
