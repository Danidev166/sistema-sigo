const { obtenerUsuarioPorId } = require('./models/usuarioModel');

async function testWithUserVerification() {
    try {
        console.log('🔍 Verificando usuario en base de datos...\n');
        
        // Verificar usuario ID 3
        const usuario = await obtenerUsuarioPorId('3');
        console.log('📊 Usuario encontrado:', usuario);
        
        if (!usuario) {
            console.log('❌ Usuario no encontrado');
            return;
        }
        
        if (!usuario.estado) {
            console.log('❌ Usuario inactivo');
            return;
        }
        
        console.log('✅ Usuario activo, procediendo con login...\n');
        
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
        console.log(`📊 Data length: ${Array.isArray(conductaData) ? conductaData.length : 'N/A'}`);
        console.log(`📊 Data:`, JSON.stringify(conductaData, null, 2));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testWithUserVerification();
