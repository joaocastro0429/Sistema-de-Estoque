# Build Stage
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Prisma precisa ser gerado antes do build
RUN npx prisma generate

# Build do TypeScript
RUN npm run build

# Production Stage
FROM node:18-slim

WORKDIR /app

# Instala dependências (copia node_modules já preparado)
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

# Copia a pasta dist (JS compilado) e a pasta do Prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/.env ./

# Expondo porta
EXPOSE 3000

# Executa as migrations e inicia o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
