// Script para probar el endpoint de registrar entrevista desde agenda
const axios = require('axios');

const API_BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function testRegistrarEntrevista() {
  try {
    console.log('🔐 Probando autenticación...');
    
    // 1. Hacer login
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@test.com',
      password: 'test123'
    });
    
    console.log('✅ Login exitoso');
    const token = loginResponse.data.token;
    
    // 2. Obtener agenda para tener un ID válido
    console.log('📅 Obteniendo agenda...');
    const agendaResponse = await axios.get(`${API_BASE_URL}/agenda`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (agendaResponse.data.length === 0) {
      console.log('❌ No hay elementos en la agenda para probar');
      return;
    }
    
    const agendaId = agendaResponse.data[0].id;
    console.log('📋 Usando agenda ID:', agendaId);
    
    // 3. Probar registrar entrevista
    console.log('📝 Probando registrar entrevista...');
    const entrevistaData = {
      observaciones: 'Prueba de observaciones',
      conclusiones: 'Prueba de conclusiones',
      acciones_acordadas: 'Prueba de acciones'
    };
    
    const registrarResponse = await axios.post(
      `${API_BASE_URL}/entrevistas/registrar-desde-agenda/${agendaId}`,
      entrevistaData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Entrevista registrada exitosamente:', registrarResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('📊 Status:', error.response?.status);
    console.error('📊 Headers:', error.response?.headers);
  }
}

testRegistrarEntrevista();

