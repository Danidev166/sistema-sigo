/**
 * Script completo para probar TODOS los servicios de email del sistema
 * Incluye: recuperación, agenda, comunicación familiar, test vocacionales
 */

require('dotenv').config({ path: '.env.production' });
const { 
  enviarCodigoRecuperacion, 
  enviarCorreoAgenda, 
  enviarCitacionReunion, 
  enviarTestVocacionalQR 
} = require('./utils/emailService');

async function testAllEmailServices() {
  console.log('🔍 Probando TODOS los servicios de email del sistema...\n');
  console.log('=' .repeat(70));
  
  const testEmail = 'daniel1822@gmail.com';
  const testData = {
    estudiante: {
      nombre: 'Juan',
      apellido: 'Pérez',
      curso: '4° Medio A'
    },
    apoderado: 'María González',
    fecha: '2024-09-28',
    hora: '15:30',
    lugar: 'Oficina de Orientación',
    motivo: 'Reunión de seguimiento académico',
    profesional: 'Ana Silva',
    testType: 'kuder',
    qrCodeUrl: 'https://via.placeholder.com/200x200/0e1a33/ffffff?text=QR+TEST',
    testUrl: 'https://sigo-caupolican.onrender.com/test-vocacional/kuder'
  };

  const results = {
    recuperacion: false,
    agenda: false,
    comunicacion: false,
    testVocacional: false
  };

  // 1. Probar envío de código de recuperación
  console.log('📧 1. Probando envío de código de recuperación...');
  try {
    await enviarCodigoRecuperacion({ 
      to: testEmail, 
      codigo: '123456' 
    });
    console.log('✅ Código de recuperación: OK');
    results.recuperacion = true;
  } catch (error) {
    console.log('❌ Código de recuperación: ERROR -', error.message);
  }

  // 2. Probar envío de correo de agenda
  console.log('\n📅 2. Probando envío de correo de agenda...');
  try {
    await enviarCorreoAgenda({
      to: testEmail,
      estudiante: `${testData.estudiante.nombre} ${testData.estudiante.apellido}`,
      fecha: testData.fecha,
      hora: testData.hora,
      motivo: testData.motivo,
      profesional: testData.profesional
    });
    console.log('✅ Correo de agenda: OK');
    results.agenda = true;
  } catch (error) {
    console.log('❌ Correo de agenda: ERROR -', error.message);
  }

  // 3. Probar envío de citación a reunión (comunicación familiar)
  console.log('\n📋 3. Probando envío de citación a reunión...');
  try {
    await enviarCitacionReunion({
      to: testEmail,
      apoderado: testData.apoderado,
      estudiante: `${testData.estudiante.nombre} ${testData.estudiante.apellido}`,
      fecha: testData.fecha,
      hora: testData.hora,
      lugar: testData.lugar,
      motivo: testData.motivo,
      profesional: testData.profesional
    });
    console.log('✅ Citación a reunión: OK');
    results.comunicacion = true;
  } catch (error) {
    console.log('❌ Citación a reunión: ERROR -', error.message);
  }

  // 4. Probar envío de test vocacional con QR
  console.log('\n🧪 4. Probando envío de test vocacional con QR...');
  try {
    await enviarTestVocacionalQR({
      to: testEmail,
      estudiante: testData.estudiante,
      testType: testData.testType,
      qrCodeUrl: testData.qrCodeUrl,
      testUrl: testData.testUrl
    });
    console.log('✅ Test vocacional: OK');
    results.testVocacional = true;
  } catch (error) {
    console.log('❌ Test vocacional: ERROR -', error.message);
  }

  // Resumen de resultados
  console.log('\n' + '=' .repeat(70));
  console.log('📊 RESUMEN DE RESULTADOS:');
  console.log('=' .repeat(70));
  
  Object.entries(results).forEach(([service, success]) => {
    const status = success ? '✅ FUNCIONANDO' : '❌ CON ERRORES';
    const serviceName = {
      recuperacion: 'Código de Recuperación',
      agenda: 'Correo de Agenda',
      comunicacion: 'Citación a Reunión',
      testVocacional: 'Test Vocacional con QR'
    }[service];
    
    console.log(`${serviceName.padEnd(25)}: ${status}`);
  });

  const totalWorking = Object.values(results).filter(Boolean).length;
  const totalServices = Object.keys(results).length;
  
  console.log('\n' + '=' .repeat(70));
  console.log(`📈 SERVICIOS FUNCIONANDO: ${totalWorking}/${totalServices}`);
  
  if (totalWorking === totalServices) {
    console.log('🎉 ¡TODOS LOS SERVICIOS DE EMAIL FUNCIONAN CORRECTAMENTE!');
  } else {
    console.log('⚠️  Algunos servicios tienen problemas. Revisa los errores arriba.');
  }

  return results;
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
  console.log('🚀 AUDITORÍA COMPLETA DE SERVICIOS DE EMAIL\n');
  console.log('Incluye: Recuperación, Agenda, Comunicación Familiar, Test Vocacionales\n');
  
  // Verificar configuración
  const configOk = await checkEmailConfiguration();
  
  if (!configOk) {
    console.log('\n❌ No se puede continuar sin configuración de email');
    return;
  }
  
  // Probar todos los servicios
  const results = await testAllEmailServices();
  
  console.log('\n' + '=' .repeat(70));
  console.log('✅ Auditoría completada');
  
  return results;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testAllEmailServices, checkEmailConfiguration };
