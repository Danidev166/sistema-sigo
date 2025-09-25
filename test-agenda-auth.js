// Script para probar la autenticación y el endpoint de agenda
const axios = require('axios');

const API_BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function testAgendaAuth() {
  try {
    console.log('🔐 Probando autenticación...');
    
    // 1. Intentar hacer login
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@test.com', // Usar credenciales de prueba
      password: 'test123'
    });
    
    console.log('✅ Login exitoso:', loginResponse.data);
    const token = loginResponse.data.token;
    
    // 2. Probar endpoint de agenda con token
    console.log('📅 Probando endpoint de agenda...');
    const agendaResponse = await axios.get(`${API_BASE_URL}/agenda`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Agenda obtenida:', agendaResponse.data);
    console.log('📊 Total de registros:', agendaResponse.data.length);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('📊 Status:', error.response?.status);
    console.error('📊 Headers:', error.response?.headers);
  }
}

testAgendaAuth();
