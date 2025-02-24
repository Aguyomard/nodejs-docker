FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm install -g nodemon

COPY . .

EXPOSE 3000
