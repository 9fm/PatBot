FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY tsconfig.json tsconfig.json
COPY src src

RUN npm run build

CMD [ "node", "--env-file=.env", "dist/main.js" ]
