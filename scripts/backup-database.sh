#!/bin/bash

# Script de backup automático para SIGO PRO
# Uso: ./backup-database.sh [directorio_destino]

set -e

# Configuración
DB_HOST=${PGHOST:-localhost}
DB_PORT=${PGPORT:-5432}
DB_USER=${PGUSER:-postgres}
DB_NAME=${PGDATABASE:-sigo_db}
BACKUP_DIR=${1:-/backups}
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="sigo_backup_${DATE}.sql"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Verificar que pg_dump está disponible
if ! command -v pg_dump &> /dev/null; then
    print_error "pg_dump no está instalado. Instala PostgreSQL client tools."
    exit 1
fi

# Crear directorio de backup si no existe
if [ ! -d "$BACKUP_DIR" ]; then
    print_status "Creando directorio de backup: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
fi

# Verificar permisos de escritura
if [ ! -w "$BACKUP_DIR" ]; then
    print_error "No hay permisos de escritura en $BACKUP_DIR"
    exit 1
fi

print_status "Iniciando backup de la base de datos SIGO PRO"
print_status "Base de datos: $DB_NAME"
print_status "Host: $DB_HOST:$DB_PORT"
print_status "Usuario: $DB_USER"
print_status "Archivo de destino: $BACKUP_PATH"

# Realizar backup
print_status "Ejecutando pg_dump..."

if pg_dump \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USER" \
    --dbname="$DB_NAME" \
    --verbose \
    --clean \
    --if-exists \
    --create \
    --format=plain \
    --file="$BACKUP_PATH" 2>/dev/null; then
    
    print_success "Backup completado exitosamente"
    
    # Verificar que el archivo se creó y tiene contenido
    if [ -f "$BACKUP_PATH" ] && [ -s "$BACKUP_PATH" ]; then
        FILE_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
        print_success "Archivo de backup creado: $BACKUP_FILE ($FILE_SIZE)"
        
        # Comprimir backup
        print_status "Comprimiendo backup..."
        gzip "$BACKUP_PATH"
        COMPRESSED_FILE="${BACKUP_PATH}.gz"
        COMPRESSED_SIZE=$(du -h "$COMPRESSED_FILE" | cut -f1)
        print_success "Backup comprimido: ${BACKUP_FILE}.gz ($COMPRESSED_SIZE)"
        
        # Limpiar backups antiguos (mantener últimos 7 días)
        print_status "Limpiando backups antiguos (más de 7 días)..."
        find "$BACKUP_DIR" -name "sigo_backup_*.sql.gz" -mtime +7 -delete 2>/dev/null || true
        
        # Mostrar backups disponibles
        print_status "Backups disponibles:"
        ls -lh "$BACKUP_DIR"/sigo_backup_*.sql.gz 2>/dev/null | while read -r line; do
            echo "  $line"
        done
        
        print_success "Backup completado exitosamente"
        
    else
        print_error "El archivo de backup está vacío o no se creó correctamente"
        exit 1
    fi
    
else
    print_error "Error al realizar el backup de la base de datos"
    exit 1
fi

# Opcional: Subir a servicio de almacenamiento en la nube
if [ "$UPLOAD_TO_CLOUD" = "true" ] && [ -n "$CLOUD_BUCKET" ]; then
    print_status "Subiendo backup a la nube..."
    # Aquí puedes agregar comandos para subir a AWS S3, Google Cloud, etc.
    # aws s3 cp "$COMPRESSED_FILE" "s3://$CLOUD_BUCKET/backups/"
    print_warning "Funcionalidad de subida a la nube no implementada"
fi

print_success "Proceso de backup finalizado"
