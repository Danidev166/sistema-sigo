const { getPool } = require('./config/db');

async function testConductaModelDirect() {
    try {
        console.log('🔍 Probando modelo de conducta directamente...\n');
        
        const pool = await getPool();
        
        // Probar la consulta directamente
        const query = `
            SELECT c.*, e.nombre, e.apellido, e.rut
            FROM conducta c
            LEFT JOIN estudiantes e ON c.id_estudiante = e.id
            WHERE c.id_estudiante = $1
            ORDER BY c.fecha DESC, c.id DESC
        `;
        
        console.log('📋 Ejecutando consulta directa...');
        const result = await pool.raw.query(query, [8]);
        console.log(`✅ Resultado: ${result.rows.length} registros encontrados`);
        
        if (result.rows.length > 0) {
            console.log('📄 Muestra:');
            console.log(JSON.stringify(result.rows[0], null, 2));
        }
        
        // Probar el modelo
        console.log('\n📋 Probando modelo...');
        const model = require('./models/conductaModel');
        const modelResult = await model.obtenerPorEstudiante(8);
        console.log(`✅ Modelo: ${modelResult.length} registros encontrados`);
        
        if (modelResult.length > 0) {
            console.log('📄 Muestra del modelo:');
            console.log(JSON.stringify(modelResult[0], null, 2));
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Detalles:', error);
    }
}

testConductaModelDirect();
