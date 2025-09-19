# 📧 Configuración de Email con EmailJS

## 🔧 Paso 1: Crear cuenta en EmailJS

1. Ve a [emailjs.com](https://emailjs.com)
2. Crea cuenta gratuita (200 emails/mes gratis)
3. Verifica tu email

## 🔧 Paso 2: Configurar servicio de email

1. Ve a Email Services → Add New Service
2. Selecciona Gmail (o tu proveedor)
3. Conecta tu cuenta de Gmail
4. Copia el Service ID

## 🔧 Paso 3: Crear template

1. Ve a Email Templates → Create New Template
2. Crea template para recuperación de contraseña
3. Copia el Template ID

## 🔧 Paso 4: Obtener Public Key

1. Ve a Account → General
2. Copia tu Public Key

## 🔧 Paso 5: Instalar EmailJS en frontend

```bash
cd sigo-frontend
npm install @emailjs/browser
```

## 🔧 Paso 6: Actualizar frontend

```javascript
// En RecuperarPasswordPage.jsx
import emailjs from '@emailjs/browser';

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setLoading(true);
  
  try {
    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Enviar email con EmailJS
    await emailjs.send(
      'tu_service_id', // Service ID
      'tu_template_id', // Template ID
      {
        to_email: email,
        codigo: codigo,
        from_name: 'SIGO Sistema'
      },
      'tu_public_key' // Public Key
    );
    
    // Guardar código en localStorage temporalmente
    localStorage.setItem('resetCode', codigo);
    localStorage.setItem('resetEmail', email);
    
    setSuccess('¡Código enviado! Revisa tu correo.');
    setTimeout(() => navigate('/verificar-codigo', { state: { email } }), 1200);
  } catch (err) {
    setError('Error al enviar el código');
  } finally {
    setLoading(false);
  }
};
```

## ✅ Ventajas de EmailJS

- **200 emails/mes gratis**
- **No necesita servidor SMTP**
- **Fácil integración en frontend**
- **Templates visuales**

## ⚠️ Limitaciones

- El código se genera en el frontend (menos seguro)
- 200 emails/mes en plan gratuito



