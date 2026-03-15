FROM node:20-alpine

WORKDIR /app

COPY apps/api/package*.json ./
RUN npm install

COPY apps/api ./

RUN npx prisma generate --schema prisma/schema.prisma
RUN npm run build

EXPOSE 10000

CMD ["sh", "-c", "npx prisma migrate deploy --schema prisma/schema.prisma || npx prisma db push --schema prisma/schema.prisma; node dist/main"]
