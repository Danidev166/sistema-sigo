const fetch = require('node-fetch');

async function testAPIEstudiantes() {
  const BASE_URL = 'https://sistema-sigo-backend.onrender.com/api';
  
  console.log('🔍 PROBANDO API DE ESTUDIANTES DESDE BACKEND');
  console.log('=' .repeat(60));
  console.log(`URL Base: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toLocaleString()}`);
  console.log('');

  try {
    // Test 1: Ruta pública
    console.log('🔓 Test 1: GET /estudiantes/public');
    console.log('-'.repeat(40));
    
    const responsePublica = await fetch(`${BASE_URL}/estudiantes/public`);
    console.log(`Status: ${responsePublica.status}`);
    console.log(`Headers:`, [...responsePublica.headers.entries()]);
    
    if (responsePublica.ok) {
      const dataPublica = await responsePublica.json();
      console.log(`✅ Éxito: ${dataPublica.length} estudiantes encontrados`);
      console.log('Estudiantes:');
      dataPublica.forEach((est, index) => {
        console.log(`  ${index + 1}. ${est.nombre} ${est.apellido} (${est.curso}) - ${est.estado}`);
      });
    } else {
      const errorText = await responsePublica.text();
      console.log(`❌ Error: ${errorText}`);
    }
    
    console.log('');

    // Test 2: Ruta protegida (sin token)
    console.log('🔒 Test 2: GET /estudiantes (sin autenticación)');
    console.log('-'.repeat(40));
    
    const responseProtegida = await fetch(`${BASE_URL}/estudiantes`);
    console.log(`Status: ${responseProtegida.status}`);
    console.log(`Headers:`, [...responseProtegida.headers.entries()]);
    
    if (responseProtegida.ok) {
      const dataProtegida = await responseProtegida.json();
      console.log(`✅ Éxito: ${Array.isArray(dataProtegida) ? dataProtegida.length : 'N/A'} estudiantes encontrados`);
      console.log('Respuesta:', JSON.stringify(dataProtegida, null, 2));
    } else {
      const errorText = await responseProtegida.text();
      console.log(`❌ Error: ${errorText}`);
    }
    
    console.log('');

    // Test 3: Verificar conectividad
    console.log('🌐 Test 3: Verificar conectividad');
    console.log('-'.repeat(40));
    
    const responseHealth = await fetch(`${BASE_URL.replace('/api', '')}/health`);
    console.log(`Health check status: ${responseHealth.status}`);
    
    if (responseHealth.ok) {
      const healthData = await responseHealth.json();
      console.log('Health check response:', healthData);
    } else {
      console.log('Health check falló');
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
    console.error('Stack:', error.stack);
  }
  
  console.log('');
  console.log('✅ Test completado');
}

testAPIEstudiantes();
