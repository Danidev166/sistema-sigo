#!/usr/bin/env node

/**
 * Script para probar el envío de emails con Gmail
 * Uso: node test-email.js tu_email@gmail.com
 */

require('dotenv').config();
const { enviarCodigoRecuperacion } = require('./utils/emailService');

async function testEmail() {
  const email = process.argv[2];
  
  if (!email) {
    console.log('❌ Uso: node test-email.js tu_email@gmail.com');
    process.exit(1);
  }

  console.log('🧪 Probando envío de email...');
  console.log('📧 Email destino:', email);
  console.log('🔧 Variables de entorno:');
  console.log('   MAIL_HOST:', process.env.MAIL_HOST || 'NO CONFIGURADO');
  console.log('   MAIL_USER:', process.env.MAIL_USER || 'NO CONFIGURADO');
  console.log('   MAIL_PASS:', process.env.MAIL_PASS ? '***CONFIGURADO***' : 'NO CONFIGURADO');
  console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('');

  try {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔑 Código generado:', codigo);
    
    await enviarCodigoRecuperacion({
      to: email,
      codigo: codigo
    });
    
    console.log('✅ ¡Prueba completada!');
    console.log('📨 Revisa tu bandeja de entrada (y spam)');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.log('');
    console.log('💡 Posibles soluciones:');
    console.log('1. Verifica que MAIL_USER y MAIL_PASS estén configurados en .env');
    console.log('2. Asegúrate de usar App Password de Gmail (no tu contraseña normal)');
    console.log('3. Verifica que 2FA esté activado en tu cuenta de Gmail');
    console.log('4. Revisa que el email sea válido');
  }
}

testEmail();



