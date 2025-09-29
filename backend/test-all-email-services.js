/**
 * Script para probar todos los servicios de email del sistema
 * Identifica problemas en cada función de envío de email
 */

require('dotenv').config({ path: '.env.production' });
const { 
  enviarCodigoRecuperacion, 
  enviarCorreoAgenda, 
  enviarCitacionReunion, 
  enviarTestVocacionalQR 
} = require('./utils/emailService');

async function testEmailServices() {
  console.log('🔍 Probando todos los servicios de email...\n');
  console.log('=' .repeat(60));
  
  const testEmail = 'daniel1822@gmail.com';
  const testData = {
    estudiante: 'Juan Pérez',
    apoderado: 'María González',
    fecha: '2024-09-28',
    hora: '15:30',
    lugar: 'Oficina de Orientación',
    motivo: 'Reunión de seguimiento académico',
    profesional: 'Ana Silva',
    testType: 'kuder',
    qrCodeUrl: 'https://example.com/qr',
    testUrl: 'https://example.com/test'
  };

  // 1. Probar envío de código de recuperación
  console.log('📧 1. Probando envío de código de recuperación...');
  try {
    await enviarCodigoRecuperacion({ 
      to: testEmail, 
      codigo: '123456' 
    });
    console.log('✅ Código de recuperación: OK');
  } catch (error) {
    console.log('❌ Código de recuperación: ERROR -', error.message);
  }

  // 2. Probar envío de correo de agenda
  console.log('\n📅 2. Probando envío de correo de agenda...');
  try {
    await enviarCorreoAgenda({
      to: testEmail,
      estudiante: testData.estudiante,
      fecha: testData.fecha,
      hora: testData.hora,
      motivo: testData.motivo,
      profesional: testData.profesional
    });
    console.log('✅ Correo de agenda: OK');
  } catch (error) {
    console.log('❌ Correo de agenda: ERROR -', error.message);
  }

  // 3. Probar envío de citación a reunión
  console.log('\n📋 3. Probando envío de citación a reunión...');
  try {
    await enviarCitacionReunion({
      to: testEmail,
      apoderado: testData.apoderado,
      estudiante: testData.estudiante,
      fecha: testData.fecha,
      hora: testData.hora,
      lugar: testData.lugar,
      motivo: testData.motivo,
      profesional: testData.profesional
    });
    console.log('✅ Citación a reunión: OK');
  } catch (error) {
    console.log('❌ Citación a reunión: ERROR -', error.message);
  }

  // 4. Probar envío de test vocacional
  console.log('\n🧪 4. Probando envío de test vocacional...');
  try {
    await enviarTestVocacionalQR({
      to: testEmail,
      estudiante: { nombre: 'Juan', apellido: 'Pérez' },
      testType: testData.testType,
      qrCodeUrl: testData.qrCodeUrl,
      testUrl: testData.testUrl
    });
    console.log('✅ Test vocacional: OK');
  } catch (error) {
    console.log('❌ Test vocacional: ERROR -', error.message);
  }

  console.log('\n' + '=' .repeat(60));
  console.log('✅ Pruebas de servicios de email completadas');
}

async function checkEmailConfiguration() {
  console.log('🔧 Verificando configuración de email...\n');
  
  const requiredVars = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.log('❌ Variables faltantes:', missing);
    return false;
  }
  
  console.log('✅ Configuración básica: OK');
  console.log(`📧 Host: ${process.env.MAIL_HOST}`);
  console.log(`🔌 Puerto: ${process.env.MAIL_PORT}`);
  console.log(`👤 Usuario: ${process.env.MAIL_USER}`);
  console.log(`🔑 Contraseña: ${process.env.MAIL_PASS ? '***configurado***' : '❌ NO CONFIGURADO'}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
  
  return true;
}

async function main() {
  console.log('🚀 Auditoría Completa de Servicios de Email\n');
  
  // Verificar configuración
  const configOk = await checkEmailConfiguration();
  
  if (!configOk) {
    console.log('\n❌ No se puede continuar sin configuración de email');
    return;
  }
  
  // Probar todos los servicios
  await testEmailServices();
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testEmailServices, checkEmailConfiguration };
