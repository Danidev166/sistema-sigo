const { getPool, query } = require('./config/db');

async function checkComunicacionFamilia() {
    try {
        console.log('🔍 Verificando tabla comunicacion_familia...');
        
        // Verificar si la tabla existe
        const tableExistsQuery = `
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'comunicacion_familia'
            );
        `;
        
        const tableExists = await query(tableExistsQuery);
        console.log('📊 Tabla existe:', tableExists.recordset[0].exists);
        
        if (tableExists.recordset[0].exists) {
            // Obtener estructura de la tabla
            const structureQuery = `
                SELECT 
                    column_name,
                    data_type,
                    is_nullable,
                    column_default
                FROM information_schema.columns 
                WHERE table_name = 'comunicacion_familia'
                ORDER BY ordinal_position;
            `;
            
            const structure = await query(structureQuery);
            console.log('\n📋 Estructura de la tabla:');
            structure.recordset.forEach(col => {
                console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
            });
            
            // Contar registros
            const countQuery = `SELECT COUNT(*) as total FROM comunicacion_familia`;
            const count = await query(countQuery);
            console.log(`\n📊 Total de registros: ${count.recordset[0].total}`);
            
            // Mostrar algunos registros de ejemplo
            const sampleQuery = `SELECT * FROM comunicacion_familia ORDER BY creado_en DESC LIMIT 3`;
            const sample = await query(sampleQuery);
            console.log('\n📄 Registros de ejemplo:');
            console.log(JSON.stringify(sample.recordset, null, 2));
            
        } else {
            console.log('❌ La tabla no existe en la base de datos');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Detalles:', error);
    }
}

checkComunicacionFamilia();
