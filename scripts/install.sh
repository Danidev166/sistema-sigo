#!/bin/bash

# Script de instalación automática para SIGO PRO
# Uso: ./install.sh [modo] [directorio]
# Modos: development, production

set -e

# Configuración
INSTALL_MODE=${1:-development}
INSTALL_DIR=${2:-/opt/sigo-pro}
CURRENT_USER=$(whoami)

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

# Verificar si es root
if [ "$EUID" -eq 0 ]; then
    print_warning "Ejecutando como root. Esto es necesario para algunas operaciones del sistema."
fi

print_status "🚀 Iniciando instalación de SIGO PRO"
print_status "Modo: $INSTALL_MODE"
print_status "Directorio: $INSTALL_DIR"

# Verificar sistema operativo
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    print_error "No se pudo determinar el sistema operativo"
    exit 1
fi

print_status "Sistema operativo detectado: $OS $VER"

# Función para instalar dependencias del sistema
install_system_dependencies() {
    print_status "📦 Instalando dependencias del sistema..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        # Actualizar repositorios
        print_status "Actualizando repositorios..."
        apt update
        
        # Instalar dependencias básicas
        print_status "Instalando dependencias básicas..."
        apt install -y curl wget git build-essential software-properties-common
        
        # Instalar Node.js 18
        print_status "Instalando Node.js 18..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt install -y nodejs
        
        # Instalar PostgreSQL
        print_status "Instalando PostgreSQL..."
        apt install -y postgresql postgresql-contrib
        
        # Instalar Nginx
        print_status "Instalando Nginx..."
        apt install -y nginx
        
        # Instalar PM2
        print_status "Instalando PM2..."
        npm install -g pm2
        
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        print_status "Instalando dependencias para CentOS/RHEL..."
        yum update -y
        yum install -y curl wget git gcc gcc-c++ make
        yum install -y postgresql-server postgresql-contrib nginx
        
        # Instalar Node.js
        curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
        yum install -y nodejs
        
        # Instalar PM2
        npm install -g pm2
        
    else
        print_error "Sistema operativo no soportado: $OS"
        exit 1
    fi
    
    print_success "Dependencias del sistema instaladas"
}

# Función para configurar PostgreSQL
setup_postgresql() {
    print_status "🗄️ Configurando PostgreSQL..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        # Iniciar PostgreSQL
        systemctl start postgresql
        systemctl enable postgresql
        
        # Configurar PostgreSQL
        sudo -u postgres psql -c "CREATE DATABASE sigo_db;"
        sudo -u postgres psql -c "CREATE USER sigo_user WITH PASSWORD 'sigo2024';"
        sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE sigo_db TO sigo_user;"
        
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        # Inicializar PostgreSQL
        postgresql-setup initdb
        systemctl start postgresql
        systemctl enable postgresql
        
        # Configurar PostgreSQL
        sudo -u postgres psql -c "CREATE DATABASE sigo_db;"
        sudo -u postgres psql -c "CREATE USER sigo_user WITH PASSWORD 'sigo2024';"
        sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE sigo_db TO sigo_user;"
    fi
    
    print_success "PostgreSQL configurado"
}

# Función para instalar aplicación
install_application() {
    print_status "📱 Instalando aplicación SIGO PRO..."
    
    # Crear directorio de instalación
    mkdir -p "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    
    # Clonar repositorio (asumiendo que ya está en el directorio actual)
    if [ ! -d "sistema-sigo" ]; then
        print_status "Clonando repositorio..."
        git clone https://github.com/tu-usuario/sistema-sigo.git .
    fi
    
    # Instalar dependencias del backend
    print_status "Instalando dependencias del backend..."
    cd backend
    npm ci --only=production
    
    # Instalar dependencias del frontend
    print_status "Instalando dependencias del frontend..."
    cd ../sigo-frontend
    npm ci
    
    # Build del frontend
    print_status "Construyendo frontend..."
    npm run build
    
    print_success "Aplicación instalada"
}

# Función para configurar variables de entorno
setup_environment() {
    print_status "⚙️ Configurando variables de entorno..."
    
    # Crear archivo .env.production para backend
    cat > "$INSTALL_DIR/backend/.env.production" << EOF
# Base de Datos PostgreSQL
PGHOST=localhost
PGPORT=5432
PGUSER=sigo_user
PGPASSWORD=sigo2024
PGDATABASE=sigo_db

# JWT
JWT_SECRET=sigo_jwt_secret_$(openssl rand -hex 32)
JWT_EXPIRES_IN=24h

# Servidor
NODE_ENV=production
PORT=3001

# Frontend
FRONTEND_URL=http://localhost
EOF

    print_success "Variables de entorno configuradas"
}

