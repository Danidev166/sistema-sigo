const axios = require('axios');

const BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function debugEndpoints() {
  try {
    // 1. Login
    console.log('🔑 Obteniendo token...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@test.com',
      password: 'test123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // 2. Probar endpoints problemáticos uno por uno
    const problematicEndpoints = [
      { name: 'Seguimiento Académico', url: '/seguimiento-academico' },
      { name: 'Seguimiento General', url: '/seguimiento' },
      { name: 'Seguimiento Cronológico', url: '/seguimiento-cronologico' }
    ];
    
    for (const endpoint of problematicEndpoints) {
      console.log(`\n📊 Probando ${endpoint.name}...`);
      try {
        const response = await axios.get(`${BASE_URL}${endpoint.url}`, { headers });
        console.log(`✅ ${endpoint.name}: Status ${response.status}`);
        console.log(`   📋 Datos: ${Array.isArray(response.data) ? response.data.length : 'Objeto'} registros`);
      } catch (error) {
        console.log(`❌ ${endpoint.name}: Status ${error.response?.status || 'Error'}`);
        console.log(`   🔍 Error: ${error.response?.data?.error || error.message}`);
        console.log(`   📋 Detalles: ${JSON.stringify(error.response?.data, null, 2)}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

debugEndpoints();
