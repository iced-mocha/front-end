FROM node:boron

WORKDIR /go/src/github.com/icedmocha/front-end
COPY . .
RUN npm install

CMD [ "npm", "start" ]
