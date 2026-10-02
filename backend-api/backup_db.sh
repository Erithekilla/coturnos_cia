#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p ./database/backups
docker compose exec mysql mysqldump -u sail -ppassword coturnos_cia > ./database/backups/coturnos_$TIMESTAMP.sql
echo "✔ Backup realizado com sucesso: ./database/backups/coturnos_$TIMESTAMP.sql"