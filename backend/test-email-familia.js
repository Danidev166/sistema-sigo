const axios = require('axios');

async function testEmailFamilia() {
  console.log('🔍 PROBANDO ENVÍO DE EMAIL EN COMUNICACIÓN FAMILIAR');
  console.log('==================================================\n');

  const baseURL = 'https://sistema-sigo.onrender.com';
  
  // Datos de prueba para comunicación familiar
  const comunicacionData = {
    id_estudiante: 1, // Cambia por un ID de estudiante válido
    tipo_comunicacion: 'Informe Académico',
    medio: 'Email',
    asunto: 'Prueba de comunicación familiar',
    contenido: 'Este es un mensaje de prueba para verificar el envío de email.',
    responsable_nombre: 'Patricia Crespo',
    enviar_email: true,
    fecha_comunicacion: new Date().toISOString().split('T')[0]
  };

  try {
    console.log('📤 Enviando comunicación familiar...');
    console.log('Datos:', JSON.stringify(comunicacionData, null, 2));
    
    const response = await axios.post(`${baseURL}/api/comunicacion-familia`, comunicacionData, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SIGO-Test/1.0'
      }
    });
    
    console.log('✅ Comunicación enviada exitosamente!');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Error en comunicación familiar:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Status Text:', error.response.statusText);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 500) {
        console.log('\n🚨 ERROR 500 - PROBLEMA INTERNO DEL SERVIDOR');
        console.log('Posibles causas:');
        console.log('1. Error en la conexión a la base de datos');
        console.log('2. Error en el servicio de email');
        console.log('3. Error en el controlador de comunicación familiar');
      }
      
      if (error.response.status === 400) {
        console.log('\n🚨 ERROR 400 - DATOS INCORRECTOS');
        console.log('Verificar que los datos enviados sean correctos');
      }
      
    } else if (error.code === 'ECONNABORTED') {
      console.log('⏰ Timeout (30s)');
    } else {
      console.log('Error:', error.message);
    }
  }

  // Probar también el endpoint de test-email
  console.log('\n🔍 PROBANDO ENDPOINT DE TEST-EMAIL');
  console.log('===================================');
  
  try {
    const testResponse = await axios.get(`${baseURL}/api/test-email`, {
      timeout: 15000,
      headers: {
        'User-Agent': 'SIGO-Test/1.0'
      }
    });
    
    console.log('✅ Test-email exitoso');
    console.log('Status:', testResponse.status);
    console.log('Data:', JSON.stringify(testResponse.data, null, 2));
    
  } catch (error) {
    console.log('❌ Error en test-email:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testEmailFamilia().catch(console.error);
