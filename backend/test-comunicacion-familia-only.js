async function testComunicacionFamiliaOnly() {
    try {
        console.log('🧪 Probando solo Comunicación Familia...\n');
        
        // Login
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
        
        // Probar endpoint de comunicacion_familia
        console.log('📋 Probando Comunicación Familia...');
        const response = await fetch('http://localhost:3001/api/comunicacion-familia?id_estudiante=8', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`  Status: ${response.status}`);
        const data = await response.json();
        console.log(`  Registros: ${Array.isArray(data) ? data.length : 'N/A'}`);
        
        if (Array.isArray(data) && data.length > 0) {
            console.log(`  ✅ Comunicación Familia: ${data.length} registros encontrados`);
            console.log(`  Muestra: ${data[0].tipo_comunicacion} - ${data[0].asunto}`);
        } else {
            console.log(`  ❌ Comunicación Familia: Sin datos`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testComunicacionFamiliaOnly();
