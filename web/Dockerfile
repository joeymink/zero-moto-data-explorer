FROM node:12.18

RUN mkdir /app
WORKDIR /app

COPY ./package.json /app/package.json

RUN npm install

COPY ./index.js /app/index.js

CMD ["npm", "run", "ingest"]
