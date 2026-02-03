FROM node:25-alpine3.23

ENV PORT 8080
ENV NODE_ENV production

# Update tar to 7.5.7 to fix CVE in npm's bundled tar (7.5.4)
RUN cd /usr/local/lib/node_modules/npm/node_modules && \
    rm -rf tar && \
    npm pack tar@7.5.7 && \
    tar -xzf tar-7.5.7.tgz && \
    mv package tar && \
    rm tar-7.5.7.tgz

WORKDIR /usr/src/app

COPY package*.json ./

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
