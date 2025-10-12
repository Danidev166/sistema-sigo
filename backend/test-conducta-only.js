const jwt = require('jsonwebtoken');

// Crear un token de prueba
const token = jwt.sign(
  { id: 3, rol: 'Admin', nombre: 'DANIEL' }, 
  'tu_clave_secreta', 
  { expiresIn: '1h' }
);

async function testConductaEndpoint() {
  try {
    console.log('🧪 Probando endpoint de conducta...\n');
    
    const response = await fetch('http://localhost:3001/api/conducta/estudiante/8', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    console.log('📋 Respuesta del endpoint:');
    console.log(`  Status: ${response.status}`);
    console.log(`  Success: ${data.success || 'N/A'}`);
    console.log(`  Data: ${JSON.stringify(data, null, 2)}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConductaEndpoint();
