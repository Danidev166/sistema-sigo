// Script para probar específicamente el frontend del dashboard
const axios = require('axios');

const BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function testFrontendDashboard() {
  console.log('🎯 PROBANDO FRONTEND DEL DASHBOARD\n');
  console.log('=' .repeat(50));

  try {
    // 1. Login para obtener token
    console.log('1. 🔑 Haciendo login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'daniel1822@gmail.com',
      password: 'fran0404'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido:', token.substring(0, 20) + '...');

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 2. Simular exactamente lo que hace el frontend
    console.log('\n2. 📊 Simulando llamadas del frontend...');
    
    // 2.1 Obtener estudiantes (como hace dashboardService)
    console.log('🔄 Obteniendo estudiantes...');
    const estudiantesRes = await axios.get(`${BASE_URL}/estudiantes`, { headers });
    console.log('✅ Estudiantes response:', {
      status: estudiantesRes.status,
      hasData: !!estudiantesRes.data,
      isArray: Array.isArray(estudiantesRes.data),
      length: Array.isArray(estudiantesRes.data) ? estudiantesRes.data.length : 'N/A'
    });

    // Procesar como lo hace el frontend
    let estudiantes = estudiantesRes.data;
    if (estudiantesRes.data && estudiantesRes.data.data) {
      estudiantes = estudiantesRes.data.data;
      console.log('📊 Usando datos paginados');
    }

    // Filtrar activos
    const estudiantesActivos = estudiantes.filter(
      (e) => e.estado && e.estado.toLowerCase() === "activo"
    );
    console.log(`✅ Estudiantes activos: ${estudiantesActivos.length}`);

    // 2.2 Obtener entrevistas
    console.log('\n🔄 Obteniendo entrevistas...');
    const entrevistasRes = await axios.get(`${BASE_URL}/entrevistas`, { headers });
    console.log('✅ Entrevistas:', entrevistasRes.data.length);

    // 2.3 Obtener alertas
    console.log('\n🔄 Obteniendo alertas...');
    const alertasRes = await axios.get(`${BASE_URL}/alertas`, { headers });
    const totalAlertas = alertasRes.data.filter((a) => a.estado === "Nueva").length;
    console.log('✅ Alertas nuevas:', totalAlertas);

    // 2.4 Obtener entrevistas por mes
    console.log('\n🔄 Obteniendo entrevistas por mes...');
    const entrevistasPorMesRes = await axios.get(`${BASE_URL}/entrevistas/por-mes`, { headers });
    console.log('✅ Entrevistas por mes:', entrevistasPorMesRes.data.length);

    // 2.5 Obtener evaluaciones por especialidad
    console.log('\n🔄 Obteniendo evaluaciones por especialidad...');
    const evaluacionesRes = await axios.get(`${BASE_URL}/evaluaciones/por-especialidad`, { headers });
    console.log('✅ Evaluaciones por especialidad:', evaluacionesRes.data.length);

    // 3. Simular el resultado final del dashboard
    console.log('\n3. 🎯 RESULTADO FINAL DEL DASHBOARD:');
    console.log('=' .repeat(30));
    console.log(`📊 Estudiantes activos: ${estudiantesActivos.length}`);
    console.log(`📊 Total entrevistas: ${entrevistasRes.data.length}`);
    console.log(`📊 Alertas nuevas: ${totalAlertas}`);
    console.log(`📊 Entrevistas por mes: ${entrevistasPorMesRes.data.length} registros`);
    console.log(`📊 Evaluaciones por especialidad: ${evaluacionesRes.data.length} registros`);

    // 4. Verificar si hay datos suficientes
    if (estudiantesActivos.length === 0) {
      console.log('\n⚠️ ADVERTENCIA: No hay estudiantes activos');
    }
    if (entrevistasRes.data.length === 0) {
      console.log('\n⚠️ ADVERTENCIA: No hay entrevistas');
    }
    if (totalAlertas === 0) {
      console.log('\n⚠️ ADVERTENCIA: No hay alertas nuevas');
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.response?.status, error.response?.data?.error || error.message);
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🏁 PRUEBA COMPLETADA');
}

testFrontendDashboard();
