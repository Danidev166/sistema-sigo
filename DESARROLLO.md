# Guía de Desarrollo SIGO

## 🚀 Configuración para Desarrollo Local

### Backend (Puerto 3001)
```bash
cd backend
npm run dev
```
Este comando inicia el backend con CORS configurado para desarrollo local.

### Frontend (Puerto 5174)
```bash
cd sigo-frontend
npm run dev
```

## 🔧 Configuración Automática

- **Desarrollo**: Frontend se conecta a `http://localhost:3001/api`
- **Producción**: Frontend se conecta a `https://sistema-sigo.onrender.com/api`

## ⚠️ Importante

- **NO modificar** la configuración de producción
- **NO hacer commit** de cambios sin probar primero
- **Siempre probar** en Render antes de hacer push

## 🧪 Flujo de Trabajo

1. Trabajar en desarrollo local
2. Probar cambios localmente
3. Hacer commit solo cuando esté seguro
4. Push a GitHub
5. Verificar que Render funcione correctamente
