async function testWithRealLogin() {
    try {
        console.log('🔐 Haciendo login real...');
        
        // Login real
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
        console.log('✅ Token obtenido del login real\n');
        
        // Probar endpoint de conducta
        console.log('🧪 Probando endpoint de conducta...');
        const conductaResponse = await fetch('http://localhost:3001/api/conducta/estudiante/8', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`📊 Status: ${conductaResponse.status}`);
        const conductaData = await conductaResponse.json();
        console.log(`📊 Data:`, JSON.stringify(conductaData, null, 2));
        
        // Probar endpoint de intervenciones
        console.log('\n🧪 Probando endpoint de intervenciones...');
        const intervencionesResponse = await fetch('http://localhost:3001/api/intervenciones?id_estudiante=8', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`📊 Status: ${intervencionesResponse.status}`);
        const intervencionesData = await intervencionesResponse.json();
        console.log(`📊 Data:`, JSON.stringify(intervencionesData, null, 2));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testWithRealLogin();
