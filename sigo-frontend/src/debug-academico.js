// Script de debug para el tab Académico
console.log('🔍 Debug del tab Académico iniciado...');

// Función para probar los endpoints directamente
async function testAcademicoEndpoints() {
    try {
        console.log('🧪 Probando endpoints desde el frontend...');
        
        // Obtener token del localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('❌ No hay token en localStorage');
            return;
        }
        
        console.log('✅ Token encontrado:', token.substring(0, 20) + '...');
        
        // Probar con estudiante ID 17 (que tiene datos)
        const estudianteId = 17;
        const anio = 2025;
        
        console.log(`📋 Probando con estudiante ID ${estudianteId}, año ${anio}`);
        
        // 1. Probar seguimiento académico
        console.log('\n1️⃣ Seguimiento Académico:');
        const baseURL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://sigo-backend.onrender.com';
        const seguimientoResponse = await fetch(`${baseURL}/api/seguimiento-academico/estudiante/${estudianteId}?anio=${anio}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`   Status: ${seguimientoResponse.status}`);
        const seguimientoData = await seguimientoResponse.json();
        console.log(`   Datos recibidos:`, seguimientoData);
        
        // 2. Probar estadísticas de seguimiento
        console.log('\n2️⃣ Estadísticas de Seguimiento:');
        const statsSeguimientoResponse = await fetch(`${baseURL}/api/seguimiento-academico/estadisticas/${estudianteId}?anio=${anio}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`   Status: ${statsSeguimientoResponse.status}`);
        const statsSeguimientoData = await statsSeguimientoResponse.json();
        console.log(`   Datos recibidos:`, statsSeguimientoData);
        
        // 3. Probar estadísticas de asistencia
        console.log('\n3️⃣ Estadísticas de Asistencia:');
        const statsAsistenciaResponse = await fetch(`${baseURL}/api/asistencia/estadisticas/${estudianteId}?anio=${anio}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`   Status: ${statsAsistenciaResponse.status}`);
        const statsAsistenciaData = await statsAsistenciaResponse.json();
        console.log(`   Datos recibidos:`, statsAsistenciaData);
        
        console.log('\n✅ Prueba completada');
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Ejecutar la prueba
testAcademicoEndpoints();

// Exportar para uso en consola del navegador
window.debugAcademico = testAcademicoEndpoints;
