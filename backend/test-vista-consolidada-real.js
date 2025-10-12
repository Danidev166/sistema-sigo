async function testVistaConsolidadaReal() {
    try {
        console.log('🧪 Probando Vista Consolidada con estudiante real...\n');
        
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
        
        // Probar con estudiantes que sí existen
        const estudiantes = [11, 12, 13, 14, 15, 16];
        
        for (const estudianteId of estudiantes) {
            console.log(`📋 Probando estudiante ID ${estudianteId}...`);
            
            const response = await fetch(`http://localhost:3001/api/reportes/estudiante/${estudianteId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log(`  Status: ${response.status}`);
            const data = await response.json();
            
            if (response.status === 200) {
                console.log(`  ✅ Estudiante ${estudianteId}: Funcionando`);
                console.log(`  Datos:`, JSON.stringify(data, null, 2));
                break; // Si uno funciona, no necesitamos probar los demás
            } else {
                console.log(`  ❌ Estudiante ${estudianteId}: Error ${response.status}`);
                console.log(`  Error:`, data.error || data.message);
            }
            console.log('');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testVistaConsolidadaReal();
