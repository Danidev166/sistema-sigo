#!/usr/bin/env node

/**
 * Script para actualizar la configuración de email a Gmail
 * Uso: node actualizar-gmail.js tu_email@gmail.com tu_app_password
 */

const fs = require('fs');
const path = require('path');

function actualizarConfiguracionGmail() {
  const email = process.argv[2];
  const appPassword = process.argv[3];
  
  if (!email || !appPassword) {
    console.log('❌ Uso: node actualizar-gmail.js tu_email@gmail.com tu_app_password');
    console.log('');
    console.log('💡 Ejemplo:');
    console.log('   node actualizar-gmail.js miemail@gmail.com abcd efgh ijkl mnop');
    process.exit(1);
  }

  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ No se encontró el archivo .env');
    process.exit(1);
  }

  // Leer el archivo .env actual
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  console.log('🔧 Actualizando configuración de Gmail...');
  console.log('📧 Email:', email);
  console.log('🔑 App Password:', appPassword.replace(/./g, '*'));
  
  // Actualizar las variables
  envContent = envContent.replace(/MAIL_HOST=.*/, 'MAIL_HOST=smtp.gmail.com');
  envContent = envContent.replace(/MAIL_PORT=.*/, 'MAIL_PORT=587');
  envContent = envContent.replace(/MAIL_SECURE=.*/, 'MAIL_SECURE=false');
  envContent = envContent.replace(/MAIL_USER=.*/, `MAIL_USER=${email}`);
  envContent = envContent.replace(/MAIL_PASS=.*/, `MAIL_PASS=${appPassword}`);
  
  // Si no existen las variables, agregarlas
  if (!envContent.includes('MAIL_HOST=')) {
    envContent += '\n# Configuración de Email Gmail\n';
    envContent += 'MAIL_HOST=smtp.gmail.com\n';
    envContent += 'MAIL_PORT=587\n';
    envContent += 'MAIL_SECURE=false\n';
    envContent += `MAIL_USER=${email}\n`;
    envContent += `MAIL_PASS=${appPassword}\n`;
  }
  
  // Guardar el archivo actualizado
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Configuración actualizada correctamente');
  console.log('');
  console.log('🧪 Para probar, ejecuta:');
  console.log(`   node test-email.js ${email}`);
  console.log('');
  console.log('🚀 Para activar emails reales, cambia NODE_ENV=production en tu .env');
}

actualizarConfiguracionGmail();



