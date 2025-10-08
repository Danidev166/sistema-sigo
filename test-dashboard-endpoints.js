// Script para probar los endpoints del dashboard
const axios = require('axios');

const BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function testDashboardEndpoints() {
  console.log('🔄 Probando endpoints del dashboard...\n');

  try {
    // 1. Probar endpoint de estudiantes
    console.log('1. Probando /estudiantes...');
    const estudiantes = await axios.get(`${BASE_URL}/estudiantes`);
    console.log(`✅ Estudiantes: ${estudiantes.data.length} registros`);
    if (estudiantes.data.data) {
      console.log(`📊 Con paginación: ${estudiantes.data.data.length} registros`);
    }

    // 2. Probar endpoint de entrevistas
    console.log('\n2. Probando /entrevistas...');
    const entrevistas = await axios.get(`${BASE_URL}/entrevistas`);
    console.log(`✅ Entrevistas: ${entrevistas.data.length} registros`);

    // 3. Probar endpoint de alertas
    console.log('\n3. Probando /alertas...');
    const alertas = await axios.get(`${BASE_URL}/alertas`);
    console.log(`✅ Alertas: ${alertas.data.length} registros`);

    // 4. Probar endpoint de entrevistas por mes
    console.log('\n4. Probando /entrevistas/por-mes...');
    try {
      const entrevistasPorMes = await axios.get(`${BASE_URL}/entrevistas/por-mes`);
      console.log(`✅ Entrevistas por mes: ${entrevistasPorMes.data.length} registros`);
    } catch (error) {
      console.log(`❌ Error en /entrevistas/por-mes: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      
      // Probar endpoint de prueba
      console.log('🔄 Probando /entrevistas/por-mes-test...');
      const entrevistasPorMesTest = await axios.get(`${BASE_URL}/entrevistas/por-mes-test`);
      console.log(`✅ Entrevistas por mes (test): ${entrevistasPorMesTest.data.length} registros`);
    }

    // 5. Probar endpoint de evaluaciones por especialidad
    console.log('\n5. Probando /evaluaciones/por-especialidad...');
    try {
      const evaluaciones = await axios.get(`${BASE_URL}/evaluaciones/por-especialidad`);
      console.log(`✅ Evaluaciones por especialidad: ${evaluaciones.data.length} registros`);
    } catch (error) {
      console.log(`❌ Error en /evaluaciones/por-especialidad: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      
      // Probar endpoint de prueba
      console.log('🔄 Probando /evaluaciones/por-especialidad-test...');
      const evaluacionesTest = await axios.get(`${BASE_URL}/evaluaciones/por-especialidad-test`);
      console.log(`✅ Evaluaciones por especialidad (test): ${evaluacionesTest.data.length} registros`);
    }

    console.log('\n✅ Todos los endpoints probados correctamente');

  } catch (error) {
    console.error('❌ Error general:', error.response?.status, error.response?.data || error.message);
  }
}

testDashboardEndpoints();
