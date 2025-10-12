async function testFrontendDataFlow() {
    try {
        console.log('🧪 Probando flujo de datos para el frontend...\n');
        
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
        
        // 1. Probar seguimiento académico (lo que usa la tabla)
        console.log('1️⃣ Seguimiento Académico (para tabla):');
        const seguimientoResponse = await fetch(`http://localhost:3001/api/seguimiento-academico/estudiante/${estudianteId}?anio=${anio}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`   Status: ${seguimientoResponse.status}`);
        const seguimientoData = await seguimientoResponse.json();
        console.log(`   Datos recibidos:`, JSON.stringify(seguimientoData, null, 2));
        
        // Verificar estructura de datos para la tabla
        if (Array.isArray(seguimientoData) && seguimientoData.length > 0) {
            console.log('\n   📊 Análisis de datos para la tabla:');
            seguimientoData.forEach((item, index) => {
                console.log(`   Registro ${index + 1}:`);
                console.log(`     - asignatura: "${item.asignatura}" (${typeof item.asignatura})`);
                console.log(`     - nota: "${item.nota}" (${typeof item.nota})`);
                console.log(`     - promedio_curso: "${item.promedio_curso}" (${typeof item.promedio_curso})`);
                console.log(`     - fecha: "${item.fecha}" (${typeof item.fecha})`);
            });
        }
        
        // 2. Probar estadísticas (lo que usan las tarjetas)
        console.log('\n2️⃣ Estadísticas de Seguimiento (para tarjetas):');
        const statsSeguimientoResponse = await fetch(`http://localhost:3001/api/seguimiento-academico/estadisticas/${estudianteId}?anio=${anio}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`   Status: ${statsSeguimientoResponse.status}`);
        const statsSeguimientoData = await statsSeguimientoResponse.json();
        console.log(`   Datos recibidos:`, JSON.stringify(statsSeguimientoData, null, 2));
        
        // 3. Probar estadísticas de asistencia
        console.log('\n3️⃣ Estadísticas de Asistencia (para tarjetas):');
        const statsAsistenciaResponse = await fetch(`http://localhost:3001/api/asistencia/estadisticas/${estudianteId}?anio=${anio}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`   Status: ${statsAsistenciaResponse.status}`);
        const statsAsistenciaData = await statsAsistenciaResponse.json();
        console.log(`   Datos recibidos:`, JSON.stringify(statsAsistenciaData, null, 2));
        
        console.log('\n✅ Prueba completada');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testFrontendDataFlow();
