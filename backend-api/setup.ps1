# ==============================================================================
# Automacao Local Windows
# ==============================================================================

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Iniciando Coturnos e Cia no Docker Sail (Windows native)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Garante a integridade dos arquivos de ambiente (.env)
if (-not (Test-Path .env)) {
    Write-Host "Arquivo .env nao encontrado. Copiando a partir do .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
} else {
    Write-Host "Arquivo .env ja existe. Mantendo configuracoes atuais." -ForegroundColor Green
}

# 2. Limpeza preventiva de processos orfaos que possam travar as portas
Write-Host "Parando possiveis containers orfaos e liberando as portas..." -ForegroundColor Yellow
docker compose down --remove-orphans

# 3. Sobe a infraestrutura completa do Sail em segundo plano
Write-Host "Subindo os containers (Laravel, MySQL, Redis, Mailpit)..." -ForegroundColor Yellow
docker compose up -d

# 4. Garante a existencia da pasta de backups estruturada na Semana 2
if (-not (Test-Path ./database/backups)) {
    New-Item -ItemType Directory -Path ./database/backups | Out-Null
}

# 5. Geracao da chave criptografica unica da aplicacao Laravel
Write-Host "Gerando chave unica da aplicacao..." -ForegroundColor Yellow
docker compose exec laravel.test php artisan key:generate

# 6. Reseta e popula o banco de dados oficial de forma transparente
Write-Host "Executando migrations e povoando tabelas (Seeders)..." -ForegroundColor Yellow
docker compose exec laravel.test php artisan migrate:fresh --seed

Write-Host "============================================================" -ForegroundColor Green
Write-Host "Ambiente 100% pronto e operacional em nivel profissional!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "API / Back-end : http://localhost:8000" -ForegroundColor White
Write-Host "Mailpit (E-mails): http://localhost:8025" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Green
