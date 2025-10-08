// Script para probar el frontend del seguimiento psicosocial
const axios = require('axios');

const BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function testFrontendPsicosocial() {
  console.log('🎯 PROBANDO FRONTEND SEGUIMIENTO PSICOSOCIAL\n');
  console.log('=' .repeat(50));

  try {
    // 1. Login para obtener token
    console.log('1. 🔑 Haciendo login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'daniel1822@gmail.com',
      password: 'fran0404'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido');

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 2. Probar endpoint exacto que usa el frontend
    console.log('\n2. 📊 Probando endpoint del frontend...');
    
    try {
      const seguimientoRes = await axios.get(`${BASE_URL}/seguimiento-psicosocial`, { headers });
      console.log('✅ Seguimiento psicosocial response:', {
        status: seguimientoRes.status,
        hasData: !!seguimientoRes.data,
        isArray: Array.isArray(seguimientoRes.data),
        length: Array.isArray(seguimientoRes.data) ? seguimientoRes.data.length : 'N/A'
      });

      if (Array.isArray(seguimientoRes.data) && seguimientoRes.data.length > 0) {
        console.log('📋 Primer registro:', seguimientoRes.data[0]);
        console.log('📋 Campos disponibles:', Object.keys(seguimientoRes.data[0]));
      } else {
        console.log('⚠️ No hay datos de seguimiento psicosocial');
      }

    } catch (error) {
      console.log(`❌ Error en seguimiento psicosocial: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
    }

    // 3. Verificar si hay estudiantes
    console.log('\n3. 👥 Verificando estudiantes...');
    try {
      const estudiantesRes = await axios.get(`${BASE_URL}/estudiantes`, { headers });
      console.log('✅ Estudiantes response:', {
        status: estudiantesRes.status,
        hasData: !!estudiantesRes.data,
        isArray: Array.isArray(estudiantesRes.data),
        length: Array.isArray(estudiantesRes.data) ? estudiantesRes.data.length : 'N/A'
      });
    } catch (error) {
      console.log(`❌ Error en estudiantes: ${error.response?.status}`);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.response?.status, error.response?.data?.error || error.message);
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🏁 PRUEBA COMPLETADA');
}

testFrontendPsicosocial();
