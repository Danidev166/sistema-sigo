# 📧 Configurar Gmail para SIGO - Paso a Paso

## 🎯 **OBJETIVO**
Configurar Gmail para que el sistema SIGO pueda enviar emails reales de recuperación de contraseña.

## ⏱️ **TIEMPO ESTIMADO**: 5 minutos

---

## 🔧 **PASO 1: Habilitar 2FA en Gmail**

1. **Ve a tu cuenta de Google**:
   - Abre [myaccount.google.com](https://myaccount.google.com)
   - Inicia sesión con tu cuenta de Gmail

2. **Activar verificación en 2 pasos**:
   - Ve a **Seguridad** (lado izquierdo)
   - Busca **"Verificación en 2 pasos"**
   - Haz clic en **"Comenzar"**
   - Sigue las instrucciones para activar 2FA

---

## 🔑 **PASO 2: Generar App Password**

1. **Ir a contraseñas de aplicaciones**:
   - En la misma página de Seguridad
   - Busca **"Contraseñas de aplicaciones"**
   - Haz clic en **"Contraseñas de aplicaciones"**

2. **Crear nueva contraseña**:
   - Selecciona **"Correo"** como aplicación
   - Selecciona **"Otro (nombre personalizado)"** como dispositivo
   - Escribe: **"SIGO Sistema"**
   - Haz clic en **"Generar"**

3. **Copiar la contraseña**:
   - Aparecerá una contraseña de 16 caracteres
   - **¡CÓPIALA AHORA!** (solo se muestra una vez)
   - Ejemplo: `abcd efgh ijkl mnop`

---

## ⚙️ **PASO 3: Configurar el archivo .env**

1. **Crear/editar el archivo .env**:
   - Ve a la carpeta `backend/`
   - Crea o edita el archivo `.env`

2. **Agregar las variables**:
   ```env
   # Configuración de Email Gmail
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_SECURE=false
   MAIL_USER=tu_email@gmail.com
   MAIL_PASS=tu_app_password_de_16_caracteres
   ```

3. **Reemplazar los valores**:
   - `tu_email@gmail.com` → Tu email real de Gmail
   - `tu_app_password_de_16_caracteres` → La contraseña de 16 caracteres que copiaste

---

## 🧪 **PASO 4: Probar el envío**

1. **Abrir terminal en la carpeta backend**:
   ```bash
   cd backend
   ```

2. **Ejecutar script de prueba**:
   ```bash
   node test-email.js tu_email@gmail.com
   ```

3. **Verificar resultado**:
   - Deberías ver: `✅ ¡Prueba completada!`
   - Revisa tu bandeja de entrada (y spam)
   - Deberías recibir un email con código de 6 dígitos

---

## 🚀 **PASO 5: Activar emails en producción**

1. **Cambiar NODE_ENV**:
   - En tu archivo `.env`, cambia:
   ```env
   NODE_ENV=production
   ```

2. **Reiniciar el backend**:
   ```bash
   npm start
   ```

3. **Probar desde el frontend**:
   - Ve a http://localhost:5174
   - Haz clic en "¿Olvidaste tu contraseña?"
   - Ingresa tu email
   - Deberías recibir el email real

---

## ✅ **VERIFICACIÓN FINAL**

Si todo está bien configurado, deberías ver:

1. **En la consola del backend**:
   ```
   ✅ Email de recuperación enviado a: tu_email@gmail.com
   ```

2. **En tu bandeja de entrada**:
   - Email con asunto: "🔑 Código de recuperación de contraseña - SIGO"
   - Código de 6 dígitos en formato bonito
   - Diseño profesional con colores del sistema

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### ❌ "Error: Invalid login"
- **Causa**: App Password incorrecto
- **Solución**: Genera una nueva App Password

### ❌ "Error: Username and Password not accepted"
- **Causa**: 2FA no activado
- **Solución**: Activa verificación en 2 pasos primero

### ❌ "Error: Connection timeout"
- **Causa**: Firewall o antivirus bloqueando
- **Solución**: Permite conexiones SMTP en tu antivirus

### ❌ No recibo el email
- **Causa**: Email en spam
- **Solución**: Revisa carpeta de spam y marca como "No es spam"

---

## 🎉 **¡LISTO!**

Tu sistema SIGO ahora puede enviar emails reales de recuperación de contraseña usando Gmail.

**Límites de Gmail**:
- ✅ 500 emails por día (más que suficiente)
- ✅ 100% gratuito
- ✅ 99.9% de entrega
- ✅ Funciona desde cualquier lugar



