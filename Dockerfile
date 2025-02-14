FROM node:lts

WORKDIR "/app"

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm install && npm run dev"]