const axios = require('axios');

async function testLoginWithRealCredentials() {
  console.log('🔍 PROBANDO LOGIN CON CREDENCIALES REALES');
  console.log('==========================================\n');

  const baseURL = 'https://sistema-sigo.onrender.com';
  
  // Credenciales reales que me proporcionaste
  const loginData = {
    email: 'daniel1822@gmail.com',
    password: 'fran0404'
  };

  try {
    console.log('📤 Enviando POST a /api/auth/login...');
    console.log('Email:', loginData.email);
    console.log('Password:', '*'.repeat(loginData.password.length));
    
    const response = await axios.post(`${baseURL}/api/auth/login`, loginData, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SIGO-Test/1.0'
      }
    });
    
    console.log('✅ LOGIN EXITOSO!');
    console.log('Status:', response.status);
    console.log('Token recibido:', response.data.token ? 'Sí' : 'No');
    console.log('Usuario:', response.data.user ? response.data.user.email : 'No disponible');
    
  } catch (error) {
    console.log('❌ Error en login:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Status Text:', error.response.statusText);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 500) {
        console.log('\n🚨 ERROR 500 - PROBLEMA INTERNO DEL SERVIDOR');
        console.log('Posibles causas:');
        console.log('1. Error en la conexión a la base de datos');
        console.log('2. Error en el modelo de autenticación');
        console.log('3. Variables de entorno incorrectas');
        console.log('4. Error en el controlador de autenticación');
      }
      
      if (error.response.status === 429) {
        console.log('\n🚨 RATE LIMIT - Demasiadas peticiones');
        console.log('Esperando 60 segundos...');
        
        await new Promise(resolve => setTimeout(resolve, 60000));
        
        console.log('🔄 Reintentando...');
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
          console.log('❌ Reintento falló:', retryError.response?.status);
        }
      }
      
    } else if (error.code === 'ECONNABORTED') {
      console.log('⏰ Timeout (15s)');
    } else {
      console.log('Error:', error.message);
    }
  }

  // Probar también el endpoint de test-email para verificar base de datos
  console.log('\n🔍 PROBANDO CONEXIÓN A BASE DE DATOS');
  console.log('=====================================');
  
  try {
    const dbResponse = await axios.get(`${baseURL}/api/test-email`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'SIGO-Test/1.0'
      }
    });
    
    console.log('✅ Base de datos conectada');
    console.log('Status:', dbResponse.status);
    console.log('Data:', JSON.stringify(dbResponse.data, null, 2));
    
  } catch (error) {
    console.log('❌ Error en base de datos:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLoginWithRealCredentials().catch(console.error);
