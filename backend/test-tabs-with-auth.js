const jwt = require('jsonwebtoken');

// Crear un token de prueba
const token = jwt.sign(
  { id: 1, rol: 'Admin', nombre: 'Test User' }, 
  'tu_clave_secreta', 
  { expiresIn: '1h' }
);

console.log('🔑 Token generado:', token.substring(0, 50) + '...');

// Función para hacer peticiones con autenticación
async function testEndpoint(endpoint, description) {
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
    console.log(`  Datos: ${JSON.stringify(data, null, 2)}`);
    
    return { success: response.ok, data };
  } catch (error) {
    console.log(`\n❌ ${description}: Error - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testAllEndpoints() {
  console.log('🧪 Probando endpoints de tabs con autenticación...\n');
  
  // Probar endpoints de tabs
  await testEndpoint('/api/conducta/estudiante/8', 'Conducta del estudiante 8');
  await testEndpoint('/api/intervenciones?id_estudiante=8', 'Intervenciones del estudiante 8');
  await testEndpoint('/api/entrevistas/estudiante/8', 'Entrevistas del estudiante 8');
  await testEndpoint('/api/comunicacion-familia?id_estudiante=8', 'Comunicación familia del estudiante 8');
}

testAllEndpoints();
