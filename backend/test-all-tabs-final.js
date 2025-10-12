async function testAllTabsFinal() {
    try {
        console.log('🧪 Probando todos los tabs corregidos...\n');
        
        // Usar login real
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
        
        // Probar todos los endpoints
        const endpoints = [
            { url: '/api/conducta/estudiante/8', name: 'Conducta' },
            { url: '/api/intervenciones?id_estudiante=8', name: 'Intervenciones' },
            { url: '/api/entrevistas/estudiante/8', name: 'Entrevistas' },
            { url: '/api/comunicacion-familia?id_estudiante=8', name: 'Comunicación Familia' }
        ];
        
        for (const endpoint of endpoints) {
            console.log(`📋 Probando ${endpoint.name}...`);
            
            const response = await fetch(`http://localhost:3001${endpoint.url}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            console.log(`  Status: ${response.status}`);
            console.log(`  Registros: ${Array.isArray(data) ? data.length : 'N/A'}`);
            
            if (Array.isArray(data) && data.length > 0) {
                console.log(`  ✅ ${endpoint.name}: ${data.length} registros encontrados`);
                if (data[0]) {
                    const sample = data[0];
                    if (sample.categoria) {
                        console.log(`    Muestra: ${sample.categoria} - ${sample.observacion}`);
                    } else if (sample.accion) {
                        console.log(`    Muestra: ${sample.accion} - ${sample.meta}`);
                    } else if (sample.motivo) {
                        console.log(`    Muestra: ${sample.motivo} - ${sample.estado}`);
                    } else if (sample.tipo_comunicacion) {
                        console.log(`    Muestra: ${sample.tipo_comunicacion} - ${sample.asunto}`);
                    }
                }
            } else {
                console.log(`  ❌ ${endpoint.name}: Sin datos`);
            }
            console.log('');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAllTabsFinal();
