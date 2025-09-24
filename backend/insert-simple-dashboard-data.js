const { Pool } = require('pg');

// Configuración de PostgreSQL para Render
const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

async function insertSimpleDashboardData() {
  const pool = new Pool(renderConfig);
  
  try {
    console.log('🔍 Insertando datos simples para el dashboard...\n');
    
    // 1. Actualizar estado de estudiantes a 'Activo'
    console.log('1. Actualizando estudiantes a estado Activo...');
    await pool.query(`
      UPDATE estudiantes 
      SET estado = 'Activo' 
      WHERE estado IS NULL OR estado = ''
    `);
    console.log('✅ Estudiantes actualizados a estado Activo');
    
    // 2. Insertar algunos datos de asistencia del mes actual
    console.log('2. Insertando datos de asistencia...');
    const estudiantes = await pool.query('SELECT id FROM estudiantes LIMIT 3');
    
    for (const estudiante of estudiantes.rows) {
      await pool.query(`
        INSERT INTO asistencia (id_estudiante, fecha, tipo, observaciones)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [
        estudiante.id,
        new Date(),
        'Presente',
        'Asistencia registrada'
      ]);
    }
    console.log('✅ Datos de asistencia insertados');
    
    // 3. Insertar algunos datos de entrevistas del mes actual
    console.log('3. Insertando datos de entrevistas...');
    for (const estudiante of estudiantes.rows) {
      await pool.query(`
        INSERT INTO entrevistas (id_estudiante, fecha_entrevista, tipo_entrevista, motivo, observaciones, profesional_id, estado, id_orientador)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT DO NOTHING
      `, [
        estudiante.id,
        new Date(),
        'Individual',
        'Rendimiento académico',
        'Entrevista realizada',
        1,
        'Completada',
        1
      ]);
    }
    console.log('✅ Datos de entrevistas insertados');
    
    // 4. Insertar algunos datos de intervenciones del mes actual
    console.log('4. Insertando datos de intervenciones...');
    for (const estudiante of estudiantes.rows) {
      await pool.query(`
        INSERT INTO intervenciones (id_estudiante, fecha_intervencion, tipo_intervencion, descripcion, responsable_id, estado)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, [
        estudiante.id,
        new Date(),
        'Apoyo académico',
        'Intervención realizada',
        1,
        'En progreso'
      ]);
    }
    console.log('✅ Datos de intervenciones insertados');
    
    // 5. Verificar los datos insertados
    console.log('\n📊 Verificando datos del dashboard...');
    
    const estudiantesCount = await pool.query('SELECT COUNT(*) FROM estudiantes');
    const estudiantesActivosCount = await pool.query("SELECT COUNT(*) FROM estudiantes WHERE estado = 'Activo'");
    const entrevistasCount = await pool.query('SELECT COUNT(*) FROM entrevistas');
    const entrevistasMesCount = await pool.query(`
      SELECT COUNT(*) FROM entrevistas 
      WHERE EXTRACT(MONTH FROM fecha_entrevista) = EXTRACT(MONTH FROM CURRENT_DATE)
    `);
    const intervencionesCount = await pool.query('SELECT COUNT(*) FROM intervenciones');
    const intervencionesMesCount = await pool.query(`
      SELECT COUNT(*) FROM intervenciones 
      WHERE EXTRACT(MONTH FROM fecha_intervencion) = EXTRACT(MONTH FROM CURRENT_DATE)
    `);
    const recursosCount = await pool.query('SELECT COUNT(*) FROM recursos');
    const asistenciaData = await pool.query(`
      SELECT 
        COUNT(CASE WHEN tipo = 'Presente' THEN 1 END) as presentes,
        COUNT(*) as total
      FROM asistencia 
      WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
    `);
    
    const totalAsistencia = parseInt(asistenciaData.rows[0].total) || 0;
    const presentesAsistencia = parseInt(asistenciaData.rows[0].presentes) || 0;
    const promedioAsistencia = totalAsistencia > 0 ? Math.round((presentesAsistencia / totalAsistencia) * 100) : 0;
    
    console.log(`   - Total Estudiantes: ${estudiantesCount.rows[0].count}`);
    console.log(`   - Estudiantes Activos: ${estudiantesActivosCount.rows[0].count}`);
    console.log(`   - Total Entrevistas: ${entrevistasCount.rows[0].count}`);
    console.log(`   - Entrevistas del Mes: ${entrevistasMesCount.rows[0].count}`);
    console.log(`   - Total Intervenciones: ${intervencionesCount.rows[0].count}`);
    console.log(`   - Intervenciones del Mes: ${intervencionesMesCount.rows[0].count}`);
    console.log(`   - Total Recursos: ${recursosCount.rows[0].count}`);
    console.log(`   - Promedio Asistencia: ${promedioAsistencia}%`);
    
    console.log('\n✅ Datos del dashboard insertados correctamente');
    
  } catch (error) {
    console.error('❌ Error insertando datos:', error.message);
  } finally {
    await pool.end();
  }
}

insertSimpleDashboardData();
