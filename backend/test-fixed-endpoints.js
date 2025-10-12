const jwt = require('jsonwebtoken');

async function testFixedEndpoints() {
    try {
        console.log('🧪 Probando endpoints corregidos...\n');
        
        // Crear token manual (evitar rate limit)
        const token = jwt.sign(
            { id: '3', rol: 'Admin', nombre: 'DANIEL' }, 
            'tu_clave_secreta', 
            { expiresIn: '1h' }
        );
        console.log('✅ Token creado manualmente\n');
        
        // Probar endpoint de conducta
        console.log('📋 Probando conducta...');
        const conductaResponse = await fetch('http://localhost:3001/api/conducta/estudiante/8', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const conductaData = await conductaResponse.json();
        console.log(`  Status: ${conductaResponse.status}`);
        console.log(`  Registros: ${Array.isArray(conductaData) ? conductaData.length : 'N/A'}`);
        if (Array.isArray(conductaData) && conductaData.length > 0) {
            console.log(`  Muestra: ${conductaData[0].categoria} - ${conductaData[0].observacion}`);
        }
        
        // Probar endpoint de intervenciones
        console.log('\n📋 Probando intervenciones...');
        const intervencionesResponse = await fetch('http://localhost:3001/api/intervenciones?id_estudiante=8', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const intervencionesData = await intervencionesResponse.json();
        console.log(`  Status: ${intervencionesResponse.status}`);
        console.log(`  Registros: ${Array.isArray(intervencionesData) ? intervencionesData.length : 'N/A'}`);
        if (Array.isArray(intervencionesData) && intervencionesData.length > 0) {
            console.log(`  Muestra: ${intervencionesData[0].accion} - ${intervencionesData[0].meta}`);
        }
        
        // Probar endpoint de entrevistas (ya funciona)
        console.log('\n📋 Probando entrevistas...');
        const entrevistasResponse = await fetch('http://localhost:3001/api/entrevistas/estudiante/8', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const entrevistasData = await entrevistasResponse.json();
        console.log(`  Status: ${entrevistasResponse.status}`);
        console.log(`  Registros: ${Array.isArray(entrevistasData) ? entrevistasData.length : 'N/A'}`);
        if (Array.isArray(entrevistasData) && entrevistasData.length > 0) {
            console.log(`  Muestra: ${entrevistasData[0].motivo} - ${entrevistasData[0].estado}`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testFixedEndpoints();
