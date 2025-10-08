const axios = require('axios');

async function testSimpleDelete() {
  try {
    console.log('🔍 Test simple de eliminación...');
    
    // 1. Login
    const loginResponse = await axios.post('https://sistema-sigo.onrender.com/api/auth/login', {
      email: 'daniel1822@gmail.com',
      password: 'fran0404'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso');
    
    // 2. Obtener un estudiante específico
    const estudianteResponse = await axios.get('https://sistema-sigo.onrender.com/api/estudiantes/9', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('📊 Estudiante encontrado:', {
      id: estudianteResponse.data.id,
      nombre: estudianteResponse.data.nombre,
      apellido: estudianteResponse.data.apellido
    });
    
    // 3. Intentar eliminar
    console.log('🗑️ Intentando eliminar...');
    const deleteResponse = await axios.delete('https://sistema-sigo.onrender.com/api/estudiantes/9', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Eliminación exitosa:', deleteResponse.data);
    
    // 4. Verificar que se eliminó
    try {
      await axios.get('https://sistema-sigo.onrender.com/api/estudiantes/9', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('❌ ERROR: El estudiante aún existe');
    } catch (verifyError) {
      if (verifyError.response?.status === 404) {
        console.log('✅ CONFIRMADO: El estudiante fue eliminado correctamente');
      } else {
        console.log('❌ Error al verificar:', verifyError.response?.data);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('📊 Status:', error.response?.status);
  }
}

testSimpleDelete();
