// Script para probar el módulo académico con datos reales
const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Función para hacer login y obtener token
async function login() {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@sigo.com', // Cambia por un usuario real
      password: 'admin123'      // Cambia por la contraseña real
    });
    return response.data.token;
  } catch (error) {
    console.error('❌ Error en login:', error.response?.data || error.message);
    return null;
  }
}

// Función para probar las estadísticas de seguimiento
async function testEstadisticasSeguimiento(token, idEstudiante) {
  try {
    console.log(`\n📊 Probando estadísticas de seguimiento para estudiante ${idEstudiante}...`);
    
    const response = await axios.get(
      `${API_BASE}/seguimiento-academico/estadisticas/${idEstudiante}?anio=2024`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log('✅ Estadísticas de seguimiento obtenidas:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Error en estadísticas de seguimiento:', error.response?.data || error.message);
    return null;
  }
}

// Función para probar las estadísticas de asistencia
async function testEstadisticasAsistencia(token, idEstudiante) {
  try {
    console.log(`\n📅 Probando estadísticas de asistencia para estudiante ${idEstudiante}...`);
    
    const response = await axios.get(
      `${API_BASE}/asistencia/estadisticas/${idEstudiante}?anio=2024`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log('✅ Estadísticas de asistencia obtenidas:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Error en estadísticas de asistencia:', error.response?.data || error.message);
    return null;
  }
}

// Función para probar crear un seguimiento académico
async function testCrearSeguimiento(token, idEstudiante) {
  try {
    console.log(`\n📝 Probando creación de seguimiento académico...`);
    
    const seguimientoData = {
      id_estudiante: idEstudiante,
      asignatura: 'Matemáticas',
      nota: 6.5,
      promedio_curso: 5.8,
      fecha: '2024-01-15'
    };
    
    const response = await axios.post(
      `${API_BASE}/seguimiento-academico`,
      seguimientoData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log('✅ Seguimiento académico creado:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Error creando seguimiento:', error.response?.data || error.message);
    return null;
  }
}

// Función para probar crear una asistencia
async function testCrearAsistencia(token, idEstudiante) {
  try {
    console.log(`\n📅 Probando creación de asistencia...`);
    
    const asistenciaData = {
      id_estudiante: idEstudiante,
      fecha: '2024-01-15',
      tipo: 'Presente',
      justificacion: ''
    };
    
    const response = await axios.post(
      `${API_BASE}/asistencia`,
      asistenciaData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log('✅ Asistencia creada:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Error creando asistencia:', error.response?.data || error.message);
    return null;
  }
}

// Función principal de prueba
async function probarModuloAcademico() {
  console.log('🚀 Iniciando pruebas del módulo académico...\n');
  
  // 1. Login
  const token = await login();
  if (!token) {
    console.error('❌ No se pudo obtener el token. Verifica las credenciales.');
    return;
  }
  console.log('✅ Login exitoso');
  
  // ID de estudiante para probar (cambia por uno real)
  const idEstudiante = 1;
  
  // 2. Probar estadísticas de seguimiento
  await testEstadisticasSeguimiento(token, idEstudiante);
  
  // 3. Probar estadísticas de asistencia
  await testEstadisticasAsistencia(token, idEstudiante);
  
  // 4. Probar crear seguimiento
  await testCrearSeguimiento(token, idEstudiante);
  
  // 5. Probar crear asistencia
  await testCrearAsistencia(token, idEstudiante);
  
  // 6. Probar estadísticas nuevamente para ver los cambios
  console.log('\n🔄 Probando estadísticas después de crear datos...');
  await testEstadisticasSeguimiento(token, idEstudiante);
  await testEstadisticasAsistencia(token, idEstudiante);
  
  console.log('\n✅ Pruebas completadas!');
}

// Ejecutar las pruebas
probarModuloAcademico().catch(console.error);
