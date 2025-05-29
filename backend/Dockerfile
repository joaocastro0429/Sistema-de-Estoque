# Etapa de build
FROM node:18

# Diretório dentro do container
WORKDIR /app

# Copia os arquivos da subpasta backend
COPY backend/package*.json ./

RUN npm install

COPY backend . 

EXPOSE 3000

CMD ["npm", "start"]
