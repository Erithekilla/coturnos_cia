#!/bin/bash

echo "============================================================"
echo "🚀 Iniciando Coturnos & Cia no Docker Sail (Ambiente Dev) 🚀"
echo "============================================================"

# 1. Garante a integridade dos arquivos de ambiente (.env)
if [ ! -f .env ]; then
    echo "📋 Arquivo .env não encontrado. Copiando a partir do .env.example..."
    cp .env.example .env
else
    echo "✔ Arquivo .env já existe. Mantendo configurações atuais."
fi

# 2. Limpeza preventiva de processos órfãos que possam travar as portas
echo "🧹 Parando possíveis containers órfãos e liberando as portas..."
docker compose down --remove-orphans

# 3. Sobe a infraestrutura completa do Sail em segundo plano
echo "🐳 Subindo os containers (Laravel, MySQL, Redis, Mailpit)..."
./vendor/bin/sail up -d

# 4. Garante a existência da pasta de backups estruturada na Semana 2
mkdir -p ./database/backups

# 5. Geração da chave criptográfica única da aplicação Laravel
echo "🔑 Gerando chave única da aplicação..."
./vendor/bin/sail artisan key:generate

# 6. Reseta e popula o banco de dados oficial de forma transparente
echo "🗄️ Executando migrations e povoando tabelas (Seeders)..."
./vendor/bin/sail artisan migrate:fresh --seed

echo "============================================================"
echo "✔ Ambiente 100% pronto e operacional em nível profissional!"
echo "============================================================"
echo "🌐 API / Back-end : http://localhost:8000"
echo "📬 Mailpit (E-mails): http://localhost:8025"
echo "============================================================"
