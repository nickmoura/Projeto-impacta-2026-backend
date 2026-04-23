FROM node:alpine

WORKDIR /app

RUN apk add --no-cache openssl netcat-openbsd

COPY package*.json ./
RUN npm install

COPY . .

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3000

CMD ["/docker-entrypoint.sh"]