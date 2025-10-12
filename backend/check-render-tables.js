const { query } = require('./config/db');

async function checkRenderTables() {
    try {
        console.log('🔍 Verificando tablas en la base de datos de Render...\n');
        
        // Obtener todas las tablas
        const tablesQuery = `
            SELECT table_name, table_type
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `;
        
        const tables = await query(tablesQuery);
        console.log('📊 Tablas disponibles:');
        tables.recordset.forEach(table => {
            console.log(`  - ${table.table_name} (${table.table_type})`);
        });
        
        console.log(`\n📈 Total de tablas: ${tables.recordset.length}\n`);
        
        // Verificar tablas específicas de los tabs
        const specificTables = ['conducta', 'intervenciones', 'entrevistas', 'comunicacion_familia'];
        
        for (const tableName of specificTables) {
            try {
                const countQuery = `SELECT COUNT(*) as total FROM ${tableName}`;
                const count = await query(countQuery);
                console.log(`📋 ${tableName}: ${count.recordset[0].total} registros`);
            } catch (error) {
                console.log(`❌ ${tableName}: Error - ${error.message}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error general:', error.message);
    }
}

checkRenderTables();
