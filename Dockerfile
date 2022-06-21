FROM node:lts-stretch-slim
WORKDIR /usr/src/app

#COPY package.json ./
COPY . .

RUN npm install

#RUN npm install pm2 -g


#RUN npm run build

#COPY ./dist .

#EXPOSE 4000

#CMD ["pm2-runtime","app.js"]

RUN npm install -g typescript

RUN tsc

CMD ["node", "app.js"]