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

async function insertDashboardData() {
  const pool = new Pool(renderConfig);
  
  try {
    console.log('🔍 Insertando datos para el dashboard...\n');
    
    // 1. Actualizar estado de estudiantes a 'Activo'
    console.log('1. Actualizando estudiantes a estado Activo...');
    await pool.query(`
      UPDATE estudiantes 
      SET estado = 'Activo' 
      WHERE estado IS NULL OR estado = ''
    `);
    console.log('✅ Estudiantes actualizados a estado Activo');
    
    // 2. Insertar datos de asistencia del mes actual
    console.log('2. Insertando datos de asistencia...');
    await pool.query(`
      INSERT INTO asistencia (id_estudiante, fecha, tipo, observaciones)
      SELECT 
        e.id,
        CURRENT_DATE - INTERVAL '1 day' * (random() * 30)::int,
        CASE WHEN random() > 0.2 THEN 'Presente' ELSE 'Ausente' END,
        'Asistencia registrada'
      FROM estudiantes e
      WHERE NOT EXISTS (
        SELECT 1 FROM asistencia a 
        WHERE a.id_estudiante = e.id 
        AND EXTRACT(MONTH FROM a.fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
      )
      LIMIT 20
    `);
    console.log('✅ Datos de asistencia insertados');
    
    // 3. Insertar datos de entrevistas del mes actual
    console.log('3. Insertando datos de entrevistas...');
    await pool.query(`
      INSERT INTO entrevistas (id_estudiante, fecha_entrevista, tipo_entrevista, motivo, observaciones, profesional_id, estado, id_orientador)
      SELECT 
        e.id,
        CURRENT_DATE - INTERVAL '1 day' * (random() * 30)::int,
        CASE (random() * 3)::int
          WHEN 0 THEN 'Individual'
          WHEN 1 THEN 'Familiar'
          ELSE 'Grupal'
        END,
        CASE (random() * 4)::int
          WHEN 0 THEN 'Rendimiento académico'
          WHEN 1 THEN 'Problemas de conducta'
          WHEN 2 THEN 'Situación familiar'
          ELSE 'Orientación vocacional'
        END,
        'Entrevista realizada',
        1,
        'Completada',
        1
      FROM estudiantes e
      WHERE NOT EXISTS (
        SELECT 1 FROM entrevistas ent 
        WHERE ent.id_estudiante = e.id 
        AND EXTRACT(MONTH FROM ent.fecha_entrevista) = EXTRACT(MONTH FROM CURRENT_DATE)
      )
      LIMIT 15
    `);
    console.log('✅ Datos de entrevistas insertados');
    
    // 4. Insertar datos de intervenciones del mes actual
    console.log('4. Insertando datos de intervenciones...');
    await pool.query(`
      INSERT INTO intervenciones (id_estudiante, fecha, tipo_intervencion, descripcion, responsable_id)
      SELECT 
        e.id,
        CURRENT_DATE - INTERVAL '1 day' * (random() * 30)::int,
        CASE (random() * 3)::int
          WHEN 0 THEN 'Apoyo académico'
          WHEN 1 THEN 'Apoyo psicosocial'
          ELSE 'Orientación familiar'
        END,
        'Intervención realizada',
        1
      FROM estudiantes e
      WHERE NOT EXISTS (
        SELECT 1 FROM intervenciones i 
        WHERE i.id_estudiante = e.id 
        AND EXTRACT(MONTH FROM i.fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
      )
      LIMIT 10
    `);
    console.log('✅ Datos de intervenciones insertados');
    
    // 5. Verificar los datos insertados
    console.log('\n📊 Verificando datos del dashboard...');
    
    const estudiantes = await pool.query('SELECT COUNT(*) FROM estudiantes');
    const estudiantesActivos = await pool.query("SELECT COUNT(*) FROM estudiantes WHERE estado = 'Activo'");
    const entrevistas = await pool.query('SELECT COUNT(*) FROM entrevistas');
    const entrevistasMes = await pool.query(`
      SELECT COUNT(*) FROM entrevistas 
      WHERE EXTRACT(MONTH FROM fecha_entrevista) = EXTRACT(MONTH FROM CURRENT_DATE)
    `);
    const intervenciones = await pool.query('SELECT COUNT(*) FROM intervenciones');
    const intervencionesMes = await pool.query(`
      SELECT COUNT(*) FROM intervenciones 
      WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
    `);
    const recursos = await pool.query('SELECT COUNT(*) FROM recursos');
    const asistencia = await pool.query(`
      SELECT 
        COUNT(CASE WHEN tipo = 'Presente' THEN 1 END) as presentes,
        COUNT(*) as total
      FROM asistencia 
      WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
    `);
    
    const totalAsistencia = parseInt(asistencia.rows[0].total) || 0;
    const presentesAsistencia = parseInt(asistencia.rows[0].presentes) || 0;
    const promedioAsistencia = totalAsistencia > 0 ? Math.round((presentesAsistencia / totalAsistencia) * 100) : 0;
    
    console.log(`   - Total Estudiantes: ${estudiantes.rows[0].count}`);
    console.log(`   - Estudiantes Activos: ${estudiantesActivos.rows[0].count}`);
    console.log(`   - Total Entrevistas: ${entrevistas.rows[0].count}`);
    console.log(`   - Entrevistas del Mes: ${entrevistasMes.rows[0].count}`);
    console.log(`   - Total Intervenciones: ${intervenciones.rows[0].count}`);
    console.log(`   - Intervenciones del Mes: ${intervencionesMes.rows[0].count}`);
    console.log(`   - Total Recursos: ${recursos.rows[0].count}`);
    console.log(`   - Promedio Asistencia: ${promedioAsistencia}%`);
    
    console.log('\n✅ Datos del dashboard insertados correctamente');
    
  } catch (error) {
    console.error('❌ Error insertando datos:', error.message);
  } finally {
    await pool.end();
  }
}

insertDashboardData();
