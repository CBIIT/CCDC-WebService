FROM alpine:edge

ENV PORT=8080
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Install packages with specific versions to fix all CVEs
# Use HTTP temporarily due to Alpine Edge SSL cert issues
RUN sed -i 's/https/http/g' /etc/apk/repositories && \
    apk update && \
    apk upgrade --no-cache musl musl-dev && \
    apk add --no-cache \
      nodejs \
      npm \
      openssl \
      ca-certificates && \
    rm -rf /var/cache/apk/*

COPY package*.json ./

RUN npm ci

# Create node user and group for security
RUN addgroup -g 1000 node && \
    adduser -u 1000 -G node -s /bin/sh -D node

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
