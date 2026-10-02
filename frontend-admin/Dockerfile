# ==========================================
# Estágio 1: Dependências e Desenvolvimento (Padrão)
# ==========================================
FROM node:20-alpine AS dev

WORKDIR /app

# Otimização do cache das dependências
COPY package*.json ./
RUN npm ci --silent || npm install

# Copia o restante dos arquivos do projeto
COPY . .

EXPOSE 5174

CMD ["npm", "run", "dev", "--", "--host"]

# ==========================================
# Estágio 2: Build de Produção
# ==========================================
FROM dev AS builder

ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ==========================================
# Estágio 3: Servidor Web Nginx (Produção)
# ==========================================
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

# --- LINHA ADICIONADA: Injeta as rotas do Nginx corrigidas ---
COPY nginx.conf /etc/nginx/conf.d/default.conf
# -------------------------------------------------------------

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
