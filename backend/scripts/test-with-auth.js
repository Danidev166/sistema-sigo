const axios = require('axios');

const RENDER_BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function testWithAuth() {
  console.log('🔐 Probando endpoints con autenticación...\n');
  
  try {
    // 1. Hacer login para obtener token
    console.log('🔑 Obteniendo token de autenticación...');
    const loginResponse = await axios.post(`${RENDER_BASE_URL}/auth/login`, {
      email: 'test@test.com',
      password: 'test123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido exitosamente');
    
    // Headers con autenticación
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // 2. Probar endpoints específicos
    const endpoints = [
      { name: 'Reportes Dashboard', url: '/reportes-mejorado/dashboard' },
      { name: 'Reportes Generales', url: '/reportes' },
      { name: 'Seguimiento Psicosocial', url: '/seguimiento-psicosocial' },
      { name: 'Seguimiento Académico', url: '/seguimiento-academico' },
      { name: 'Asistencia', url: '/asistencia' },
      { name: 'Comunicación Familia', url: '/comunicacion-familia' },
      { name: 'Intervenciones', url: '/intervenciones' },
      { name: 'Conducta', url: '/conducta' },
      { name: 'Historial Académico', url: '/historial-academico' },
      { name: 'Seguimiento General', url: '/seguimiento' },
      { name: 'Seguimiento Cronológico', url: '/seguimiento-cronologico' },
      { name: 'Movimientos', url: '/movimientos' },
      { name: 'Entregas', url: '/entregas' }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`📊 Probando ${endpoint.name}...`);
        
        const response = await axios({
          method: 'GET',
          url: `${RENDER_BASE_URL}${endpoint.url}`,
          headers: authHeaders,
          timeout: 10000
        });
        
        console.log(`✅ ${endpoint.name}: Status ${response.status} - 🎉 Funcionando correctamente`);
        if (response.data && Array.isArray(response.data)) {
          console.log(`   📋 Datos: ${response.data.length} registros`);
        } else if (response.data && typeof response.data === 'object') {
          console.log(`   📋 Datos: Objeto con ${Object.keys(response.data).length} propiedades`);
        }
        successCount++;
        
      } catch (error) {
        if (error.response) {
          console.log(`❌ ${endpoint.name}: Status ${error.response.status} - ${error.response.statusText}`);
          if (error.response.data && error.response.data.message) {
            console.log(`   💬 Mensaje: ${error.response.data.message}`);
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
    } else {
      console.log('\n⚠️ Algunos endpoints tienen problemas');
    }
    
  } catch (error) {
    console.error('❌ Error en login:', error.response?.data || error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testWithAuth()
    .then(() => {
      console.log('\n✅ Pruebas completadas');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en las pruebas:', error.message);
      process.exit(1);
    });
}

module.exports = { testWithAuth };
