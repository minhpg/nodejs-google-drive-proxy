FROM node:12.21.0-alpine3.10
WORKDIR /src
RUN apk add --no-cache make gcc g++
COPY package.json /src
COPY proxy.json /src
RUN npm install
COPY . /src
EXPOSE 80
CMD ["npm","start"]