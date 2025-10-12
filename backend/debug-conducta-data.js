const { query } = require('./config/db');

async function debugConductaData() {
    try {
        console.log('🔍 Investigando datos de conducta...\n');
        
        // Verificar datos directos en la tabla
        const directQuery = `SELECT * FROM conducta WHERE id_estudiante = 8 LIMIT 5`;
        const directData = await query(directQuery);
        console.log('📊 Datos directos en tabla conducta:');
        console.log(`  Registros encontrados: ${directData.recordset.length}`);
        if (directData.recordset.length > 0) {
            console.log('  Muestra:', JSON.stringify(directData.recordset[0], null, 2));
        }
        
        // Verificar estructura de la tabla
        const structureQuery = `
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'conducta' 
            ORDER BY ordinal_position
        `;
        const structure = await query(structureQuery);
        console.log('\n📋 Estructura de tabla conducta:');
        structure.recordset.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type}`);
        });
        
        // Verificar todos los registros de conducta
        const allQuery = `SELECT * FROM conducta LIMIT 10`;
        const allData = await query(allQuery);
        console.log(`\n📊 Todos los registros de conducta (${allData.recordset.length}):`);
        allData.recordset.forEach((record, index) => {
            console.log(`  ${index + 1}. ID: ${record.id}, Estudiante: ${record.id_estudiante}, Fecha: ${record.fecha}, Categoría: ${record.categoria}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

debugConductaData();
