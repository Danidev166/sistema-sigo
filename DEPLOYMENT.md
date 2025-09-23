# 🚀 Guía de Despliegue - SIGO PRO

## 📋 Resumen del Sistema

SIGO PRO es un sistema de gestión integral para orientación estudiantil que consta de:
- **Frontend**: React + Vite (Puerto 5174)
- **Backend**: Node.js + Express + PostgreSQL (Puerto 3001)
- **Base de Datos**: PostgreSQL

## 🔧 Requisitos del Sistema

### Servidor de Producción
- **Node.js**: >= 18.18
- **PostgreSQL**: >= 12
- **RAM**: Mínimo 2GB, recomendado 4GB
- **Disco**: Mínimo 10GB libres
- **Sistema Operativo**: Linux (Ubuntu 20.04+ recomendado)

### Variables de Entorno Requeridas

#### Backend (.env.production)
```env
# Base de Datos PostgreSQL
PGHOST=localhost
PGPORT=5432
PGUSER=tu_usuario_db
PGPASSWORD=tu_password_db
PGDATABASE=sigo_db

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# Servidor
NODE_ENV=production
PORT=3001

# Frontend
FRONTEND_URL=https://tu-dominio.com

# Email (opcional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu_email@gmail.com
MAIL_PASS=tu_app_password_de_16_caracteres
```

## 🚀 Proceso de Despliegue

### 1. Preparación del Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Instalar Nginx (opcional, para proxy reverso)
sudo apt install nginx -y

# Instalar PM2 para gestión de procesos
sudo npm install -g pm2
```

### 2. Configuración de PostgreSQL

```bash
# Acceder a PostgreSQL
sudo -u postgres psql

# Crear base de datos y usuario
CREATE DATABASE sigo_db;
CREATE USER sigo_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE sigo_db TO sigo_user;
\q
```

### 3. Despliegue del Backend

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/sistema-sigo.git
cd sistema-sigo/backend

# Instalar dependencias
npm ci --only=production

# Configurar variables de entorno
cp env.example .env.production
nano .env.production  # Editar con valores reales

# Iniciar con PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 4. Despliegue del Frontend

```bash
cd ../sigo-frontend

# Instalar dependencias
npm ci

# Build para producción
npm run build

# Servir archivos estáticos con Nginx
sudo cp -r dist/* /var/www/html/
```

### 5. Configuración de Nginx

```bash
# Crear configuración
sudo nano /etc/nginx/sites-available/sigo

# Contenido del archivo:
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/sigo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Configuración de SSL (Opcional)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com

# Renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔍 Verificación del Despliegue

### 1. Verificar Backend
```bash
# Verificar que PM2 está ejecutando el proceso
pm2 status

# Verificar logs
pm2 logs sigo-api

# Probar API
curl http://localhost:3001/api/estudiantes
```

### 2. Verificar Frontend
```bash
# Verificar que Nginx está sirviendo archivos
curl http://localhost/

# Verificar que el proxy funciona
curl http://localhost/api/estudiantes
```

### 3. Verificar Base de Datos
```bash
# Conectar a PostgreSQL
psql -h localhost -U sigo_user -d sigo_db

# Verificar tablas
\dt
```

## 📊 Monitoreo y Mantenimiento

### 1. Logs del Sistema
```bash
# Logs de PM2
pm2 logs sigo-api

# Logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs de PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### 2. Backup de Base de Datos
```bash
# Crear script de backup
sudo nano /usr/local/bin/backup-sigo.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U sigo_user sigo_db > /backups/sigo_backup_$DATE.sql
find /backups -name "sigo_backup_*.sql" -mtime +7 -delete

# Hacer ejecutable
sudo chmod +x /usr/local/bin/backup-sigo.sh

# Programar backup diario
sudo crontab -e
# Agregar: 0 2 * * * /usr/local/bin/backup-sigo.sh
```

### 3. Actualizaciones
```bash
# Actualizar código
cd /ruta/del/proyecto
git pull origin main

# Reinstalar dependencias si es necesario
cd backend && npm ci --only=production
cd ../sigo-frontend && npm ci && npm run build

# Reiniciar servicios
pm2 restart sigo-api
sudo systemctl reload nginx
```

## 🛠️ Solución de Problemas

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos
```bash
# Verificar que PostgreSQL está ejecutándose
sudo systemctl status postgresql

# Verificar configuración de conexión
psql -h localhost -U sigo_user -d sigo_db
```

#### 2. Error 502 Bad Gateway
```bash
# Verificar que el backend está ejecutándose
pm2 status

# Verificar logs del backend
pm2 logs sigo-api

# Verificar configuración de Nginx
sudo nginx -t
```

#### 3. Error de Permisos
```bash
# Verificar permisos de archivos
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

## 📈 Optimizaciones de Rendimiento

### 1. Configuración de PostgreSQL
```sql
-- En /etc/postgresql/*/main/postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

### 2. Configuración de Nginx
```nginx
# En /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 1024;

# Compresión
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 3. Configuración de PM2
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: "sigo-api",
    script: "index.js",
    exec_mode: "cluster",
    instances: "max",
    env_production: {
      NODE_ENV: "production",
      PORT: 3001
    }
  }]
}
```

## 🔒 Consideraciones de Seguridad

### 1. Firewall
```bash
# Configurar UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 3001  # Bloquear acceso directo al backend
```

### 2. Variables de Entorno
- Nunca commitear archivos `.env` al repositorio
- Usar contraseñas seguras y únicas
- Rotar JWT secrets regularmente

### 3. Base de Datos
- Configurar autenticación fuerte
- Habilitar SSL para conexiones
- Realizar backups regulares

## 📞 Soporte

Para problemas técnicos o consultas:
- **Documentación**: Ver README.md
- **Issues**: Crear issue en GitHub
- **Logs**: Revisar logs del sistema

---

**¡SIGO PRO está listo para producción!** 🎉
