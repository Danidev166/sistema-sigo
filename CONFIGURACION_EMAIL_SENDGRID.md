# 📧 Configuración de Email con SendGrid

## 🔧 Paso 1: Crear cuenta en SendGrid

1. Ve a [sendgrid.com](https://sendgrid.com)
2. Crea cuenta gratuita (100 emails/día gratis)
3. Verifica tu email

## 🔧 Paso 2: Obtener API Key

1. Ve a Settings → API Keys
2. Create API Key → Full Access
3. Copia la API Key generada

## 🔧 Paso 3: Instalar dependencia

```bash
cd backend
npm install @sendgrid/mail
```

## 🔧 Paso 4: Actualizar emailService.js

```javascript
const sgMail = require('@sendgrid/mail');

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const enviarCodigoRecuperacion = async ({ to, codigo }) => {
  if (process.env.NODE_ENV === "development") {
    console.log("📨 [SIMULADO] Enviar código a:", to);
    console.log("🔑 Código de recuperación:", codigo);
    return;
  }

  const msg = {
    to,
    from: process.env.MAIL_FROM || 'noreply@sigo.com',
    subject: 'Código de recuperación de contraseña - SIGO',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0e1a33;">🔑 Código de Recuperación</h2>
        <p>Hola,</p>
        <p>Has solicitado recuperar tu contraseña. Usa el siguiente código:</p>
        <div style="background: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #0e1a33; font-size: 32px; margin: 0;">${codigo}</h1>
        </div>
        <p>Este código expira en 15 minutos.</p>
        <p>Si no solicitaste este cambio, ignora este email.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Sistema SIGO - Liceo Técnico</p>
      </div>
    `,
  };

  await sgMail.send(msg);
};
```

## 🔧 Paso 5: Variables de entorno

```env
# SendGrid
SENDGRID_API_KEY=tu_api_key_aqui
MAIL_FROM=noreply@sigo.com
```

## ✅ Ventajas de SendGrid

- **100 emails/día gratis**
- **Templates profesionales**
- **Analytics detallados**
- **Muy confiable**
- **Escalable**

## ⚠️ Limitaciones

- Requiere verificación de dominio para emails personalizados
- 100 emails/día en plan gratuito



