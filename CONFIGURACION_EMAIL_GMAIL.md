# 📧 Configuración de Email con Gmail

## 🔧 Paso 1: Crear App Password en Gmail

1. **Habilitar 2FA en tu cuenta de Gmail**:
   - Ve a [myaccount.google.com](https://myaccount.google.com)
   - Seguridad → Verificación en 2 pasos → Activar

2. **Generar App Password**:
   - Ve a Seguridad → Contraseñas de aplicaciones
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Escribe "SIGO Sistema"
   - Copia la contraseña generada (16 caracteres)

## 🔧 Paso 2: Configurar variables de entorno

Agrega estas variables a tu archivo `backend/.env`:

```env
# Configuración de Email Gmail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu_email@gmail.com
MAIL_PASS=tu_app_password_de_16_caracteres
```

## 🔧 Paso 3: Probar el envío

```bash
cd backend
node -e "
const { enviarCodigoRecuperacion } = require('./utils/emailService');
enviarCodigoRecuperacion({
  to: 'tu_email@gmail.com',
  codigo: '123456'
}).then(() => console.log('✅ Email enviado')).catch(console.error);
"
```

## ✅ Ventajas de Gmail

- **100% Gratis** para hasta 500 emails/día
- **Muy confiable** (99.9% de entrega)
- **Fácil configuración**
- **No requiere servidor SMTP externo**
- **Funciona desde cualquier lugar**

## ⚠️ Limitaciones

- Máximo 500 emails por día
- Requiere 2FA activado
- Solo funciona con cuentas de Gmail



