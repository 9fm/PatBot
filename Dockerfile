FROM node:20-alpine

WORKDIR /usr/src/app

RUN npm install typescript -g
COPY package.json .
RUN npm install

COPY tsconfig.json tsconfig.json
COPY src src

RUN npm run build

CMD [ "node", "dist/main.js" ]
