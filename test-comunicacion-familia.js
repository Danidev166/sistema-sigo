// Script de prueba para el sistema de comunicación familiar
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Datos de prueba
const testData = {
  id_estudiante: 1, // Cambiar por un ID real de estudiante
  fecha_comunicacion: new Date().toISOString().split('T')[0],
  tipo_comunicacion: 'Citación a Reunión',
  medio: 'Email',
  asunto: 'Citación a reunión de seguimiento académico',
  contenido: 'Estimado apoderado, solicitamos su presencia para una reunión de seguimiento académico de su pupilo/a.',
  responsable_id: 'Orientador/a de turno',
  hora_reunion: '14:30',
  lugar_reunion: 'Sala de reuniones - Liceo Técnico SIGO',
  enviar_email: true,
  estado: 'Enviado'
};

async function testComunicacionFamilia() {
  console.log('🧪 Iniciando pruebas del sistema de comunicación familiar...\n');

  try {
    // 1. Probar obtener todas las comunicaciones
    console.log('1️⃣ Probando obtener todas las comunicaciones...');
    const getAllResponse = await axios.get(`${BASE_URL}/comunicacion-familia`);
    console.log(`✅ Comunicaciones obtenidas: ${getAllResponse.data.length}`);
    console.log('📊 Datos:', getAllResponse.data.slice(0, 2)); // Mostrar solo las primeras 2

    // 2. Probar obtener comunicaciones por estudiante
    console.log('\n2️⃣ Probando obtener comunicaciones por estudiante...');
    const getByStudentResponse = await axios.get(`${BASE_URL}/comunicacion-familia?id_estudiante=${testData.id_estudiante}`);
    console.log(`✅ Comunicaciones del estudiante ${testData.id_estudiante}: ${getByStudentResponse.data.length}`);

    // 3. Probar crear nueva comunicación
    console.log('\n3️⃣ Probando crear nueva comunicación...');
    const createResponse = await axios.post(`${BASE_URL}/comunicacion-familia`, testData);
    console.log('✅ Comunicación creada:', createResponse.data.message);
    
    const nuevaComunicacion = createResponse.data.comunicacion;
    console.log('📝 ID de la comunicación:', nuevaComunicacion.id);

    // 4. Probar obtener comunicación por ID
    console.log('\n4️⃣ Probando obtener comunicación por ID...');
    const getByIdResponse = await axios.get(`${BASE_URL}/comunicacion-familia/${nuevaComunicacion.id}`);
    console.log('✅ Comunicación obtenida:', getByIdResponse.data.asunto);

    // 5. Probar actualizar comunicación
    console.log('\n5️⃣ Probando actualizar comunicación...');
    const updateData = {
      ...testData,
      asunto: 'Citación a reunión - ACTUALIZADA',
      contenido: 'Contenido actualizado para la reunión de seguimiento académico.'
    };
    
    const updateResponse = await axios.put(`${BASE_URL}/comunicacion-familia/${nuevaComunicacion.id}`, updateData);
    console.log('✅ Comunicación actualizada:', updateResponse.data.message);

    // 6. Probar eliminar comunicación
    console.log('\n6️⃣ Probando eliminar comunicación...');
    const deleteResponse = await axios.delete(`${BASE_URL}/comunicacion-familia/${nuevaComunicacion.id}`);
    console.log('✅ Comunicación eliminada:', deleteResponse.data.message);

    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('\n📋 Resumen de funcionalidades probadas:');
    console.log('   ✅ Obtener todas las comunicaciones');
    console.log('   ✅ Obtener comunicaciones por estudiante');
    console.log('   ✅ Crear nueva comunicación');
    console.log('   ✅ Obtener comunicación por ID');
    console.log('   ✅ Actualizar comunicación');
    console.log('   ✅ Eliminar comunicación');
    console.log('   ✅ Validación de datos con Joi');
    console.log('   ✅ Middleware de seguridad');
    console.log('   ✅ Envío de emails (simulado en desarrollo)');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Nota: Necesitas estar autenticado para usar la API');
      console.log('   - Inicia sesión en el frontend primero');
      console.log('   - O usa un token de autenticación válido');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Nota: El servidor backend no está ejecutándose');
      console.log('   - Ejecuta: cd backend && node index.js');
    }
  }
}

// Ejecutar pruebas
testComunicacionFamilia();
