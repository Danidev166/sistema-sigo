# 🚀 Guía de Deployment - SIGO

## 📋 Opciones de Deployment Gratuitas

### 🥇 OPCIÓN RECOMENDADA: Railway (100% GRATIS)

#### Ventajas:
- ✅ SQL Server incluido
- ✅ Node.js + Express soportado
- ✅ React + Vite optimizado
- ✅ Auto-deploy desde GitHub
- ✅ Dominio gratuito
- ✅ SSL automático
- ✅ Límites generosos

#### Límites gratuitos:
- **Base de datos**: 1GB de almacenamiento
- **Aplicación**: 512MB RAM, 1 CPU
- **Tráfico**: 100GB/mes
- **Tiempo de actividad**: 99.9%

---

## 🚀 DEPLOYMENT EN RAILWAY

### Paso 1: Preparar el repositorio
```bash
# Asegúrate de que todos los archivos estén en GitHub
git add .
git commit -m "Preparar para deployment"
git push origin main
```

### Paso 2: Crear cuenta en Railway
1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Conecta tu repositorio

### Paso 3: Configurar servicios

#### 3.1 Base de datos SQL Server
1. En Railway, crea un nuevo servicio
2. Selecciona "Database" → "SQL Server"
3. Configura:
   - **Password**: `Sigo2024!Secure`
   - **Database**: `sigo_db`

#### 3.2 Backend Node.js
1. Crea un nuevo servicio
2. Selecciona "GitHub Repo" → tu repositorio
3. Configura:
   - **Root Directory**: `./backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

#### 3.3 Frontend React
1. Crea un nuevo servicio
2. Selecciona "GitHub Repo" → tu repositorio
3. Configura:
   - **Root Directory**: `./sigo-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -l 3000`

### Paso 4: Variables de entorno

#### Backend (.env):
```env
NODE_ENV=production
DB_SERVER=tu-sql-server-url.railway.app
DB_PORT=1433
DB_NAME=sigo_db
DB_USER=sa
DB_PASSWORD=Sigo2024!Secure
JWT_SECRET=tu-jwt-secret-super-seguro-aqui
FRONTEND_URL=https://tu-frontend.railway.app
```

#### Frontend (.env.production):
```env
VITE_API_URL=https://tu-backend.railway.app/api
```

### Paso 5: Desplegar
1. Railway detectará automáticamente los cambios
2. Desplegará cada servicio por separado
3. Te dará URLs únicas para cada servicio

---

## 🥈 OPCIÓN ALTERNATIVA: Render

### Ventajas:
- ✅ Muy fácil de usar
- ✅ Auto-deploy desde GitHub
- ✅ SSL automático
- ❌ No tiene SQL Server (solo PostgreSQL)

### Si eliges Render:
1. Ve a [render.com](https://render.com)
2. Conecta tu GitHub
3. Crea 3 servicios:
   - **Web Service** (Backend)
   - **Static Site** (Frontend)
   - **PostgreSQL** (Base de datos)

---

## 🥉 OPCIÓN HÍBRIDA: Vercel + Railway

### Frontend en Vercel:
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu GitHub
3. Selecciona la carpeta `sigo-frontend`
4. Vercel detectará automáticamente que es Vite

### Backend + DB en Railway:
1. Sigue los pasos de Railway para backend y SQL Server
2. Configura la variable `VITE_API_URL` en Vercel

---

## 💰 COMPARACIÓN DE COSTOS

| Servicio | Plan Gratuito | Límites |
|----------|---------------|---------|
| **Railway** | ✅ GRATIS | 1GB DB, 512MB RAM, 100GB tráfico |
| **Render** | ✅ GRATIS | 750 horas/mes, 1GB RAM |
| **Vercel** | ✅ GRATIS | 100GB bandwidth, ilimitado builds |

---

## 🔧 CONFIGURACIÓN POST-DEPLOYMENT

### 1. Configurar dominio personalizado (opcional)
- Railway te da un dominio gratuito: `tu-app.railway.app`
- Puedes conectar tu propio dominio

### 2. Configurar SSL
- Railway maneja SSL automáticamente
- No necesitas configuración adicional

### 3. Monitoreo
- Railway incluye logs y métricas básicas
- Puedes ver el estado de cada servicio

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error de conexión a base de datos:
1. Verifica que las variables de entorno estén correctas
2. Asegúrate de que el servicio de SQL Server esté funcionando
3. Revisa los logs del backend

### Error de CORS:
1. Verifica que `FRONTEND_URL` esté configurado correctamente
2. Asegúrate de que el frontend esté usando la URL correcta del backend

### Error de build:
1. Revisa que todas las dependencias estén en `package.json`
2. Verifica que los scripts de build estén configurados correctamente

---

## 📞 SOPORTE

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Render**: [render.com/docs](https://render.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)

---

## ✅ CHECKLIST DE DEPLOYMENT

- [ ] Repositorio en GitHub
- [ ] Variables de entorno configuradas
- [ ] Servicios creados en Railway
- [ ] Base de datos funcionando
- [ ] Backend desplegado y funcionando
- [ ] Frontend desplegado y funcionando
- [ ] Pruebas de conectividad
- [ ] SSL funcionando
- [ ] Dominio configurado (opcional)

---

**¡Tu sistema SIGO estará listo para producción! 🎉**

