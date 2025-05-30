# Etapa 1 - Build do frontend
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY front-end/package*.json ./
RUN npm install
COPY front-end/ .
RUN npm run build

# Etapa 2 - Build do backend
FROM node:20 AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

# Etapa 3 - Imagem final
FROM node:20
WORKDIR /app

# Copia backend
COPY --from=backend /app/backend ./

# Copia build do frontend para a pasta public
COPY --from=frontend /app/frontend/build ./public

# Instala apenas as dependências de produção
RUN npm install --omit=dev

# Porta que o Render usa
ENV PORT=10000

# Expondo a porta
EXPOSE 10000

# Comando para iniciar o servidor
CMD ["node", "dist/server.js"]
    