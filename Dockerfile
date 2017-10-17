FROM node:boron

WORKDIR /go/src/github.com/iced-mocha/front-end
COPY . .
RUN npm install

CMD [ "npm", "start" ]
