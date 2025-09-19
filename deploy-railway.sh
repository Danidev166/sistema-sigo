#!/bin/bash

echo "🚀 Desplegando SIGO en Railway..."

# Verificar que Railway CLI esté instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no está instalado. Instalando..."
    npm install -g @railway/cli
fi

# Login a Railway
echo "🔐 Iniciando sesión en Railway..."
railway login

# Crear proyecto
echo "📦 Creando proyecto en Railway..."
railway init

# Configurar variables de entorno
echo "⚙️ Configurando variables de entorno..."
railway variables set NODE_ENV=production
railway variables set SA_PASSWORD="Sigo2024!Secure"
railway variables set DB_NAME="sigo_db"
railway variables set JWT_SECRET="tu-jwt-secret-super-seguro-aqui"
railway variables set FRONTEND_URL="https://tu-dominio.railway.app"

# Desplegar
echo "🚀 Desplegando aplicación..."
railway up

echo "✅ ¡Despliegue completado!"
echo "🌐 Tu aplicación estará disponible en: https://tu-dominio.railway.app"

