// Script para probar configuración de email en Render
console.log('🔧 Verificando configuración de email en Render...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MAIL_USER:', process.env.MAIL_USER);
console.log('MAIL_PASS:', process.env.MAIL_PASS ? 'Configurado' : 'No configurado');
console.log('MAIL_HOST:', process.env.MAIL_HOST);
console.log('MAIL_PORT:', process.env.MAIL_PORT);
console.log('MAIL_SECURE:', process.env.MAIL_SECURE);
console.log('MAIL_FROM:', process.env.MAIL_FROM);

// Verificar si las variables están configuradas
const emailConfig = {
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE === 'true'
};

console.log('\n📧 Configuración de email:');
console.log(JSON.stringify(emailConfig, null, 2));

// Verificar si todas las variables necesarias están presentes
const requiredVars = ['MAIL_USER', 'MAIL_PASS', 'MAIL_HOST', 'MAIL_PORT'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('\n❌ Variables faltantes:', missingVars);
} else {
  console.log('\n✅ Todas las variables de email están configuradas');
}

// Probar conexión con nodemailer
const nodemailer = require('nodemailer');

async function testConnection() {
  try {
    console.log('\n🧪 Probando conexión con Gmail...');
    
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || "587"),
      secure: process.env.MAIL_SECURE === "true",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Verificar conexión
    await transporter.verify();
    console.log('✅ Conexión con Gmail exitosa');
    
    // Enviar email de prueba
    const mailOptions = {
      from: `"SIGO Test" <${process.env.MAIL_USER}>`,
      to: 'pamefern5@gmail.com',
      subject: '🧪 Test de Email desde Render',
      html: `
        <h2>Test de Email desde Render</h2>
        <p>Este es un email de prueba enviado desde el servidor de Render.</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Entorno:</strong> ${process.env.NODE_ENV}</p>
        <p><strong>Servidor:</strong> Render</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente:', result.messageId);
    
  } catch (error) {
    console.error('❌ Error en conexión o envío:', error.message);
    console.error('Detalles:', error);
  }
}

testConnection();
