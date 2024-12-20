# Sistema de Estoque - Documentação

## Introdução

Este é um sistema de controle de estoque que permite gerenciar produtos, realizar movimentações de entrada e saída de itens e visualizar o histórico de alterações no estoque.

O projeto utiliza as seguintes tecnologias:

- **Backend**: Node.js, Prisma, TypeScript
- **Banco de Dados**: PostgreSQL com Docker
- **Frontend**: React, Tailwind CSS, TypeScript

## Tecnologias Utilizadas

- **Node.js**: Plataforma para execução do backend.
- **Prisma**: ORM para manipulação de dados no PostgreSQL.
- **TypeScript**: Utilizado tanto no backend quanto no frontend.
- **PostgreSQL**: Banco de dados relacional.
- **Docker**: Para containerizar o PostgreSQL.
- **React**: Biblioteca para construção da interface de usuário.
- **Tailwind CSS**: Framework CSS para estilização.

## Estrutura do Projeto

/backend ├── /src │ ├── /controllers # Controladores de lógica para gerenciar os produtos e movimentações 
├── /routes # Rotas para a API │ ├── /services # Lógica de negócios │ ├── /prisma # Prisma - configuração e interações com o banco de dados │─
/node_modules # Dependências do backend ├── prisma.schema # Definição do esquema do banco de dados ├── package.json # Dependências e scripts do backend ├── tsconfig.json # Configuração do TypeScript └──
.env # Variáveis de ambiente (conexão com o banco)

/frontend ├── /src │ ├── ├── 
/pages # Páginas principais do sistema │ ├──  
├── /node_modules # Dependências do frontend ├── package.json # Dependências e scripts do frontend ├── 
tsconfig.json # Configuração do TypeScript ├── tailwind.config.js # Configuração do Tailwind CSS └── .env # Variáveis de ambiente

## Clonando o projeto 


## Como Baixar e Usar o Projeto

### 1. Clonar o Repositório

Para começar, você precisa clonar o repositório do projeto. Use o comando abaixo:

```bash
git clone https://github.com/seu-usuario/sistema-de-estoque.git
cd sistema-de-estoque

## 2. Backend

### 2.1. Instalar Dependências

Entre na pasta `backend` e instale as dependências do projeto backend:

cd backend
npm install

script : npm run dev

### 2.2. Configuração do Banco de Dados

Este projeto utiliza o PostgreSQL. Você pode rodá-lo localmente utilizando o Docker com o seguinte comando:
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres

#### Explicação do comando:

- `--name some-postgres`: Nome do container.
- `-e POSTGRES_PASSWORD=mysecretpassword`: Senha do banco de dados.
- `-d`: Rodar o container em segundo plano.
- `postgres`: Utiliza a imagem oficial do PostgreSQL.
### 2.3. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na pasta do backend (`/backend`) e adicione as variáveis de ambiente para a conexão com o banco de dados:
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/postgres

### 2.3. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na pasta do backend (`/backend`) e adicione as variáveis de ambiente para a conexão com o banco de dados:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=meubanco
DB_USER=meuusuario
DB_PASSWORD=mysecretpassword

#### 2.4. Gerar o Cliente Prisma

Antes de rodar a aplicação, gere o cliente Prisma para interagir com o banco de dados:

```bash
npx prisma generate

2.5. Rodar o Backend

Agora, você pode rodar o servidor backend com o comando:

npm run dev

O servidor backend estará rodando em http://localhost:4444.


### 3. Frontend

#### 3.1. Instalar Dependências

Agora, vá para a pasta do frontend e instale as dependências:

```bash
cd frontend
npm install

# Sistema de Estoque - Documentação

## Introdução

Este é um sistema de controle de estoque que permite gerenciar produtos, realizar movimentações de entrada e saída de itens e visualizar o histórico de alterações no estoque.

O projeto utiliza as seguintes tecnologias:

- **Backend**: Node.js, Prisma, TypeScript
- **Banco de Dados**: PostgreSQL com Docker
- **Frontend**: React, Tailwind CSS, TypeScript

## Tecnologias Utilizadas

- **Node.js**: Plataforma para execução do backend.
- **Prisma**: ORM para manipulação de dados no PostgreSQL.
- **TypeScript**: Utilizado tanto no backend quanto no frontend.
- **PostgreSQL**: Banco de dados relacional.
- **Docker**: Para containerizar o PostgreSQL.
- **React**: Biblioteca para construção da interface de usuário.
- **Tailwind CSS**: Framework CSS para estilização.

### 3. Frontend

#### 3.1. Instalar Dependências

Agora, vá para a pasta do frontend e instale as dependências:

```bash
rodar 
npm run dev

## 5. Endpoints da API

### A API backend oferece os seguintes endpoints:

    GET /getProducts: Retorna todos os produtos do estoque.
    POST /addProducts: Cria um novo produto.
    PUT /updateProducts/:id: Atualiza um produto existente.
    DELETE /deleteProducts/:id: Deleta um produto do estoque.
 







