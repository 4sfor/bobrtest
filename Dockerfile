FROM node:22.5.1-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

CMD ["node", "./bot/index.js"]
