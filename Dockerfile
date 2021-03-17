FROM node:12.21.0-alpine3.10
WORKDIR /src
RUN apk add --no-cache make gcc g++
COPY package.json /src
COPY proxy.json /src
RUN npm install
RUN npm install pm2 -g
COPY . /src
EXPOSE 80
CMD ["pm2-runtime", "ecosystem.config.js"]