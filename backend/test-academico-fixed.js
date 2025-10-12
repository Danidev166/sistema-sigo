async function testAcademicoFixed() {
    try {
        console.log('🧪 Probando endpoints académicos corregidos...\n');
        
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
        
        // Probar con estudiante ID 17 (que tiene datos)
        const estudianteId = 17;
        const anio = 2025;
        
        console.log(`📋 Probando con estudiante ID ${estudianteId}, año ${anio}\n`);
        
        // 1. Probar seguimiento académico
        console.log('1️⃣ Seguimiento Académico:');
        const seguimientoResponse = await fetch(`http://localhost:3001/api/seguimiento-academico/estudiante/${estudianteId}?anio=${anio}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`   Status: ${seguimientoResponse.status}`);
        const seguimientoData = await seguimientoResponse.json();
        console.log(`   Datos:`, JSON.stringify(seguimientoData, null, 2));
        
        // 2. Probar historial académico
        console.log('\n2️⃣ Historial Académico:');
        const historialResponse = await fetch(`http://localhost:3001/api/historial-academico/estudiante/${estudianteId}?anio=${anio}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`   Status: ${historialResponse.status}`);
        const historialData = await historialResponse.json();
        console.log(`   Datos:`, JSON.stringify(historialData, null, 2));
        
        // 3. Probar asistencia
        console.log('\n3️⃣ Asistencia:');
        const asistenciaResponse = await fetch(`http://localhost:3001/api/asistencia/estudiante/${estudianteId}?anio=${anio}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`   Status: ${asistenciaResponse.status}`);
        const asistenciaData = await asistenciaResponse.json();
        console.log(`   Datos:`, JSON.stringify(asistenciaData, null, 2));
        
        // 4. Probar estadísticas de seguimiento
        console.log('\n4️⃣ Estadísticas de Seguimiento:');
        const statsSeguimientoResponse = await fetch(`http://localhost:3001/api/seguimiento-academico/estadisticas/${estudianteId}?anio=${anio}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`   Status: ${statsSeguimientoResponse.status}`);
        const statsSeguimientoData = await statsSeguimientoResponse.json();
        console.log(`   Datos:`, JSON.stringify(statsSeguimientoData, null, 2));
        
        // 5. Probar estadísticas de asistencia
        console.log('\n5️⃣ Estadísticas de Asistencia:');
        const statsAsistenciaResponse = await fetch(`http://localhost:3001/api/asistencia/estadisticas/${estudianteId}?anio=${anio}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`   Status: ${statsAsistenciaResponse.status}`);
        const statsAsistenciaData = await statsAsistenciaResponse.json();
        console.log(`   Datos:`, JSON.stringify(statsAsistenciaData, null, 2));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAcademicoFixed();
