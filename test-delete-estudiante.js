const axios = require('axios');

async function testDeleteEstudiante() {
  try {
    console.log('🔍 Probando eliminación de estudiante...');
    
    // 1. Primero hacer login para obtener token
    console.log('🔐 Haciendo login...');
    const loginResponse = await axios.post('https://sistema-sigo.onrender.com/api/auth/login', {
      email: 'daniel1822@gmail.com',
      password: 'fran0404'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso, token obtenido');
    
    // 2. Obtener lista de estudiantes
    console.log('📋 Obteniendo lista de estudiantes...');
    const estudiantesResponse = await axios.get('https://sistema-sigo.onrender.com/api/estudiantes', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('📊 Respuesta completa de estudiantes:', estudiantesResponse.data);
    console.log('📊 Tipo de datos:', typeof estudiantesResponse.data);
    console.log('📊 Es array:', Array.isArray(estudiantesResponse.data));
    
    // Verificar si es un objeto con paginación
    let estudiantes = estudiantesResponse.data;
    if (estudiantesResponse.data && estudiantesResponse.data.data) {
      estudiantes = estudiantesResponse.data.data;
      console.log('📊 Datos paginados encontrados:', estudiantes.length);
    } else if (Array.isArray(estudiantesResponse.data)) {
      estudiantes = estudiantesResponse.data;
      console.log('📊 Array directo encontrado:', estudiantes.length);
    } else {
      console.log('❌ Formato de datos no reconocido');
      return;
    }
    
    if (estudiantes.length === 0) {
      console.log('❌ No hay estudiantes para probar eliminación');
      return;
    }
    
    // 3. Seleccionar el primer estudiante para eliminar
    const estudianteToDelete = estudiantes[0];
    console.log('🎯 Estudiante seleccionado para eliminar:', {
      id: estudianteToDelete.id,
      nombre: estudianteToDelete.nombre,
      apellido: estudianteToDelete.apellido
    });
    
    // 4. Intentar eliminar el estudiante
    console.log('🗑️ Intentando eliminar estudiante...');
    const deleteResponse = await axios.delete(`https://sistema-sigo.onrender.com/api/estudiantes/${estudianteToDelete.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('✅ Estudiante eliminado exitosamente');
    console.log('📊 Respuesta del servidor:', deleteResponse.data);
    
    // 5. Verificar que el estudiante fue eliminado
    console.log('🔍 Verificando que el estudiante fue eliminado...');
    const verifyResponse = await axios.get(`https://sistema-sigo.onrender.com/api/estudiantes/${estudianteToDelete.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('❌ ERROR: El estudiante aún existe después de eliminarlo');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.response?.data || error.message);
    console.error('📊 Status:', error.response?.status);
    console.error('📊 Headers:', error.response?.headers);
  }
}

testDeleteEstudiante();
