async function testWithDelay() {
    try {
        console.log('⏳ Esperando 30 segundos para resetear rate limit...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        console.log('🔐 Haciendo login...');
        const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'daniel1822@gmail.com',
                password: 'fran0404'
            })
        });
        
        const loginData = await loginResponse.json();
        console.log('📊 Login response:', loginData);
        
        if (!loginData.token) {
            throw new Error('No se obtuvo token del login');
        }
        
        const token = loginData.token;
        console.log('✅ Token obtenido\n');
        
        // Probar endpoints
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
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testWithDelay();
