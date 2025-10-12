// Script para probar todos los endpoints de estudiantes
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testEndpoints() {
  try {
    console.log('🧪 Probando endpoints de estudiantes...\n');
    
    // 1. Login para obtener token
    console.log('1️⃣ Probando login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'daniel1822@gmail.com',
      password: 'fran0404'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // 2. Obtener estudiantes
    console.log('\n2️⃣ Probando obtener estudiantes...');
    const estudiantesResponse = await axios.get(`${BASE_URL}/estudiantes`, { headers });
    console.log(`✅ Estudiantes encontrados: ${estudiantesResponse.data.length}`);
    
    if (estudiantesResponse.data.length > 0) {
      const estudianteId = estudiantesResponse.data[0].id;
      console.log(`📝 Usando estudiante ID: ${estudianteId}`);
      
      // 3. Probar seguimiento académico
      console.log('\n3️⃣ Probando seguimiento académico...');
      try {
        const seguimientoResponse = await axios.get(`${BASE_URL}/seguimiento-academico/estudiante/${estudianteId}?anio=2025`, { headers });
        console.log(`✅ Seguimiento académico: ${seguimientoResponse.data.length} registros`);
      } catch (error) {
        console.log(`❌ Error en seguimiento académico: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      
      // 4. Probar estadísticas de seguimiento
      console.log('\n4️⃣ Probando estadísticas de seguimiento...');
      try {
        const statsResponse = await axios.get(`${BASE_URL}/seguimiento-academico/estadisticas/${estudianteId}?anio=2025`, { headers });
        console.log(`✅ Estadísticas:`, statsResponse.data);
      } catch (error) {
        console.log(`❌ Error en estadísticas: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      
      // 5. Probar historial académico
      console.log('\n5️⃣ Probando historial académico...');
      try {
        const historialResponse = await axios.get(`${BASE_URL}/historial-academico/estudiante/${estudianteId}?anio=2025`, { headers });
        console.log(`✅ Historial académico: ${historialResponse.data.length} registros`);
      } catch (error) {
        console.log(`❌ Error en historial académico: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      
      // 6. Probar asistencia
      console.log('\n6️⃣ Probando asistencia...');
      try {
        const asistenciaResponse = await axios.get(`${BASE_URL}/asistencia?id_estudiante=${estudianteId}`, { headers });
        console.log(`✅ Asistencia: ${asistenciaResponse.data.length} registros`);
      } catch (error) {
        console.log(`❌ Error en asistencia: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      
      // 7. Probar estadísticas de asistencia
      console.log('\n7️⃣ Probando estadísticas de asistencia...');
      try {
        const statsAsistenciaResponse = await axios.get(`${BASE_URL}/asistencia/estadisticas/${estudianteId}?anio=2025`, { headers });
        console.log(`✅ Estadísticas asistencia:`, statsAsistenciaResponse.data);
      } catch (error) {
        console.log(`❌ Error en estadísticas asistencia: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      
      // 8. Probar evaluaciones
      console.log('\n8️⃣ Probando evaluaciones...');
      try {
        const evaluacionesResponse = await axios.get(`${BASE_URL}/evaluaciones?id_estudiante=${estudianteId}`, { headers });
        console.log(`✅ Evaluaciones: ${evaluacionesResponse.data.length} registros`);
      } catch (error) {
        console.log(`❌ Error en evaluaciones: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      
      // 9. Probar conducta
      console.log('\n9️⃣ Probando conducta...');
      try {
        const conductaResponse = await axios.get(`${BASE_URL}/conducta/estudiante/${estudianteId}`, { headers });
        console.log(`✅ Conducta: ${conductaResponse.data.length} registros`);
      } catch (error) {
        console.log(`❌ Error en conducta: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      
      // 10. Probar intervenciones
      console.log('\n🔟 Probando intervenciones...');
      try {
        const intervencionesResponse = await axios.get(`${BASE_URL}/intervenciones?id_estudiante=${estudianteId}`, { headers });
        console.log(`✅ Intervenciones: ${intervencionesResponse.data.length} registros`);
      } catch (error) {
        console.log(`❌ Error en intervenciones: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      
      // 11. Probar entrevistas
      console.log('\n1️⃣1️⃣ Probando entrevistas...');
      try {
        const entrevistasResponse = await axios.get(`${BASE_URL}/entrevistas/estudiante/${estudianteId}`, { headers });
        console.log(`✅ Entrevistas: ${entrevistasResponse.data.length} registros`);
      } catch (error) {
        console.log(`❌ Error en entrevistas: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      
      // 12. Probar comunicación familia
      console.log('\n1️⃣2️⃣ Probando comunicación familia...');
      try {
        const familiaResponse = await axios.get(`${BASE_URL}/comunicacion-familia?id_estudiante=${estudianteId}`, { headers });
        console.log(`✅ Comunicación familia: ${familiaResponse.data.length} registros`);
      } catch (error) {
        console.log(`❌ Error en comunicación familia: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testEndpoints();


