FROM node:24.10.0-alpine3.22

ENV PORT 8080
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY  --chown=node:node . .

# Run as non-root user for security
USER node

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
