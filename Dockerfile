FROM node:20.14.0-alpine

ENV PORT 8080
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

#USER node

COPY  --chown=node:node . .

EXPOSE 8080 9200 3306

CMD [ "node", "app.js" ]
