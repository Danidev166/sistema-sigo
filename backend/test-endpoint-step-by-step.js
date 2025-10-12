const jwt = require('jsonwebtoken');

async function testEndpointStepByStep() {
    try {
        console.log('🔍 Probando endpoint paso a paso...\n');
        
        // 1. Crear token
        const token = jwt.sign(
            { id: 3, rol: 'Admin', nombre: 'DANIEL' }, 
            'tu_clave_secreta', 
            { expiresIn: '1h' }
        );
        console.log('✅ Token creado');
        
        // 2. Probar endpoint
        const response = await fetch('http://localhost:3001/api/conducta/estudiante/8', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`📊 Status: ${response.status}`);
        console.log(`📊 Headers:`, Object.fromEntries(response.headers.entries()));
        
        // 3. Leer respuesta
        const text = await response.text();
        console.log(`📊 Response text: ${text}`);
        
        // 4. Intentar parsear como JSON
        try {
            const data = JSON.parse(text);
            console.log(`📊 Parsed data:`, JSON.stringify(data, null, 2));
        } catch (parseError) {
            console.log(`❌ Error parsing JSON: ${parseError.message}`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testEndpointStepByStep();
