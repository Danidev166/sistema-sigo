/**
 * Script para probar el envío de comunicación familiar
 * Envía una citación a reunión al apoderado
 */

require('dotenv').config({ path: '.env.production' });
const { enviarCitacionReunion } = require('./utils/emailService');

async function testComunicacionFamilia() {
  console.log('📋 Probando envío de comunicación familiar...\n');
  console.log('=' .repeat(60));
  
  const apoderadoEmail = 'daniel1822@gmail.com';
  const datosComunicacion = {
    to: apoderadoEmail,
    apoderado: 'Daniel González',
    estudiante: 'María Pérez',
    fecha: '2024-09-30',
    hora: '16:00',
    lugar: 'Oficina de Orientación - Liceo Técnico SIGO',
    motivo: 'Reunión de seguimiento académico y conductual',
    profesional: 'Ana Silva - Orientadora'
  };

  try {
    console.log('📧 Enviando citación a reunión...');
    console.log(`👤 Apoderado: ${datosComunicacion.apoderado}`);
    console.log(`👤 Estudiante: ${datosComunicacion.estudiante}`);
    console.log(`📅 Fecha: ${datosComunicacion.fecha}`);
    console.log(`⏰ Hora: ${datosComunicacion.hora}`);
    console.log(`📍 Lugar: ${datosComunicacion.lugar}`);
    console.log(`📌 Motivo: ${datosComunicacion.motivo}`);
    console.log(`👨‍⚕️ Profesional: ${datosComunicacion.profesional}`);
    console.log(`📧 Email: ${datosComunicacion.to}`);
    
    await enviarCitacionReunion(datosComunicacion);
    
    console.log('\n✅ ¡Citación enviada exitosamente!');
    console.log('📧 Revisa el correo en daniel1822@gmail.com');
    console.log('📋 Busca el asunto: "📅 Citación a Reunión - María Pérez"');
    
  } catch (error) {
    console.error('\n❌ Error enviando citación:', error.message);
    console.error('🔍 Detalles del error:', error);
  }
}

async function main() {
  console.log('🚀 Prueba de Comunicación Familiar\n');
  await testComunicacionFamilia();
  console.log('\n' + '=' .repeat(60));
  console.log('✅ Prueba completada');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testComunicacionFamilia };
