FROM node:lts-stretch-slim
RUN apt-get update && apt-get install -y graphicsmagick
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm install -g typescript
RUN tsc
CMD ["node", "app.js"]