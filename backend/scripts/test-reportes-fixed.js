// Script para probar los reportes corregidos
const { getPool } = require('../config/db');

async function testReportesCorregidos() {
  try {
    console.log('🧪 Probando reportes corregidos...\n');
    const pool = await getPool();
    
    // 1. Probar consulta de estudiantes con asistencia real
    console.log('1️⃣ Probando consulta de estudiantes con asistencia real...');
    const estudiantesQuery = `
      SELECT 
        e.id,
        e.nombre,
        e.apellido,
        e.curso,
        e.estado,
        -- Calcular asistencia real desde la tabla asistencia
        COALESCE(
          (SELECT ROUND(
            (COUNT(CASE WHEN a.tipo = 'Presente' THEN 1 END)::float / 
             NULLIF(COUNT(*), 0)) * 100, 2
          ) FROM asistencia a 
          WHERE a.id_estudiante = e.id 
          AND EXTRACT(YEAR FROM a.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
          ), 0
        ) as asistencia_porcentaje
      FROM estudiantes e
      LIMIT 5
    `;
    
    const estudiantesResult = await pool.request().query(estudiantesQuery);
    console.log(`✅ Estudiantes encontrados: ${estudiantesResult.recordset.length}`);
    estudiantesResult.recordset.forEach(est => {
      console.log(`   - ${est.nombre} ${est.apellido} (${est.curso}): ${est.asistencia_porcentaje}% asistencia`);
    });
    
    // 2. Probar consulta de asistencia mensual
    console.log('\n2️⃣ Probando consulta de asistencia mensual...');
    const asistenciaQuery = `
      SELECT 
        EXTRACT(MONTH FROM fecha) as mes,
        COUNT(*) as total_registros,
        COUNT(CASE WHEN tipo = 'Presente' THEN 1 END) as presentes,
        COUNT(CASE WHEN tipo IN ('Ausente', 'Justificada') THEN 1 END) as ausentes
      FROM asistencia
      WHERE EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY EXTRACT(MONTH FROM fecha)
      ORDER BY mes
    `;
    
    const asistenciaResult = await pool.request().query(asistenciaQuery);
    console.log(`✅ Meses con datos de asistencia: ${asistenciaResult.recordset.length}`);
    asistenciaResult.recordset.forEach(mes => {
      console.log(`   - Mes ${mes.mes}: ${mes.presentes} presentes, ${mes.ausentes} ausentes`);
    });
    
    // 3. Probar conteos básicos
    console.log('\n3️⃣ Probando conteos básicos...');
    const conteos = {
      estudiantes: await pool.request().query('SELECT COUNT(*) as total FROM estudiantes'),
      entrevistas: await pool.request().query('SELECT COUNT(*) as total FROM entrevistas'),
      intervenciones: await pool.request().query('SELECT COUNT(*) as total FROM intervenciones'),
      entrega_recursos: await pool.request().query('SELECT COUNT(*) as total FROM entrega_recursos'),
      asistencia: await pool.request().query('SELECT COUNT(*) as total FROM asistencia')
    };
    
    console.log('📊 Conteos de la base de datos:');
    Object.entries(conteos).forEach(([tabla, result]) => {
      console.log(`   - ${tabla}: ${result.recordset[0].total} registros`);
    });
    
    // 4. Probar si hay datos de asistencia
    console.log('\n4️⃣ Verificando datos de asistencia...');
    const asistenciaData = await pool.request().query(`
      SELECT 
        a.id_estudiante,
        e.nombre,
        e.apellido,
        a.fecha,
        a.tipo
      FROM asistencia a
      INNER JOIN estudiantes e ON a.id_estudiante = e.id
      ORDER BY a.fecha DESC
      LIMIT 10
    `);
    
    if (asistenciaData.recordset.length > 0) {
      console.log(`✅ Datos de asistencia encontrados: ${asistenciaData.recordset.length} registros`);
      asistenciaData.recordset.forEach(reg => {
        console.log(`   - ${reg.nombre} ${reg.apellido}: ${reg.tipo} el ${reg.fecha}`);
      });
    } else {
      console.log('⚠️ No hay datos de asistencia en la base de datos');
      console.log('   Esto explicaría por qué los porcentajes de asistencia son 0%');
    }
    
    console.log('\n🎉 Pruebas completadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testReportesCorregidos();
