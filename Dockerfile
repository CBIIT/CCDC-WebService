FROM node:24.4.1-alpine3.22

ENV PORT 8080
ENV NODE_ENV production

WORKDIR /usr/src/app

# Still upgrade to be explicit and future-proof in CI
RUN apk update && apk upgrade --no-cache openssl openssl-dev

COPY package*.json ./

RUN npm ci

#USER node

COPY  --chown=node:node . .

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
