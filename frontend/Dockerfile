FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./
RUN npm ci

# Copia o restante do código
COPY . .

# Faz o build da aplicação Angular
RUN npm run build -- --configuration production

# Stage 2: Serve
FROM nginx:alpine

# Dependendo da versão do Angular e do builder usado, a saída pode estar na pasta browser.
# Se o COPY falhar por não encontrar 'browser', altere para COPY --from=builder /app/dist/seeglab /usr/share/nginx/html
COPY --from=builder /app/dist/seeglab/browser /usr/share/nginx/html

# Copia a configuração do NGINX para fallback de rotas SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
