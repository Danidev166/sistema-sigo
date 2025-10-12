const fs = require('fs');

async function updateEnvForRender() {
    try {
        console.log('🔧 Actualizando .env.production para Render...\n');
        
        const envContent = `# ======== SEGURIDAD ========
JWT_SECRET=ec11e9e5e0441caf922866776e42ef49bcf9c4e28b7e6b7ab97a61d5eaf3b51e6109a6cf69d12f3530f18f98280847eccc52e44712041205196413b5e050c3c8                     
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=6d832e1ef8fe9711bb5b83ad15ff0832a64566efff4331793c58ef260b8394c471c5d3a0750e8cd297045339f9a2883fd13e0d8b18868c7887997dcb9586a8a6           
REFRESH_TOKEN_EXPIRES_IN=7d

# ======== BASE DE DATOS (PostgreSQL) ========
# Configuración para Render
DATABASE_URL=postgresql://sigo_user:qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv@dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com:5432/sigo_pro
PG_SSL=true

# Variables individuales para compatibilidad
PGHOST=dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com
PGPORT=5432
PGUSER=sigo_user
PGPASSWORD=qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv
PGDATABASE=sigo_pro

# ======== ENTORNO/API ========
NODE_ENV=production
PORT=3001
API_PREFIX=/api

# ======== EMAIL ========
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=sigosistemaintegraldeorientaci@gmail.com
MAIL_PASS=zyurksrtgdzhnghe
MAIL_FROM=SIGO <sigosistemaintegraldeorientaci@gmail.com>

# ======== FRONTEND ========
FRONTEND_URLS=https://sigo-caupolican.onrender.com

# ======== EXTRAS ========
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AUTH_MAX_REQUESTS=5
LOG_LEVEL=info
ENABLE_METRICS=true
HEALTH_CHECK_INTERVAL=30000
CACHE_TTL=3600
CACHE_MAX_SIZE=1000
UPLOAD_MAX_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png
ALERT_EMAIL=pamefern5@gmail.com

# ======== FRONTEND (singular para compatibilidad) ========
FRONTEND_URL=https://sigo-caupolican.onrender.com
`;

        // Hacer backup del archivo actual
        if (fs.existsSync('.env.production')) {
            fs.copyFileSync('.env.production', '.env.production.backup');
            console.log('✅ Backup creado: .env.production.backup');
        }
        
        // Escribir nueva configuración
        fs.writeFileSync('.env.production', envContent);
        console.log('✅ .env.production actualizado para Render');
        
        // Verificar que se escribió correctamente
        const newContent = fs.readFileSync('.env.production', 'utf8');
        console.log('✅ Archivo actualizado correctamente');
        console.log('📋 DATABASE_URL configurada:', newContent.includes('sigo_user'));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

updateEnvForRender();
