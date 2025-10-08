// Script completo de diagnóstico del dashboard
const axios = require('axios');

const BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function debugDashboardComplete() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DEL DASHBOARD\n');
  console.log('=' .repeat(50));

  // 1. Verificar conectividad básica
  console.log('1. 🔗 Verificando conectividad básica...');
  try {
    const healthCheck = await axios.get(`${BASE_URL.replace('/api', '')}/`, { timeout: 5000 });
    console.log(`✅ Servidor responde: ${healthCheck.status}`);
  } catch (error) {
    console.log(`❌ Error de conectividad: ${error.message}`);
    return;
  }

  // 2. Verificar endpoints sin autenticación
  console.log('\n2. 🔓 Verificando endpoints públicos...');
  
  try {
    const entrevistasTest = await axios.get(`${BASE_URL}/entrevistas/por-mes-test`);
    console.log(`✅ /entrevistas/por-mes-test: ${entrevistasTest.data.length} registros`);
  } catch (error) {
    console.log(`❌ /entrevistas/por-mes-test: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
  }

  try {
    const evaluacionesTest = await axios.get(`${BASE_URL}/evaluaciones/por-especialidad-test`);
    console.log(`✅ /evaluaciones/por-especialidad-test: ${evaluacionesTest.data.length} registros`);
  } catch (error) {
    console.log(`❌ /evaluaciones/por-especialidad-test: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
  }

  // 3. Verificar endpoints que requieren autenticación
  console.log('\n3. 🔐 Verificando endpoints protegidos (sin token)...');
  
  const protectedEndpoints = [
    '/estudiantes',
    '/entrevistas', 
    '/alertas',
    '/entrevistas/por-mes',
    '/evaluaciones/por-especialidad'
  ];

  for (const endpoint of protectedEndpoints) {
    try {
      await axios.get(`${BASE_URL}${endpoint}`);
      console.log(`⚠️ ${endpoint}: Responde sin autenticación (¿problema de seguridad?)`);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log(`✅ ${endpoint}: Correctamente protegido (${error.response.status})`);
      } else {
        console.log(`❌ ${endpoint}: Error inesperado (${error.response?.status}) - ${error.response?.data?.error || error.message}`);
      }
    }
  }

  // 4. Simular llamada con token (si tenemos uno)
  console.log('\n4. 🎫 Simulando llamada con token...');
  
  // Intentar obtener un token válido (esto requeriría credenciales reales)
  console.log('💡 Para probar con token real, necesitarías:');
  console.log('   - Credenciales válidas de un usuario');
  console.log('   - Hacer login para obtener token');
  console.log('   - Usar ese token en las llamadas');

  // 5. Verificar estructura de respuestas
  console.log('\n5. 📊 Verificando estructura de respuestas...');
  
  try {
    const entrevistasTest = await axios.get(`${BASE_URL}/entrevistas/por-mes-test`);
    console.log('📋 Estructura de /entrevistas/por-mes-test:');
    console.log('   - Tipo:', typeof entrevistasTest.data);
    console.log('   - Es array:', Array.isArray(entrevistasTest.data));
    if (Array.isArray(entrevistasTest.data) && entrevistasTest.data.length > 0) {
      console.log('   - Primer elemento:', Object.keys(entrevistasTest.data[0]));
    }
  } catch (error) {
    console.log('❌ No se pudo verificar estructura de entrevistas');
  }

  try {
    const evaluacionesTest = await axios.get(`${BASE_URL}/evaluaciones/por-especialidad-test`);
    console.log('📋 Estructura de /evaluaciones/por-especialidad-test:');
    console.log('   - Tipo:', typeof evaluacionesTest.data);
    console.log('   - Es array:', Array.isArray(evaluacionesTest.data));
    if (Array.isArray(evaluacionesTest.data) && evaluacionesTest.data.length > 0) {
      console.log('   - Primer elemento:', Object.keys(evaluacionesTest.data[0]));
    }
  } catch (error) {
    console.log('❌ No se pudo verificar estructura de evaluaciones');
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🏁 DIAGNÓSTICO COMPLETADO');
  console.log('\n💡 PRÓXIMOS PASOS:');
  console.log('1. Verificar que el usuario esté autenticado en el frontend');
  console.log('2. Revisar la consola del navegador para errores JavaScript');
  console.log('3. Verificar que el token se esté enviando correctamente');
  console.log('4. Comprobar que los datos se estén procesando correctamente en el dashboard');
}

debugDashboardComplete();
