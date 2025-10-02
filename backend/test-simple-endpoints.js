const axios = require('axios');

async function testSimpleEndpoints() {
  console.log('🔍 PROBANDO ENDPOINTS SIMPLES (SIN RATE LIMIT)');
  console.log('===============================================\n');

  const baseURL = 'https://sistema-sigo.onrender.com';
  
  // Endpoints que no requieren autenticación
  const endpoints = [
    { method: 'GET', path: '/', name: 'Home' },
    { method: 'GET', path: '/api/health', name: 'Health Check' },
    { method: 'GET', path: '/api/render-debug', name: 'Render Debug' }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📤 ${endpoint.method} ${endpoint.path} (${endpoint.name})...`);
      
      const config = {
        method: endpoint.method.toLowerCase(),
        url: `${baseURL}${endpoint.path}`,
        timeout: 15000,
        headers: {
          'User-Agent': 'SIGO-Test/1.0'
        }
      };
      
      const response = await axios(config);
      console.log(`✅ ${endpoint.name}: ${response.status}`);
      
      if (endpoint.path === '/api/render-debug' && response.data) {
        console.log('📊 Debug Info:');
        console.log('  - NODE_ENV:', response.data.environment?.NODE_ENV);
        console.log('  - DATABASE_URL:', response.data.environment?.DATABASE_URL ? 'Configurado' : 'NO CONFIGURADO');
        console.log('  - PG_SSL:', response.data.environment?.PG_SSL);
        console.log('  - DB Status:', response.data.database?.status);
        console.log('  - Total Routes:', response.data.totalRoutes);
      }
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${endpoint.name}: ${error.response.status} - ${error.response.statusText}`);
        if (error.response.data) {
          console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
        }
      } else if (error.code === 'ECONNABORTED') {
        console.log(`⏰ ${endpoint.name}: Timeout (15s)`);
      } else {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    }
    
    console.log(''); // Línea en blanco
  }

  // Esperar un poco antes de probar login
  console.log('⏳ Esperando 30 segundos antes de probar login...');
  await new Promise(resolve => setTimeout(resolve, 30000));

  // Probar login con credenciales reales
  console.log('🔐 PROBANDO LOGIN CON CREDENCIALES REALES');
  console.log('=========================================');
  
  const loginData = {
    email: 'daniel1822@gmail.com',
    password: 'fran0404'
  };

  try {
    console.log('📤 Enviando POST a /api/auth/login...');
    
    const response = await axios.post(`${baseURL}/api/auth/login`, loginData, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SIGO-Test/1.0'
      }
    });
    
    console.log('🎉 LOGIN EXITOSO!');
    console.log('Status:', response.status);
    console.log('Token:', response.data.token ? 'Recibido' : 'No recibido');
    console.log('Usuario:', response.data.user ? `${response.data.user.nombre} ${response.data.user.apellido}` : 'No disponible');
    
  } catch (error) {
    console.log('❌ Error en login:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 429) {
        console.log('\n🚨 RATE LIMIT ACTIVO');
        console.log('El sistema está limitando las peticiones de login');
        console.log('Esto es normal después de muchas pruebas');
      }
      
      if (error.response.status === 500) {
        console.log('\n🚨 ERROR 500 - PROBLEMA INTERNO');
        console.log('El servidor tiene un error interno');
        console.log('Posibles causas:');
        console.log('1. Error en la conexión a la base de datos');
        console.log('2. Error en el código del servidor');
        console.log('3. Variables de entorno incorrectas');
      }
      
    } else {
      console.log('Error:', error.message);
    }
  }
}

testSimpleEndpoints().catch(console.error);
