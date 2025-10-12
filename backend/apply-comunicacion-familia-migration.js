const { query } = require('./config/db');

async function applyComunicacionFamiliaMigration() {
    try {
        console.log('🔧 Aplicando migración de comunicacion_familia...\n');
        
        // Leer el archivo SQL
        const fs = require('fs');
        const sqlContent = fs.readFileSync('./migrations/create_comunicacion_familia.sql', 'utf8');
        
        // Dividir en statements individuales
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        console.log(`📋 Ejecutando ${statements.length} statements...\n`);
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    console.log(`  ${i + 1}. Ejecutando: ${statement.substring(0, 50)}...`);
                    await query(statement);
                    console.log(`     ✅ Exitoso`);
                } catch (error) {
                    if (error.message.includes('already exists') || error.message.includes('ya existe')) {
                        console.log(`     ⚠️  Ya existe (ignorando)`);
                    } else {
                        console.log(`     ❌ Error: ${error.message}`);
                    }
                }
            }
        }
        
        // Verificar que la tabla se creó correctamente
        console.log('\n🔍 Verificando tabla creada...');
        const verifyQuery = `
            SELECT 
                column_name,
                data_type,
                is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'comunicacion_familia'
            ORDER BY ordinal_position;
        `;
        
        const structure = await query(verifyQuery);
        console.log('\n📋 Estructura de la tabla:');
        structure.recordset.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
        
        // Contar registros
        const countQuery = `SELECT COUNT(*) as total FROM comunicacion_familia`;
        const count = await query(countQuery);
        console.log(`\n📊 Total de registros: ${count.recordset[0].total}`);
        
        console.log('\n✅ Migración completada exitosamente');
        
    } catch (error) {
        console.error('❌ Error en la migración:', error.message);
        console.error('Detalles:', error);
    }
}

applyComunicacionFamiliaMigration();
