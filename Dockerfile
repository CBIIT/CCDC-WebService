FROM node:24.0.2-alpine3.21

ENV PORT 8080
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

#USER node

COPY  --chown=node:node . .

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
