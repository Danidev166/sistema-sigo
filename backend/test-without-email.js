const axios = require('axios');

async function testSystemWithoutEmail() {
  console.log('🔍 PROBANDO SISTEMA SIN EMAIL');
  console.log('==============================\n');

  const baseURL = 'https://sistema-sigo.onrender.com';
  
  // Probar endpoints que no requieren email
  const endpoints = [
    { method: 'GET', path: '/', name: 'Home' },
    { method: 'GET', path: '/api/health', name: 'Health Check' },
    { method: 'GET', path: '/api/estudiantes', name: 'Estudiantes (requiere auth)' }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📤 ${endpoint.method} ${endpoint.path}...`);
      
      const config = {
        method: endpoint.method.toLowerCase(),
        url: `${baseURL}${endpoint.path}`,
        timeout: 10000,
        headers: {
          'User-Agent': 'SIGO-Test/1.0'
        }
      };
      
      const response = await axios(config);
      console.log(`✅ ${endpoint.name}: ${response.status}`);
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${endpoint.name}: ${error.response.status} - ${error.response.statusText}`);
        
        if (error.response.status === 403) {
          console.log('   ℹ️  Requiere autenticación (normal)');
        }
      } else {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    }
  }

  // Probar login (sin enviar email)
  console.log('\n🔐 PROBANDO LOGIN (SIN ENVÍO DE EMAIL)');
  console.log('=======================================');
  
  const loginData = {
    email: 'daniel1822@gmail.com',
    password: 'fran0404'
  };

  try {
    console.log('📤 Intentando login...');
    
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
    
    // Si el login funciona, el sistema está OK
    console.log('\n✅ CONCLUSIÓN:');
    console.log('El sistema funciona correctamente');
    console.log('Solo el envío de emails tiene problemas');
    console.log('Esto no afecta la funcionalidad principal');
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Error en login:');
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 429) {
        console.log('\n🚨 RATE LIMIT ACTIVO');
        console.log('Espera unos minutos y prueba en el navegador');
      }
    } else {
      console.log('Error:', error.message);
    }
  }
}

testSystemWithoutEmail().catch(console.error);
