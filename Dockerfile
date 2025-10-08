# Fix CVE-2025-9230 and CVE-2025-9232 using Alpine Edge
# Per AWS Inspector: OpenSSL 3.5.4 fixes these CVEs
FROM alpine:edge

ENV PORT=8080
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Install Node.js and OpenSSL 3.5.4 from Alpine Edge (fixes CVEs)
RUN apk update && \
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
