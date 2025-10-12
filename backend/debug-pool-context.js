const { getPool } = require('./config/db');

async function debugPoolContext() {
    try {
        console.log('🔍 Debugging pool context...\n');
        
        // Simular lo que hace el servidor
        console.log('📋 Obteniendo pool...');
        const pool = await getPool();
        console.log('✅ Pool obtenido:', typeof pool);
        console.log('📊 Pool.raw:', typeof pool.raw);
        
        // Probar consulta directa
        console.log('\n📋 Probando consulta directa...');
        const query = `
            SELECT c.*, e.nombre, e.apellido, e.rut
            FROM conducta c
            LEFT JOIN estudiantes e ON c.id_estudiante = e.id
            WHERE c.id_estudiante = $1
            ORDER BY c.fecha DESC, c.id DESC
        `;
        
        const result = await pool.raw.query(query, ['8']);
        console.log(`✅ Resultado directo: ${result.rows.length} registros`);
        if (result.rows.length > 0) {
            console.log('📄 Muestra:', JSON.stringify(result.rows[0], null, 2));
        }
        
        // Probar el modelo
        console.log('\n📋 Probando modelo...');
        const model = require('./models/conductaModel');
        const modelResult = await model.obtenerPorEstudiante('8');
        console.log(`✅ Modelo: ${modelResult.length} registros`);
        if (modelResult.length > 0) {
            console.log('📄 Muestra del modelo:', JSON.stringify(modelResult[0], null, 2));
        }
        
        // Verificar si hay diferencia entre string y number
        console.log('\n📋 Probando con ID como número...');
        const modelResultNum = await model.obtenerPorEstudiante(8);
        console.log(`✅ Modelo con número: ${modelResultNum.length} registros`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Detalles:', error);
    }
}

debugPoolContext();
