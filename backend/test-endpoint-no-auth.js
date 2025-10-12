async function testEndpointNoAuth() {
    try {
        console.log('🔍 Probando endpoint sin autenticación...\n');
        
        // Probar endpoint sin token
        const response = await fetch('http://localhost:3001/api/conducta/estudiante/8', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`📊 Status: ${response.status}`);
        const data = await response.json();
        console.log(`📊 Data:`, JSON.stringify(data, null, 2));
        
        // Probar con token malformado
        console.log('\n🔍 Probando con token malformado...');
        const response2 = await fetch('http://localhost:3001/api/conducta/estudiante/8', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer token-invalido'
            }
        });
        
        console.log(`📊 Status: ${response2.status}`);
        const data2 = await response2.json();
        console.log(`📊 Data:`, JSON.stringify(data2, null, 2));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testEndpointNoAuth();
