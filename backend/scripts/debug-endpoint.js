const axios = require('axios');

const RENDER_BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function debugEndpoint() {
  try {
    console.log('🔍 Debuggeando endpoint de seguimiento psicosocial...');
    
    // 1. Hacer login
    const loginResponse = await axios.post(`${RENDER_BASE_URL}/auth/login`, {
      email: 'test@test.com',
      password: 'test123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido');
    
    // 2. Probar endpoint con más detalles
    try {
      const response = await axios.get(`${RENDER_BASE_URL}/seguimiento-psicosocial`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      console.log('✅ Endpoint funcionando:', response.status);
      console.log('📋 Datos:', response.data);
      
    } catch (error) {
      console.log('❌ Error en endpoint:');
      console.log('   Status:', error.response?.status);
      console.log('   Status Text:', error.response?.statusText);
      console.log('   Data:', error.response?.data);
      console.log('   Headers:', error.response?.headers);
    }
    
    // 3. Probar endpoint de reportes dashboard
    console.log('\n🔍 Debuggeando endpoint de reportes dashboard...');
    try {
      const response = await axios.get(`${RENDER_BASE_URL}/reportes-mejorado/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      console.log('✅ Endpoint funcionando:', response.status);
      console.log('📋 Datos:', response.data);
      
    } catch (error) {
      console.log('❌ Error en endpoint:');
      console.log('   Status:', error.response?.status);
      console.log('   Status Text:', error.response?.statusText);
      console.log('   Data:', error.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  debugEndpoint()
    .then(() => {
      console.log('\n✅ Debug completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { debugEndpoint };
