const axios = require('axios');

async function testPsicosocialResponse() {
  try {
    console.log('🔍 Probando endpoint de seguimiento psicosocial...');
    
    // Primero hacer login para obtener token
    console.log('🔐 Haciendo login...');
    const loginResponse = await axios.post('https://sigo-caupolican.onrender.com/api/auth/login', {
      email: 'daniel1822@gmail.com',
      password: 'fran0404'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso, token obtenido');
    
    // Ahora probar el endpoint de seguimiento psicosocial con autenticación
    const psicosocialResponse = await axios.get('https://sigo-caupolican.onrender.com/api/seguimiento-psicosocial', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('📊 Respuesta completa:', psicosocialResponse.data);
    console.log('📊 Tipo de datos:', typeof psicosocialResponse.data);
    console.log('📊 Es array:', Array.isArray(psicosocialResponse.data));
    console.log('📊 Longitud:', psicosocialResponse.data?.length);
    
    if (Array.isArray(psicosocialResponse.data)) {
      console.log('✅ Los datos son un array correctamente');
      console.log('📋 Primer elemento:', psicosocialResponse.data[0]);
    } else {
      console.log('❌ Los datos NO son un array');
      console.log('🔍 Estructura de datos:', JSON.stringify(psicosocialResponse.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testPsicosocialResponse();
