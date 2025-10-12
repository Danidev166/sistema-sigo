const { getPool } = require('./config/db');

async function testAcademicoEndpoints() {
    try {
        console.log('🧪 Probando endpoints académicos...\n');
        
        const pool = await getPool();
        
        // Probar con estudiante ID 11 (que existe)
        const estudianteId = 11;
        const anio = 2025;
        
        console.log(`📋 Probando con estudiante ID ${estudianteId}, año ${anio}\n`);
        
        // 1. Verificar seguimiento académico
        console.log('1️⃣ Seguimiento Académico:');
        const seguimientoQuery = `
            SELECT sa.*, e.nombre, e.apellido 
            FROM seguimiento_academico sa
            JOIN estudiantes e ON sa.id_estudiante = e.id
            WHERE sa.id_estudiante = $1 AND sa.anio = $2
            ORDER BY sa.fecha DESC
        `;
        const seguimientoResult = await pool.raw.query(seguimientoQuery, [estudianteId, anio]);
        console.log(`   Registros encontrados: ${seguimientoResult.rows.length}`);
        if (seguimientoResult.rows.length > 0) {
            console.log('   Datos:', seguimientoResult.rows[0]);
        }
        
        // 2. Verificar historial académico
        console.log('\n2️⃣ Historial Académico:');
        const historialQuery = `
            SELECT ha.*, e.nombre, e.apellido 
            FROM historial_academico ha
            JOIN estudiantes e ON ha.id_estudiante = e.id
            WHERE ha.id_estudiante = $1 AND ha.anio = $2
            ORDER BY ha.fecha_actualizacion DESC
        `;
        const historialResult = await pool.raw.query(historialQuery, [estudianteId, anio]);
        console.log(`   Registros encontrados: ${historialResult.rows.length}`);
        if (historialResult.rows.length > 0) {
            console.log('   Datos:', historialResult.rows[0]);
        }
        
        // 3. Verificar asistencia
        console.log('\n3️⃣ Asistencia:');
        const asistenciaQuery = `
            SELECT a.*, e.nombre, e.apellido 
            FROM asistencia a
            JOIN estudiantes e ON a.id_estudiante = e.id
            WHERE a.id_estudiante = $1 AND EXTRACT(YEAR FROM a.fecha) = $2
            ORDER BY a.fecha DESC
        `;
        const asistenciaResult = await pool.raw.query(asistenciaQuery, [estudianteId, anio]);
        console.log(`   Registros encontrados: ${asistenciaResult.rows.length}`);
        if (asistenciaResult.rows.length > 0) {
            console.log('   Datos:', asistenciaResult.rows[0]);
        }
        
        // 4. Verificar estadísticas de seguimiento
        console.log('\n4️⃣ Estadísticas de Seguimiento:');
        const statsSeguimientoQuery = `
            SELECT 
                COUNT(*) as total_notas,
                COUNT(DISTINCT asignatura) as asignaturas_unicas,
                ROUND(AVG(nota)::numeric, 2) as promedio_general,
                ROUND(AVG(promedio_curso)::numeric, 2) as promedio_curso,
                CASE 
                    WHEN COUNT(*) > 1 THEN
                        CASE 
                            WHEN AVG(nota) > LAG(AVG(nota)) OVER (ORDER BY fecha) THEN 'mejorando'
                            WHEN AVG(nota) < LAG(AVG(nota)) OVER (ORDER BY fecha) THEN 'empeorando'
                            ELSE 'estable'
                        END
                    ELSE 'sin_datos'
                END as tendencia
            FROM seguimiento_academico 
            WHERE id_estudiante = $1 AND anio = $2
        `;
        const statsSeguimientoResult = await pool.raw.query(statsSeguimientoQuery, [estudianteId, anio]);
        console.log(`   Estadísticas:`, statsSeguimientoResult.rows[0]);
        
        // 5. Verificar estadísticas de asistencia
        console.log('\n5️⃣ Estadísticas de Asistencia:');
        const statsAsistenciaQuery = `
            SELECT 
                COUNT(*) as total_registros,
                COUNT(CASE WHEN tipo = 'Presente' THEN 1 END) as presentes,
                COUNT(CASE WHEN tipo = 'Ausente' THEN 1 END) as ausentes,
                COUNT(CASE WHEN tipo = 'Justificada' THEN 1 END) as justificadas,
                ROUND(
                    (COUNT(CASE WHEN tipo = 'Presente' OR tipo = 'Justificada' THEN 1 END)::numeric / COUNT(*)) * 100, 
                    2
                ) as porcentaje_asistencia
            FROM asistencia 
            WHERE id_estudiante = $1 AND EXTRACT(YEAR FROM fecha) = $2
        `;
        const statsAsistenciaResult = await pool.raw.query(statsAsistenciaQuery, [estudianteId, anio]);
        console.log(`   Estadísticas:`, statsAsistenciaResult.rows[0]);
        
        // 6. Verificar estructura de tablas
        console.log('\n6️⃣ Estructura de Tablas:');
        
        // Seguimiento académico
        const seguimientoColumns = await pool.raw.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'seguimiento_academico' 
            ORDER BY ordinal_position
        `);
        console.log('   Seguimiento Académico - Columnas:', seguimientoColumns.rows.map(c => c.column_name));
        
        // Historial académico
        const historialColumns = await pool.raw.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'historial_academico' 
            ORDER BY ordinal_position
        `);
        console.log('   Historial Académico - Columnas:', historialColumns.rows.map(c => c.column_name));
        
        // Asistencia
        const asistenciaColumns = await pool.raw.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'asistencia' 
            ORDER BY ordinal_position
        `);
        console.log('   Asistencia - Columnas:', asistenciaColumns.rows.map(c => c.column_name));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAcademicoEndpoints();
