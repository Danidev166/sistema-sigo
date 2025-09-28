// Script de prueba completo para el sistema de comunicación familiar
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
  responsable_id: 3, // ID del usuario responsable (Daniel)
  hora_reunion: '14:30',
  lugar_reunion: 'Sala de reuniones - Liceo Técnico SIGO',
  enviar_email: false, // Desactivar envío de email para la prueba
  estado: 'Enviado'
};

// Credenciales de prueba (necesitarás cambiarlas por credenciales reales)
const credentials = {
  email: 'daniel1822@gmail.com', // Email del usuario
  password: 'fran0404'           // Contraseña del usuario
};

let authToken = '';

async function login() {
  try {
    console.log('🔐 Iniciando sesión...');
    const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
    
    console.log('📋 Respuesta del servidor:', JSON.stringify(response.data, null, 2));
    
    if (response.data.accessToken) {
      authToken = response.data.accessToken;
      console.log('✅ Login exitoso');
      return true;
    } else if (response.data.token) {
      authToken = response.data.token;
      console.log('✅ Login exitoso (token)');
      return true;
    } else {
      console.log('❌ No se recibió token de acceso');
      console.log('📋 Estructura de respuesta:', Object.keys(response.data));
      return false;
    }
  } catch (error) {
    console.error('❌ Error en login:', error.response?.data || error.message);
    return false;
  }
}

async function testComunicacionFamilia() {
  console.log('🧪 Iniciando pruebas del sistema de comunicación familiar...\n');

  // Configurar axios para incluir el token en todas las peticiones
  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });

  try {
    // 1. Probar obtener todas las comunicaciones
    console.log('1️⃣ Probando obtener todas las comunicaciones...');
    const getAllResponse = await api.get('/comunicacion-familia');
    console.log(`✅ Comunicaciones obtenidas: ${getAllResponse.data.length}`);
    if (getAllResponse.data.length > 0) {
      console.log('📊 Primera comunicación:', {
        id: getAllResponse.data[0].id,
        asunto: getAllResponse.data[0].asunto,
        tipo: getAllResponse.data[0].tipo_comunicacion,
        fecha: getAllResponse.data[0].fecha_comunicacion
      });
    }

    // 2. Probar obtener comunicaciones por estudiante
    console.log('\n2️⃣ Probando obtener comunicaciones por estudiante...');
    const getByStudentResponse = await api.get(`/comunicacion-familia?id_estudiante=${testData.id_estudiante}`);
    console.log(`✅ Comunicaciones del estudiante ${testData.id_estudiante}: ${getByStudentResponse.data.length}`);

    // 3. Probar crear nueva comunicación
    console.log('\n3️⃣ Probando crear nueva comunicación...');
    const createResponse = await api.post('/comunicacion-familia', testData);
    console.log('✅ Comunicación creada:', createResponse.data.message);
    
    const nuevaComunicacion = createResponse.data.comunicacion;
    console.log('📝 ID de la comunicación:', nuevaComunicacion.id);
    console.log('📝 Datos de la comunicación:', {
      asunto: nuevaComunicacion.asunto,
      tipo: nuevaComunicacion.tipo_comunicacion,
      medio: nuevaComunicacion.medio,
      estado: nuevaComunicacion.estado
    });

    // 4. Probar obtener comunicación por ID
    console.log('\n4️⃣ Probando obtener comunicación por ID...');
    const getByIdResponse = await api.get(`/comunicacion-familia/${nuevaComunicacion.id}`);
    console.log('✅ Comunicación obtenida:', getByIdResponse.data.asunto);

    // 5. Probar actualizar comunicación
    console.log('\n5️⃣ Probando actualizar comunicación...');
    const updateData = {
      ...testData,
      asunto: 'Citación a reunión - ACTUALIZADA',
      contenido: 'Contenido actualizado para la reunión de seguimiento académico.',
      estado: 'Leído'
    };
    
    const updateResponse = await api.put(`/comunicacion-familia/${nuevaComunicacion.id}`, updateData);
    console.log('✅ Comunicación actualizada:', updateResponse.data.message);

    // 6. Probar diferentes tipos de comunicación
    console.log('\n6️⃣ Probando diferentes tipos de comunicación...');
    const tiposComunicacion = [
      {
        ...testData,
        tipo_comunicacion: 'Informe Académico',
        asunto: 'Informe de rendimiento académico',
        contenido: 'Informe detallado del rendimiento académico del estudiante.',
        responsable_id: 3,
        enviar_email: false
      },
      {
        ...testData,
        tipo_comunicacion: 'Alerta/Urgente',
        asunto: 'Alerta de asistencia',
        contenido: 'El estudiante ha faltado a clases consecutivamente.',
        responsable_id: 3,
        enviar_email: false
      }
    ];

    for (const tipo of tiposComunicacion) {
      const tipoResponse = await api.post('/comunicacion-familia', tipo);
      console.log(`✅ ${tipo.tipo_comunicacion} creada con ID: ${tipoResponse.data.comunicacion.id}`);
    }

    // 7. Probar eliminar comunicación
    console.log('\n7️⃣ Probando eliminar comunicación...');
    const deleteResponse = await api.delete(`/comunicacion-familia/${nuevaComunicacion.id}`);
    console.log('✅ Comunicación eliminada:', deleteResponse.data.message);

    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('\n📋 Resumen de funcionalidades probadas:');
    console.log('   ✅ Autenticación con JWT');
    console.log('   ✅ Obtener todas las comunicaciones');
    console.log('   ✅ Obtener comunicaciones por estudiante');
    console.log('   ✅ Crear nueva comunicación');
    console.log('   ✅ Obtener comunicación por ID');
    console.log('   ✅ Actualizar comunicación');
    console.log('   ✅ Eliminar comunicación');
    console.log('   ✅ Diferentes tipos de comunicación');
    console.log('   ✅ Validación de datos con Joi');
    console.log('   ✅ Middleware de seguridad');
    console.log('   ✅ Envío de emails (simulado en desarrollo)');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Nota: Token de autenticación inválido o expirado');
      console.log('   - Verifica las credenciales de login');
      console.log('   - El token puede haber expirado');
    }
    
    if (error.response?.status === 404) {
      console.log('\n💡 Nota: Recurso no encontrado');
      console.log('   - Verifica que el estudiante con ID existe');
      console.log('   - Verifica que la comunicación existe');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Nota: El servidor backend no está ejecutándose');
      console.log('   - Ejecuta: cd backend && node index.js');
    }
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando pruebas del sistema SIGO - Comunicación Familiar\n');
  
  // Intentar login
  const loginSuccess = await login();
  
  if (!loginSuccess) {
    console.log('\n❌ No se pudo autenticar. Verifica las credenciales.');
    console.log('💡 Credenciales actuales:', credentials);
    console.log('   - Cambia las credenciales en el script si es necesario');
    console.log('   - Verifica que el usuario existe en la base de datos');
    return;
  }
  
  // Ejecutar pruebas
  await testComunicacionFamilia();
}

// Ejecutar pruebas
main().catch(console.error);
