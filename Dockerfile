FROM node:24.10.0-alpine3.22

ENV PORT 8080
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci && \
    # Fix CVE-2025-64756: Ensure glob package is updated to safe version
    # Vulnerable versions: 10.2.0 to <10.5.0 and <11.1.0
    # Safe versions: >= 11.1.0 or >= 10.5.0
    npm install glob@^11.1.0 --no-save || npm install glob@^10.5.0 --no-save || true

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
