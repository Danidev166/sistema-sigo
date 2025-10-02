const axios = require('axios');

async function testRenderSimple() {
  console.log('🔍 PROBANDO RENDER - VERSIÓN SIMPLE');
  console.log('===================================\n');

  const baseURL = 'https://sistema-sigo.onrender.com';
  
  try {
    // 1. Probar endpoint básico
    console.log('1️⃣ Probando endpoint básico...');
    const homeResponse = await axios.get(`${baseURL}/`, { timeout: 10000 });
    console.log('✅ Home:', homeResponse.status);

    // 2. Probar health check
    console.log('\n2️⃣ Probando health check...');
    const healthResponse = await axios.get(`${baseURL}/api/health`, { timeout: 10000 });
    console.log('✅ Health:', healthResponse.status);
    console.log('Datos:', JSON.stringify(healthResponse.data, null, 2));

    // 3. Probar login (sin esperar mucho)
    console.log('\n3️⃣ Probando login...');
    const loginData = {
      email: 'daniel1822@gmail.com',
      password: 'fran0404'
    };
    
    try {
      const loginResponse = await axios.post(`${baseURL}/api/auth/login`, loginData, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Login exitoso:', loginResponse.status);
    } catch (loginError) {
      if (loginError.response) {
        console.log('❌ Login error:', loginError.response.status);
        console.log('Error:', JSON.stringify(loginError.response.data, null, 2));
        
        if (loginError.response.data.error && loginError.response.data.error.includes('SSL/TLS')) {
          console.log('\n🚨 PROBLEMA CONFIRMADO: SSL/TLS required');
          console.log('La base de datos de Render ahora requiere SSL');
        }
      } else {
        console.log('❌ Login timeout o error de conexión');
      }
    }

  } catch (error) {
    console.log('❌ Error general:', error.message);
  }

  console.log('\n📋 DIAGNÓSTICO:');
  console.log('Si el home y health funcionan pero login falla con SSL/TLS:');
  console.log('1. La base de datos de Render cambió y ahora requiere SSL');
  console.log('2. Las variables de entorno en Render no están configuradas');
  console.log('3. Necesitas configurar PG_SSL=true en el dashboard de Render');
}

testRenderSimple().catch(console.error);
