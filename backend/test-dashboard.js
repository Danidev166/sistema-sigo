const axios = require('axios');

const BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function testDashboard() {
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
    
    // 2. Probar endpoint del dashboard
    console.log('\n📊 Probando endpoint del dashboard...');
    try {
      const response = await axios.get(`${BASE_URL}/reportes-mejorado/dashboard`, { headers });
      console.log('✅ Dashboard: Status', response.status);
      console.log('📋 Datos del dashboard:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('❌ Dashboard: Status', error.response?.status || 'Error');
      console.log('🔍 Error:', error.response?.data?.error || error.message);
      console.log('📋 Detalles:', JSON.stringify(error.response?.data, null, 2));
    }
    
    // 3. Probar endpoint de reporte institucional
    console.log('\n📊 Probando endpoint de reporte institucional...');
    try {
      const response = await axios.get(`${BASE_URL}/reportes-mejorado/institucional`, { headers });
      console.log('✅ Reporte Institucional: Status', response.status);
      console.log('📋 Datos del reporte:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('❌ Reporte Institucional: Status', error.response?.status || 'Error');
      console.log('🔍 Error:', error.response?.data?.error || error.message);
      console.log('📋 Detalles:', JSON.stringify(error.response?.data, null, 2));
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testDashboard();
