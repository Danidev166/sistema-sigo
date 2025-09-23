const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 Probando endpoint de login...');
    
    const response = await axios.post('https://sistema-sigo.onrender.com/api/auth/login', {
      email: 'admin@tu-liceo.cl',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Login exitoso:', response.data);
    
  } catch (error) {
    if (error.response) {
      console.log('📊 Respuesta del servidor:');
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('❌ Error de conexión:', error.message);
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testLogin();
