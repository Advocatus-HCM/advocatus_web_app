FROM node:lts

WORKDIR "/app"

COPY . .

CMD ["sh", "-c", "npm install && npm run dev"]