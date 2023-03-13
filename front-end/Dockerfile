FROM node:18.4-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --silent
RUN npm install react-scripts@5.0.1 -g --silent
RUN npm install nodemon --save-dev

COPY . ./

CMD npm run watch