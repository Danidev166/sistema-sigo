const { getPool } = require('./config/db');

async function checkEstudiantesRender() {
    try {
        console.log('🔍 Verificando estudiantes en Render...\n');
        
        const pool = await getPool();
        
        // Verificar todos los estudiantes
        console.log('📋 Listando todos los estudiantes...');
        const estudiantesQuery = 'SELECT id, nombre, apellido, curso FROM estudiantes ORDER BY id';
        const estudiantesResult = await pool.raw.query(estudiantesQuery);
        console.log(`  Total estudiantes: ${estudiantesResult.rows.length}`);
        
        if (estudiantesResult.rows.length > 0) {
            console.log('  Estudiantes encontrados:');
            estudiantesResult.rows.forEach(est => {
                console.log(`    ID: ${est.id} - ${est.nombre} ${est.apellido} (${est.curso})`);
            });
        }
        
        // Verificar si hay datos de asistencia
        console.log('\n📋 Verificando datos de asistencia...');
        const asistenciaQuery = 'SELECT COUNT(*) FROM asistencia';
        const asistenciaResult = await pool.raw.query(asistenciaQuery);
        console.log(`  Total asistencias: ${asistenciaResult.rows[0].count}`);
        
        // Verificar si hay datos de historial académico
        console.log('\n📋 Verificando datos de historial académico...');
        const historialQuery = 'SELECT COUNT(*) FROM historial_academico';
        const historialResult = await pool.raw.query(historialQuery);
        console.log(`  Total historial académico: ${historialResult.rows[0].count}`);
        
        // Verificar tablas relacionadas
        console.log('\n📋 Verificando tablas relacionadas...');
        const tablasQuery = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('asistencia', 'historial_academico', 'entrega_recurso', 'entrega_recursos')
            ORDER BY table_name
        `;
        const tablasResult = await pool.raw.query(tablasQuery);
        console.log('  Tablas encontradas:', tablasResult.rows.map(t => t.table_name));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkEstudiantesRender();
