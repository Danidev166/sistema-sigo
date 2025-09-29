/**
 * Script de diagnóstico para recuperación de contraseña
 * Prueba el flujo completo: envío de código y verificación
 */

require('dotenv').config({ path: '.env.production' });
const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testPasswordRecovery() {
  console.log('🔍 Iniciando diagnóstico de recuperación de contraseña...\n');
  
  // Email de prueba
  const testEmail = 'daniel1822@gmail.com';
  
  try {
    // 1. Probar envío de código
    console.log('📧 Paso 1: Enviando código de recuperación...');
    const recoveryResponse = await axios.post(`${API_BASE}/auth/recuperar`, {
      email: testEmail
    });
    
    console.log('✅ Respuesta del servidor:', recoveryResponse.data);
    
    // 2. Simular verificación (necesitarías el código real del email)
    console.log('\n🔑 Paso 2: Simulando verificación de código...');
    console.log('⚠️  Nota: Necesitas el código real del email para completar esta prueba');
    
    // 3. Verificar configuración de email
    console.log('\n📋 Configuración de email:');
    console.log(`MAIL_HOST: ${process.env.MAIL_HOST}`);
    console.log(`MAIL_PORT: ${process.env.MAIL_PORT}`);
    console.log(`MAIL_USER: ${process.env.MAIL_USER}`);
    console.log(`MAIL_PASS: ${process.env.MAIL_PASS ? '***configurado***' : '❌ NO CONFIGURADO'}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    
  } catch (error) {
    console.error('❌ Error en el diagnóstico:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 Posibles soluciones:');
      console.log('1. Verificar que el servidor esté ejecutándose');
      console.log('2. Verificar la URL de la API');
      console.log('3. Verificar que las rutas estén correctamente configuradas');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 El servidor no está ejecutándose. Inicia el servidor con:');
      console.log('npm start');
    }
  }
}

async function testEmailConfiguration() {
  console.log('\n🔧 Verificando configuración de email...');
  
  const requiredVars = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.log('❌ Variables de email faltantes:', missing);
    return false;
  }
  
  console.log('✅ Todas las variables de email están configuradas');
  return true;
}

async function main() {
  console.log('🚀 Diagnóstico de Sistema de Recuperación de Contraseña\n');
  console.log('=' .repeat(60));
  
  // Verificar configuración
  const emailConfigOk = await testEmailConfiguration();
  
  if (!emailConfigOk) {
    console.log('\n❌ No se puede continuar sin configuración de email');
    return;
  }
  
  // Probar flujo de recuperación
  await testPasswordRecovery();
  
  console.log('\n' + '=' .repeat(60));
  console.log('✅ Diagnóstico completado');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testPasswordRecovery, testEmailConfiguration };