# Función para configurar Nginx
setup_nginx() {
    print_status "🌐 Configurando Nginx..."
    
    # Crear configuración de Nginx
    cat > /etc/nginx/sites-available/sigo << EOF
server {
    listen 80;
    server_name localhost;

    # Frontend
    location / {
        root $INSTALL_DIR/sigo-frontend/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    # Habilitar sitio
    ln -sf /etc/nginx/sites-available/sigo /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Verificar configuración
    nginx -t
    
    # Reiniciar Nginx
    systemctl restart nginx
    systemctl enable nginx
    
    print_success "Nginx configurado"
}

# Función para configurar PM2
setup_pm2() {
    print_status "🔄 Configurando PM2..."
    
    # Iniciar aplicación con PM2
    cd "$INSTALL_DIR/backend"
    pm2 start ecosystem.config.js --env production
    pm2 save
    pm2 startup
    
    print_success "PM2 configurado"
}

# Función para configurar firewall
setup_firewall() {
    print_status "🔥 Configurando firewall..."
    
    if command -v ufw &> /dev/null; then
        ufw --force enable
        ufw allow ssh
        ufw allow 80
        ufw allow 443
        print_success "Firewall configurado con UFW"
    elif command -v firewall-cmd &> /dev/null; then
        firewall-cmd --permanent --add-service=ssh
        firewall-cmd --permanent --add-service=http
        firewall-cmd --permanent --add-service=https
        firewall-cmd --reload
        print_success "Firewall configurado con firewalld"
    else
        print_warning "No se encontró un firewall configurable"
    fi
}

# Función para configurar backups automáticos
setup_backups() {
    print_status "💾 Configurando backups automáticos..."
    
    # Crear directorio de backups
    mkdir -p /backups
    
    # Crear script de backup
    cp "$INSTALL_DIR/scripts/backup-database.sh" /usr/local/bin/
    chmod +x /usr/local/bin/backup-database.sh
    
    # Configurar cron para backup diario
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-database.sh /backups") | crontab -
    
    print_success "Backups automáticos configurados"
}

# Función para verificar instalación
verify_installation() {
    print_status "🔍 Verificando instalación..."
    
    # Verificar servicios
    if systemctl is-active --quiet postgresql; then
        print_success "PostgreSQL: Activo"
    else
        print_error "PostgreSQL: Inactivo"
    fi
    
    if systemctl is-active --quiet nginx; then
        print_success "Nginx: Activo"
    else
        print_error "Nginx: Inactivo"
    fi
    
    if pm2 list | grep -q "sigo-api"; then
        print_success "PM2: Aplicación ejecutándose"
    else
        print_error "PM2: Aplicación no encontrada"
    fi
    
    # Verificar conectividad
    if curl -s http://localhost > /dev/null; then
        print_success "Frontend: Accesible"
    else
        print_warning "Frontend: No accesible"
    fi
    
    if curl -s http://localhost/api/estudiantes > /dev/null; then
        print_success "Backend API: Accesible"
    else
        print_warning "Backend API: No accesible (puede requerir autenticación)"
    fi
}

# Función principal
main() {
    print_status "🎯 Iniciando instalación de SIGO PRO en modo $INSTALL_MODE"
    
    # Verificar permisos
    if [ "$EUID" -ne 0 ] && [ "$INSTALL_MODE" = "production" ]; then
        print_error "Se requieren permisos de root para instalación en modo producción"
        print_status "Ejecuta: sudo ./install.sh production"
        exit 1
    fi
    
    # Instalar dependencias
    install_system_dependencies
    
    # Configurar PostgreSQL
    setup_postgresql
    
    # Instalar aplicación
    install_application
    
    # Configurar entorno
    setup_environment
    
    # Configurar Nginx
    setup_nginx
    
    # Configurar PM2
    setup_pm2
    
    # Configurar firewall
    setup_firewall
    
    # Configurar backups
    setup_backups
    
    # Verificar instalación
    verify_installation
    
    print_success "🎉 ¡Instalación completada exitosamente!"
    print_status "SIGO PRO está disponible en: http://localhost"
    print_status "API disponible en: http://localhost/api"
    print_status "Documentación: $INSTALL_DIR/DEPLOYMENT.md"
    
    if [ "$INSTALL_MODE" = "production" ]; then
        print_warning "IMPORTANTE: Cambia las contraseñas por defecto en producción"
        print_warning "- Base de datos: Configura contraseña segura para sigo_user"
        print_warning "- JWT Secret: Genera un nuevo JWT_SECRET seguro"
    fi
}

# Ejecutar instalación
main "$@"
