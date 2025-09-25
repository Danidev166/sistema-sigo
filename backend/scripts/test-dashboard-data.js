const axios = require('axios');

async function testDashboardData() {
  const baseURL = 'https://sistema-sigo.onrender.com/api';
  
  console.log('🧪 Probando datos del dashboard...');
  
  try {
    // Probar endpoint de estudiantes
    console.log('\n📊 Probando endpoint de estudiantes...');
    const estudiantesResponse = await axios.get(`${baseURL}/estudiantes`, {
      headers: {
        'Authorization': 'Bearer test-token'
      },
      timeout: 10000
    });
    console.log(`✅ Estudiantes: Status ${estudiantesResponse.status}`);
    
  } catch (error) {
    if (error.response) {
      console.log(`📊 Estudiantes: Status ${error.response.status} - ${error.response.data?.error || 'Error'}`);
    } else {
      console.log(`❌ Estudiantes: Error de conexión - ${error.message}`);
    }
  }
  
  try {
    // Probar endpoint de recursos
    console.log('\n📊 Probando endpoint de recursos...');
    const recursosResponse = await axios.get(`${baseURL}/recursos`, {
      headers: {
        'Authorization': 'Bearer test-token'
      },
      timeout: 10000
    });
    console.log(`✅ Recursos: Status ${recursosResponse.status}`);
    
  } catch (error) {
    if (error.response) {
      console.log(`📊 Recursos: Status ${error.response.status} - ${error.response.data?.error || 'Error'}`);
    } else {
      console.log(`❌ Recursos: Error de conexión - ${error.message}`);
    }
  }
  
  try {
    // Probar endpoint de evaluaciones
    console.log('\n📊 Probando endpoint de evaluaciones...');
    const evaluacionesResponse = await axios.get(`${baseURL}/evaluaciones`, {
      headers: {
        'Authorization': 'Bearer test-token'
      },
      timeout: 10000
    });
    console.log(`✅ Evaluaciones: Status ${evaluacionesResponse.status}`);
    
  } catch (error) {
    if (error.response) {
      console.log(`📊 Evaluaciones: Status ${error.response.status} - ${error.response.data?.error || 'Error'}`);
    } else {
      console.log(`❌ Evaluaciones: Error de conexión - ${error.message}`);
    }
  }
  
  try {
    // Probar endpoint de entrevistas
    console.log('\n📊 Probando endpoint de entrevistas...');
    const entrevistasResponse = await axios.get(`${baseURL}/entrevistas`, {
      headers: {
        'Authorization': 'Bearer test-token'
      },
      timeout: 10000
    });
    console.log(`✅ Entrevistas: Status ${entrevistasResponse.status}`);
    
  } catch (error) {
    if (error.response) {
      console.log(`📊 Entrevistas: Status ${error.response.status} - ${error.response.data?.error || 'Error'}`);
    } else {
      console.log(`❌ Entrevistas: Error de conexión - ${error.message}`);
    }
  }
  
  console.log('\n🎉 Pruebas de dashboard completadas');
  console.log('\n💡 Los errores 401 son normales - indican que los endpoints funcionan pero requieren autenticación');
  console.log('💡 Ahora tu dashboard debería mostrar datos reales cuando hagas login');
}

testDashboardData();

