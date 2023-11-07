FROM node:20.9.0-alpine

RUN apk update && apk upgrade
RUN apk add nodejs
RUN rm -rf /var/cache/apk/*

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .

CMD ["npm", "run", "start"]

EXPOSE 5000