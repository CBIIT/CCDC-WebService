FROM node:24.19.0-alpine3.23 AS dependencies

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

FROM node:24.19.0-alpine3.23 AS runtime

ENV PORT=8080
ENV NODE_ENV=production

# Upgrade the runtime packages from the same Alpine release channel.
RUN apk upgrade --no-cache \
    && apk add --no-cache --upgrade \
        'openssl>=3.5.7-r0' \
        'libcrypto3>=3.5.7-r0' \
        'libssl3>=3.5.7-r0'

# The service starts with node directly. npm, npx, and Node's bundled OpenSSL
# headers are build-time tooling and are not needed in the runtime image.
RUN rm -rf \
    /usr/local/include/node/openssl \
    /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx

WORKDIR /usr/src/app

COPY --from=dependencies --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --chown=node:node package.json app.js ./
COPY --chown=node:node Components ./Components
COPY --chown=node:node Config ./Config
COPY --chown=node:node Controllers ./Controllers
COPY --chown=node:node Middleware ./Middleware
COPY --chown=node:node Models ./Models
COPY --chown=node:node Public ./Public
COPY --chown=node:node Routes ./Routes
COPY --chown=node:node Services ./Services
COPY --chown=node:node Utils ./Utils

USER node

EXPOSE 8080 9200 3306

CMD ["node", "app.js"]
