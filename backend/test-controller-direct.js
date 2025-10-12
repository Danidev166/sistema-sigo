const model = require('./models/conductaModel');

async function testControllerDirect() {
    try {
        console.log('🔍 Probando controlador de conducta directamente...\n');
        
        // Simular request y response
        const mockReq = {
            params: { id: '8' },
            user: { id: 3, rol: 'Admin' }
        };
        
        const mockRes = {
            json: (data) => {
                console.log('📊 Response data:', JSON.stringify(data, null, 2));
                console.log(`📊 Data type: ${Array.isArray(data) ? 'Array' : typeof data}`);
                console.log(`📊 Data length: ${Array.isArray(data) ? data.length : 'N/A'}`);
            },
            status: (code) => {
                console.log(`📊 Status code: ${code}`);
                return { json: mockRes.json };
            }
        };
        
        // Probar el modelo directamente
        console.log('📋 Probando modelo...');
        const modelData = await model.obtenerPorEstudiante('8');
        console.log(`✅ Modelo devuelve: ${modelData.length} registros`);
        console.log('📄 Muestra del modelo:', JSON.stringify(modelData[0], null, 2));
        
        // Probar el controlador
        console.log('\n📋 Probando controlador...');
        const controller = require('./controller/conductaController');
        await controller.obtenerPorEstudiante(mockReq, mockRes);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Detalles:', error);
    }
}

testControllerDirect();
