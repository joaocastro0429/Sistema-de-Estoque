FROM node:18

WORKDIR /app

# Copia package.json e package-lock.json (se existir)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o restante do código da aplicação
COPY . .

# Comando para rodar a aplicação (exemplo)
CMD ["npm", "start"]
