const axios = require('axios');

const RENDER_BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function testSpecificEndpoints() {
  console.log('🧪 Probando endpoints específicos de reportes, movimientos y seguimiento...\n');
  
  const endpoints = [
    // Endpoints de reportes
    { name: 'Reportes Dashboard', url: '/reportes-mejorado/dashboard', method: 'GET' },
    { name: 'Reportes Generales', url: '/reportes', method: 'GET' },
    { name: 'Reportes Estudiantes', url: '/reportes/estudiantes', method: 'GET' },
    
    // Endpoints de movimientos
    { name: 'Movimientos Recursos', url: '/movimientos-recursos', method: 'GET' },
    { name: 'Entrega Recursos', url: '/entrega-recursos', method: 'GET' },
    
    // Endpoints de seguimiento psicosocial
    { name: 'Seguimiento Psicosocial', url: '/seguimiento-psicosocial', method: 'GET' },
    { name: 'Seguimiento Académico', url: '/seguimiento-academico', method: 'GET' },
    { name: 'Asistencia', url: '/asistencia', method: 'GET' },
    { name: 'Comunicación Familia', url: '/comunicacion-familia', method: 'GET' },
    { name: 'Intervenciones', url: '/intervenciones', method: 'GET' },
    { name: 'Conducta', url: '/conducta', method: 'GET' },
    { name: 'Historial Académico', url: '/historial-academico', method: 'GET' },
    
    // Endpoints generales de seguimiento
    { name: 'Seguimiento General', url: '/seguimiento', method: 'GET' },
    { name: 'Seguimiento Cronológico', url: '/seguimiento-cronologico', method: 'GET' },
    { name: 'Plantillas Reportes', url: '/plantillas-reportes', method: 'GET' }
  ];
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      console.log(`📊 Probando ${endpoint.name}...`);
      
      const response = await axios({
        method: endpoint.method,
        url: `${RENDER_BASE_URL}${endpoint.url}`,
        timeout: 10000,
        validateStatus: function (status) {
          return status < 500; // Aceptar 401, 404, etc. pero no 500
        }
      });
      
      if (response.status === 200) {
        console.log(`✅ ${endpoint.name}: Status ${response.status} - 🎉 Funcionando correctamente`);
        successCount++;
      } else if (response.status === 401) {
        console.log(`✅ ${endpoint.name}: Status ${response.status} - 🚫 Requiere autenticación (normal)`);
        successCount++;
      } else if (response.status === 404) {
        console.log(`⚠️ ${endpoint.name}: Status ${response.status} - 🔍 Endpoint no encontrado`);
        errorCount++;
      } else {
        console.log(`⚠️ ${endpoint.name}: Status ${response.status} - ⚠️ Respuesta inesperada`);
        errorCount++;
      }
      
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          console.log(`❌ ${endpoint.name}: Status ${error.response.status} - 💥 Error interno del servidor`);
        } else {
          console.log(`⚠️ ${endpoint.name}: Status ${error.response.status} - ⚠️ Error: ${error.response.statusText}`);
        }
      } else {
        console.log(`❌ ${endpoint.name}: Error de conexión - ${error.message}`);
      }
      errorCount++;
    }
    
    // Pequeña pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Resumen de pruebas:');
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📈 Total: ${endpoints.length}`);
  
  if (errorCount === 0) {
    console.log('\n🎉 ¡Todos los endpoints están funcionando correctamente!');
    console.log('💡 Los errores 401 son normales - indican que requieren autenticación');
  } else {
    console.log('\n⚠️ Algunos endpoints tienen problemas');
    console.log('💡 Revisa los logs del servidor para más detalles');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testSpecificEndpoints()
    .then(() => {
      console.log('\n✅ Pruebas completadas');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en las pruebas:', error.message);
      process.exit(1);
    });
}

module.exports = { testSpecificEndpoints };

