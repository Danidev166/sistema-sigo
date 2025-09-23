const axios = require('axios');

async function testEndpoints() {
  const baseURL = 'https://sistema-sigo.onrender.com/api';
  
  const endpoints = [
    '/alertas',
    '/notificaciones', 
    '/agenda',
    '/configuracion/estadisticas',
    '/logs-actividad'
  ];
  
  console.log('🧪 Probando endpoints que estaban fallando...');
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Probando ${endpoint}...`);
      const response = await axios.get(`${baseURL}${endpoint}`, {
        headers: {
          'Authorization': 'Bearer test-token' // Token de prueba
        },
        timeout: 10000
      });
      console.log(`✅ ${endpoint}: Status ${response.status}`);
    } catch (error) {
      if (error.response) {
        console.log(`📊 ${endpoint}: Status ${error.response.status} - ${error.response.data?.error || error.response.data?.message || 'Error'}`);
      } else {
        console.log(`❌ ${endpoint}: Error de conexión - ${error.message}`);
      }
    }
  }
  
  console.log('\n🎉 Pruebas de endpoints completadas');
}

testEndpoints();
