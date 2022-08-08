FROM node:14-alpine

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /var/app
COPY ./package.json /var/app/package.json
RUN npm install
COPY ./ /var/app/

CMD npm start

