const { getPool } = require('./config/db');

async function checkTableStructures() {
    try {
        console.log('🔍 Verificando estructura de tablas académicas...\n');
        
        const pool = await getPool();
        
        // 1. Seguimiento Académico
        console.log('1️⃣ Seguimiento Académico:');
        const seguimientoColumns = await pool.raw.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'seguimiento_academico' 
            ORDER BY ordinal_position
        `);
        console.log('   Columnas:');
        seguimientoColumns.rows.forEach(col => {
            console.log(`     - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
        
        // 2. Historial Académico
        console.log('\n2️⃣ Historial Académico:');
        const historialColumns = await pool.raw.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'historial_academico' 
            ORDER BY ordinal_position
        `);
        console.log('   Columnas:');
        historialColumns.rows.forEach(col => {
            console.log(`     - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
        
        // 3. Asistencia
        console.log('\n3️⃣ Asistencia:');
        const asistenciaColumns = await pool.raw.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'asistencia' 
            ORDER BY ordinal_position
        `);
        console.log('   Columnas:');
        asistenciaColumns.rows.forEach(col => {
            console.log(`     - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
        
        // 4. Verificar datos existentes
        console.log('\n4️⃣ Datos Existentes:');
        
        // Seguimiento académico
        const seguimientoData = await pool.raw.query('SELECT COUNT(*) FROM seguimiento_academico');
        console.log(`   Seguimiento Académico: ${seguimientoData.rows[0].count} registros`);
        
        // Historial académico
        const historialData = await pool.raw.query('SELECT COUNT(*) FROM historial_academico');
        console.log(`   Historial Académico: ${historialData.rows[0].count} registros`);
        
        // Asistencia
        const asistenciaData = await pool.raw.query('SELECT COUNT(*) FROM asistencia');
        console.log(`   Asistencia: ${asistenciaData.rows[0].count} registros`);
        
        // 5. Verificar datos de ejemplo
        console.log('\n5️⃣ Datos de Ejemplo:');
        
        // Seguimiento académico
        const seguimientoSample = await pool.raw.query('SELECT * FROM seguimiento_academico LIMIT 1');
        if (seguimientoSample.rows.length > 0) {
            console.log('   Seguimiento Académico - Ejemplo:', seguimientoSample.rows[0]);
        } else {
            console.log('   Seguimiento Académico: Sin datos');
        }
        
        // Historial académico
        const historialSample = await pool.raw.query('SELECT * FROM historial_academico LIMIT 1');
        if (historialSample.rows.length > 0) {
            console.log('   Historial Académico - Ejemplo:', historialSample.rows[0]);
        } else {
            console.log('   Historial Académico: Sin datos');
        }
        
        // Asistencia
        const asistenciaSample = await pool.raw.query('SELECT * FROM asistencia LIMIT 1');
        if (asistenciaSample.rows.length > 0) {
            console.log('   Asistencia - Ejemplo:', asistenciaSample.rows[0]);
        } else {
            console.log('   Asistencia: Sin datos');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkTableStructures();
