FROM node

WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

ENTRYPOINT [ "npm" ]

CMD ["run", "dev"]