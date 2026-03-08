FROM node:20-alpine AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist

# Variável de ambiente padrão, pode ser sobrescrita no docker-compose ou runtime
ENV JWT_SECRET=f3f7e1b5b0e5d4a3c2b1a0f9e8d7c6b5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d1

EXPOSE 3000

CMD ["sh", "-c", "npx typeorm migration:run -d dist/Infrastructure/Database/dataSource.migration.js && node dist/main"]
