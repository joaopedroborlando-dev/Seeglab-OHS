FROM node:20-alpine AS builder

WORKDIR /app

# Instala as dependências
COPY package*.json ./
RUN npm ci

# Copia o restante do projeto e faz o build (Typescript)
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Instala apenas as dependências de produção
COPY package*.json ./
RUN npm ci --omit=dev

# Copia o código compilado da etapa anterior
COPY --from=builder /app/dist ./dist

# Variáveis de ambiente padrão
ENV PORT=3001

EXPOSE 3001

# Inicia a aplicação
CMD ["node", "dist/app.js"]
