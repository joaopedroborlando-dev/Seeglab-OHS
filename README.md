# Seeglab OSH - Projeto Fullstack
Este projeto cosiste em uma aplicação web para gerenciamento de Segurança e Saúde Ocupacional e como forma de aplicar meus   conhecimentos em desenvolvimento de software. O projeto foi desenvolvido em Node.js com TypeScript e um Frontend em Angular.

## 🛠 Tecnologias Utilizadas

### Backend
- Node.js & Express
- TypeScript
- TypeORM (com PostgreSQL)
- Autenticação com JWT & bcrypt

### Frontend
- Angular 21
- Bootstrap 5 & Bootstrap Icons
- ngx-translate (Internacionalização)
- RxJS

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18+ recomendada)
- [npm](https://www.npmjs.com/) (geralmente instalado junto com o Node.js)
- [PostgreSQL](https://www.postgresql.org/) (para o banco de dados do backend)

---

## 🚀 Como Rodar o Projeto

O projeto é dividido em duas partes principais: `backend` e `frontend`. Cada uma deve ser rodada em um terminal separado.

### 1. Configurando e Rodando o Backend

1. Abra um terminal e navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. **Configuração de Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz da pasta `backend` com as variáveis necessárias (ex: credenciais do banco de dados PostgreSQL, segredo do JWT, porta do servidor, etc).
   *(Caso exista um arquivo `.env.example`, você pode copiá-lo e renomeá-lo para `.env`)*.

4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   *O backend usará `nodemon` e `ts-node` para reiniciar automaticamente a cada alteração.*

#### Outros comandos úteis do Backend:
- `npm run build`: Compila o código TypeScript para JavaScript.
- `npm run migration:generate`: Gera uma nova migration baseada nas entidades.
- `npm run migration:run`: Executa as migrations no banco de dados.

---

### 2. Configurando e Rodando o Frontend

1. Abra um novo terminal (mantendo o do backend aberto) e navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento do Angular:
   ```bash
   npm start
   ```

4. Acesse a aplicação no seu navegador. Normalmente, o Angular roda na porta 4200:
   [http://localhost:4200](http://localhost:4200)

#### Outros comandos úteis do Frontend:
- `npm run build`: Compila o projeto para produção.
- `npm test`: Roda os testes unitários.
