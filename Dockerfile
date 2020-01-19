FROM node

WORKDIR ./var/app

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 3001:3001

CMD npm run dev
