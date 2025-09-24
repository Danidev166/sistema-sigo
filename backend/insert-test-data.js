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

async function insertTestData() {
  const pool = new Pool(renderConfig);
  
  try {
    console.log('🔍 Insertando datos de prueba...\n');
    
    // Insertar datos de prueba en seguimiento_academico
    console.log('1. Insertando en seguimiento_academico...');
    await pool.query(`
      INSERT INTO seguimiento_academico 
      (id_estudiante, rendimiento, asistencia_porcentaje, observaciones, recomendaciones, responsable_id, periodo, fecha_seguimiento)
      VALUES 
      (1, 'Bueno', 85.5, 'Estudiante muestra buen rendimiento', 'Continuar con el apoyo actual', 1, '2024-1', NOW()),
      (2, 'Regular', 70.0, 'Necesita más apoyo en matemáticas', 'Reforzar conceptos básicos', 1, '2024-1', NOW())
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Datos insertados en seguimiento_academico');
    
    // Insertar datos de prueba en seguimiento
    console.log('2. Insertando en seguimiento...');
    await pool.query(`
      INSERT INTO seguimiento 
      (id_estudiante, fecha_seguimiento, tipo_seguimiento, observaciones, recomendaciones, responsable_id, estado, proxima_fecha)
      VALUES 
      (1, NOW(), 'Académico', 'Seguimiento académico regular', 'Próxima revisión en 2 semanas', 1, 'Activo', NOW() + INTERVAL '14 days'),
      (2, NOW(), 'Psicosocial', 'Seguimiento psicosocial', 'Continuar con el apoyo', 1, 'Activo', NOW() + INTERVAL '7 days')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Datos insertados en seguimiento');
    
    // Insertar datos de prueba en seguimiento_cronologico
    console.log('3. Insertando en seguimiento_cronologico...');
    await pool.query(`
      INSERT INTO seguimiento_cronologico 
      (id_estudiante, fecha_evento, tipo_evento, descripcion, responsable_id, observaciones)
      VALUES 
      (1, NOW(), 'Reunión', 'Reunión con apoderado', 1, 'Reunión productiva'),
      (2, NOW(), 'Evaluación', 'Evaluación psicopedagógica', 1, 'Evaluación completada')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Datos insertados en seguimiento_cronologico');
    
    // Verificar los datos insertados
    console.log('\n📊 Verificando datos insertados...');
    
    const academico = await pool.query('SELECT COUNT(*) FROM seguimiento_academico');
    const general = await pool.query('SELECT COUNT(*) FROM seguimiento');
    const cronologico = await pool.query('SELECT COUNT(*) FROM seguimiento_cronologico');
    
    console.log(`   - seguimiento_academico: ${academico.rows[0].count} registros`);
    console.log(`   - seguimiento: ${general.rows[0].count} registros`);
    console.log(`   - seguimiento_cronologico: ${cronologico.rows[0].count} registros`);
    
    console.log('\n✅ Datos de prueba insertados correctamente');
    
  } catch (error) {
    console.error('❌ Error insertando datos:', error.message);
  } finally {
    await pool.end();
  }
}

insertTestData();
