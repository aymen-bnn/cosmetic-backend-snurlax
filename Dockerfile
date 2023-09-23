FROM node:alpine

WORKDIR /src/app

COPY package*.json .

RUN npm ci

COPY . . 

CMD ["npm" , "start"]

