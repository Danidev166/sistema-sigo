// Script de prueba específico para el tab académico
console.log('🧪 INICIANDO PRUEBA DEL TAB ACADÉMICO');

// Función para probar el endpoint de seguimiento académico
async function testSeguimientoAcademico() {
  const estudianteId = 17;
  const anio = 2025;
  
  console.log(`📋 Probando seguimiento académico para estudiante ${estudianteId}, año ${anio}`);
  
  try {
    // Obtener token de autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No hay token de autenticación');
      return;
    }
    
    console.log('✅ Token encontrado:', token.substring(0, 20) + '...');
    
    // Probar endpoint de seguimiento académico
    const response = await fetch(`https://sistema-sigo.onrender.com/api/seguimiento-academico/estudiante/${estudianteId}?anio=${anio}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📡 Status de respuesta:', response.status);
    console.log('📡 Headers de respuesta:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error en respuesta:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('📊 Datos recibidos del backend:');
    console.log('  - Cantidad de registros:', data.length);
    console.log('  - Primeros 3 registros:', data.slice(0, 3));
    
    // Verificar estructura de datos
    if (data.length > 0) {
      const primerRegistro = data[0];
      console.log('🔍 Estructura del primer registro:');
      console.log('  - asignatura:', primerRegistro.asignatura);
      console.log('  - nota:', primerRegistro.nota);
      console.log('  - promedio_curso:', primerRegistro.promedio_curso);
      console.log('  - fecha:', primerRegistro.fecha);
      console.log('  - Todas las claves:', Object.keys(primerRegistro));
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Error en la petición:', error);
  }
}

// Función para probar el hook useSimpleData
async function testUseSimpleData() {
  console.log('\n🧪 PROBANDO HOOK useSimpleData');
  
  try {
    // Simular las llamadas que hace useSimpleData
    const estudianteId = 17;
    const anio = 2025;
    
    const [seguimiento, historial, asistencias, statsSeguimiento, statsAsistencia] = await Promise.all([
      fetch(`https://sistema-sigo.onrender.com/api/seguimiento-academico/estudiante/${estudianteId}?anio=${anio}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(r => r.json()).catch(() => ({ data: [] })),
      
      fetch(`https://sistema-sigo.onrender.com/api/historial-academico/estudiante/${estudianteId}?anio=${anio}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(r => r.json()).catch(() => ({ data: [] })),
      
      fetch(`https://sistema-sigo.onrender.com/api/asistencia/estudiante/${estudianteId}?anio=${anio}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(r => r.json()).catch(() => ({ data: [] })),
      
      fetch(`https://sistema-sigo.onrender.com/api/seguimiento-academico/estadisticas/${estudianteId}?anio=${anio}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(r => r.json()).catch(() => ({ data: null })),
      
      fetch(`https://sistema-sigo.onrender.com/api/asistencia/estadisticas/${estudianteId}?anio=${anio}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(r => r.json()).catch(() => ({ data: null }))
    ]);
    
    console.log('📊 Resultados de useSimpleData:');
    console.log('  - Seguimiento:', seguimiento.length || seguimiento.data?.length || 0, 'registros');
    console.log('  - Historial:', historial.length || historial.data?.length || 0, 'registros');
    console.log('  - Asistencias:', asistencias.length || asistencias.data?.length || 0, 'registros');
    console.log('  - Stats Seguimiento:', statsSeguimiento.data);
    console.log('  - Stats Asistencia:', statsAsistencia.data);
    
    // Mostrar datos de seguimiento
    const seguimientoData = seguimiento.data || seguimiento;
    if (seguimientoData.length > 0) {
      console.log('🔍 Datos de seguimiento para la tabla:');
      seguimientoData.slice(0, 3).forEach((item, index) => {
        console.log(`  Registro ${index + 1}:`, {
          asignatura: item.asignatura,
          nota: item.nota,
          promedio_curso: item.promedio_curso,
          fecha: item.fecha
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Error en useSimpleData:', error);
  }
}

// Ejecutar pruebas
window.testAcademicoTab = async () => {
  console.log('🚀 Iniciando pruebas del tab académico...');
  await testSeguimientoAcademico();
  await testUseSimpleData();
  console.log('✅ Pruebas completadas');
};

console.log('💡 Ejecuta testAcademicoTab() en la consola para probar el tab académico');
