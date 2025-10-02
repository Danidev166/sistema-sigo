const axios = require('axios');

async function testLoginEndpoint() {
  console.log('🔍 PROBANDO ENDPOINT DE LOGIN ESPECÍFICAMENTE');
  console.log('==============================================\n');

  const baseURL = 'https://sistema-sigo.onrender.com';
  
  // Datos de prueba para login
  const loginData = {
    email: 'admin@sigo.com',
    password: 'admin123'
  };

  try {
    console.log('📤 Enviando POST a /api/auth/login...');
    console.log('Datos:', JSON.stringify(loginData, null, 2));
    
    const response = await axios.post(`${baseURL}/api/auth/login`, loginData, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SIGO-Test/1.0'
      }
    });
    
    console.log('✅ Respuesta exitosa:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Error en login:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Status Text:', error.response.statusText);
      console.log('Headers:', JSON.stringify(error.response.headers, null, 2));
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 429) {
        console.log('\n🚨 RATE LIMIT DETECTADO');
        console.log('El endpoint está siendo limitado por demasiadas peticiones');
        console.log('Esperando 60 segundos antes de reintentar...');
        
        await new Promise(resolve => setTimeout(resolve, 60000));
        
        console.log('\n🔄 Reintentando después del rate limit...');
        try {
          const retryResponse = await axios.post(`${baseURL}/api/auth/login`, loginData, {
            timeout: 15000,
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'SIGO-Test/1.0'
            }
          });
          console.log('✅ Reintento exitoso:', retryResponse.status);
        } catch (retryError) {
          console.log('❌ Reintento falló:', retryError.response?.status, retryError.response?.data);
        }
      }
      
    } else if (error.code === 'ECONNABORTED') {
      console.log('⏰ Timeout (15s)');
    } else {
      console.log('Error:', error.message);
    }
  }

  // Probar otros endpoints para comparar
  console.log('\n🔍 PROBANDO OTROS ENDPOINTS PARA COMPARAR');
  console.log('==========================================');
  
  const endpoints = [
    { method: 'GET', path: '/' },
    { method: 'GET', path: '/api/health' },
    { method: 'POST', path: '/api/auth/recuperar', data: { email: 'test@test.com' } }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📤 ${endpoint.method} ${endpoint.path}...`);
      
      const config = {
        method: endpoint.method.toLowerCase(),
        url: `${baseURL}${endpoint.path}`,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SIGO-Test/1.0'
        }
      };
      
      if (endpoint.data) {
        config.data = endpoint.data;
      }
      
      const response = await axios(config);
      console.log(`✅ ${endpoint.path}: ${response.status}`);
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${endpoint.path}: ${error.response.status} - ${error.response.statusText}`);
      } else {
        console.log(`❌ ${endpoint.path}: ${error.message}`);
      }
    }
  }
}

testLoginEndpoint().catch(console.error);
