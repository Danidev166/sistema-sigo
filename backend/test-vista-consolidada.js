async function testVistaConsolidada() {
    try {
        console.log('🧪 Probando Vista Consolidada...\n');
        
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
        
        // Probar endpoint de vista consolidada
        console.log('📋 Probando endpoint /reportes/estudiante/8...');
        const response = await fetch('http://localhost:3001/api/reportes/estudiante/8', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`  Status: ${response.status}`);
        const data = await response.json();
        console.log(`  Data:`, JSON.stringify(data, null, 2));
        
        if (response.status === 200) {
            console.log(`  ✅ Vista Consolidada: Funcionando`);
        } else {
            console.log(`  ❌ Vista Consolidada: Error ${response.status}`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testVistaConsolidada();
