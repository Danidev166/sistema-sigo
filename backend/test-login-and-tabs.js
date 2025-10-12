// Función para hacer login y obtener token
async function loginAndGetToken() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'daniel1822@gmail.com',
        password: 'fran0404'
      })
    });
    
    const data = await response.json();
    console.log('🔑 Login response:', data);
    
    if (data.token) {
      return data.token;
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    throw error;
  }
}

// Función para probar endpoints con autenticación
async function testEndpoint(endpoint, description, token) {
  try {
    const response = await fetch(`http://localhost:3001${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    console.log(`\n📋 ${description}:`);
    console.log(`  Status: ${response.status}`);
    console.log(`  Success: ${data.success || 'N/A'}`);
    console.log(`  Data length: ${data.data ? data.data.length : 'N/A'}`);
    if (data.data && data.data.length > 0) {
      console.log(`  Sample: ${JSON.stringify(data.data[0], null, 2)}`);
    }
    
    return { success: response.ok, data };
  } catch (error) {
    console.log(`\n❌ ${description}: Error - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testAllTabs() {
  try {
    console.log('🔐 Haciendo login...');
    const token = await loginAndGetToken();
    console.log('✅ Token obtenido exitosamente\n');
    
    console.log('🧪 Probando endpoints de tabs...\n');
    
    // Probar endpoints de tabs
    await testEndpoint('/api/conducta/estudiante/8', 'Conducta del estudiante 8', token);
    await testEndpoint('/api/intervenciones?id_estudiante=8', 'Intervenciones del estudiante 8', token);
    await testEndpoint('/api/entrevistas/estudiante/8', 'Entrevistas del estudiante 8', token);
    await testEndpoint('/api/comunicacion-familia?id_estudiante=8', 'Comunicación familia del estudiante 8', token);
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testAllTabs();
