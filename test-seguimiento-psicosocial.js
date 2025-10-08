// Script para probar seguimiento psicosocial
const axios = require('axios');

const BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function testSeguimientoPsicosocial() {
  console.log('🔍 PROBANDO SEGUIMIENTO PSICOSOCIAL\n');
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

    // 2. Probar endpoint de seguimiento psicosocial
    console.log('\n2. 📊 Probando seguimiento psicosocial...');
    
    try {
      const seguimientoRes = await axios.get(`${BASE_URL}/seguimiento-psicosocial`, { headers });
      console.log('✅ Seguimiento psicosocial response:', {
        status: seguimientoRes.status,
        hasData: !!seguimientoRes.data,
        isArray: Array.isArray(seguimientoRes.data),
        length: Array.isArray(seguimientoRes.data) ? seguimientoRes.data.length : 'N/A'
      });

      if (Array.isArray(seguimientoRes.data) && seguimientoRes.data.length > 0) {
        console.log('📋 Primer registro:', Object.keys(seguimientoRes.data[0]));
        console.log('📋 Datos del primer registro:', seguimientoRes.data[0]);
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
      console.log('✅ Estudiantes:', estudiantesRes.data.length || 'N/A');
    } catch (error) {
      console.log(`❌ Error en estudiantes: ${error.response?.status}`);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.response?.status, error.response?.data?.error || error.message);
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🏁 PRUEBA COMPLETADA');
}

testSeguimientoPsicosocial();
