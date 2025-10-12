const { getPool } = require('./config/db');

async function debugReportesQuery() {
    try {
        console.log('🔍 Debugging consulta de reportes...\n');
        
        const pool = await getPool();
        
        // Verificar si el estudiante existe
        console.log('📋 Verificando estudiante ID 8...');
        const estudianteQuery = 'SELECT id, nombre, apellido FROM estudiantes WHERE id = $1';
        const estudianteResult = await pool.raw.query(estudianteQuery, ['8']);
        console.log('  Estudiante encontrado:', estudianteResult.rows.length > 0);
        if (estudianteResult.rows.length > 0) {
            console.log('  Datos:', estudianteResult.rows[0]);
        }
        
        // Verificar asistencia
        console.log('\n📋 Verificando asistencia...');
        const asistenciaQuery = 'SELECT COUNT(*) FROM asistencia WHERE id_estudiante = $1';
        const asistenciaResult = await pool.raw.query(asistenciaQuery, ['8']);
        console.log('  Asistencias:', asistenciaResult.rows[0].count);
        
        // Verificar historial académico
        console.log('\n📋 Verificando historial académico...');
        const historialQuery = 'SELECT COUNT(*) FROM historial_academico WHERE id_estudiante = $1';
        const historialResult = await pool.raw.query(historialQuery, ['8']);
        console.log('  Historial académico:', historialResult.rows[0].count);
        
        // Verificar entrega recursos
        console.log('\n📋 Verificando entrega recursos...');
        const recursosQuery = 'SELECT COUNT(*) FROM entrega_recurso WHERE id_estudiante = $1';
        const recursosResult = await pool.raw.query(recursosQuery, ['8']);
        console.log('  Recursos entregados:', recursosResult.rows[0].count);
        
        // Probar la consulta completa del reporte
        console.log('\n📋 Probando consulta completa del reporte...');
        const reporteQuery = `
            SELECT e.nombre, e.apellido,
                   COUNT(a.id)::int AS total_asistencias,
                   ROUND(AVG(h.promedio_general)::numeric, 2) AS promedio,
                   COUNT(er.id)::int AS entregas
            FROM estudiantes e
            LEFT JOIN asistencia a          ON e.id = a.id_estudiante
            LEFT JOIN historial_academico h ON e.id = h.id_estudiante
            LEFT JOIN entrega_recurso er   ON e.id = er.id_estudiante
            WHERE e.id = $1
            GROUP BY e.nombre, e.apellido
        `;
        
        const reporteResult = await pool.raw.query(reporteQuery, ['8']);
        console.log('  Resultado del reporte:', reporteResult.rows.length);
        if (reporteResult.rows.length > 0) {
            console.log('  Datos del reporte:', reporteResult.rows[0]);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

debugReportesQuery();
