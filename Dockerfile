FROM node:lts-stretch-slim as build
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
FROM node:lts-stretch-slim as run
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY --from=build /usr/src/app/ts-built ./ts-built
CMD ["node", "ts-built/router.js"]