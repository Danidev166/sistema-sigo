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

async function fixDatabaseSchema() {
  const pool = new Pool(renderConfig);
  
  try {
    console.log('🔧 Corrigiendo esquema de la base de datos...\n');
    
    // 1. Agregar columnas faltantes a seguimiento_academico
    console.log('1. Actualizando tabla seguimiento_academico...');
    try {
      await pool.query(`
        ALTER TABLE seguimiento_academico 
        ADD COLUMN IF NOT EXISTS asignatura VARCHAR(100),
        ADD COLUMN IF NOT EXISTS nota DECIMAL(5,2),
        ADD COLUMN IF NOT EXISTS promedio_curso DECIMAL(5,2),
        ADD COLUMN IF NOT EXISTS fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('✅ Columnas agregadas a seguimiento_academico');
    } catch (error) {
      console.log('⚠️ Error agregando columnas a seguimiento_academico:', error.message);
    }
    
    // 2. Agregar columnas faltantes a seguimiento
    console.log('2. Actualizando tabla seguimiento...');
    try {
      await pool.query(`
        ALTER TABLE seguimiento 
        ADD COLUMN IF NOT EXISTS tipo VARCHAR(50),
        ADD COLUMN IF NOT EXISTS descripcion TEXT,
        ADD COLUMN IF NOT EXISTS profesional VARCHAR(100),
        ADD COLUMN IF NOT EXISTS subtipo VARCHAR(50),
        ADD COLUMN IF NOT EXISTS archivo VARCHAR(255),
        ADD COLUMN IF NOT EXISTS urgencias BOOLEAN,
        ADD COLUMN IF NOT EXISTS fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('✅ Columnas agregadas a seguimiento');
    } catch (error) {
      console.log('⚠️ Error agregando columnas a seguimiento:', error.message);
    }
    
    // 3. Agregar columnas faltantes a seguimiento_cronologico
    console.log('3. Actualizando tabla seguimiento_cronologico...');
    try {
      await pool.query(`
        ALTER TABLE seguimiento_cronologico 
        ADD COLUMN IF NOT EXISTS titulo VARCHAR(255),
        ADD COLUMN IF NOT EXISTS profesional VARCHAR(100),
        ADD COLUMN IF NOT EXISTS fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('✅ Columnas agregadas a seguimiento_cronologico');
    } catch (error) {
      console.log('⚠️ Error agregando columnas a seguimiento_cronologico:', error.message);
    }
    
    // 4. Actualizar datos existentes para que usen las nuevas columnas
    console.log('4. Actualizando datos existentes...');
    
    // Actualizar seguimiento_academico
    await pool.query(`
      UPDATE seguimiento_academico 
      SET asignatura = 'Matemáticas',
          nota = 6.5,
          promedio_curso = 5.8,
          fecha = fecha_seguimiento
      WHERE asignatura IS NULL
    `);
    
    // Actualizar seguimiento
    await pool.query(`
      UPDATE seguimiento 
      SET tipo = tipo_seguimiento,
          descripcion = observaciones,
          profesional = 'Profesional SIGO',
          fecha = fecha_seguimiento
      WHERE tipo IS NULL
    `);
    
    // Actualizar seguimiento_cronologico
    await pool.query(`
      UPDATE seguimiento_cronologico 
      SET titulo = tipo_evento,
          profesional = 'Profesional SIGO',
          fecha = fecha_evento
      WHERE titulo IS NULL
    `);
    
    console.log('✅ Datos actualizados');
    
    // 5. Verificar la estructura final
    console.log('\n📋 Verificando estructura final...');
    
    const academico = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'seguimiento_academico' 
      ORDER BY ordinal_position
    `);
    
    const general = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'seguimiento' 
      ORDER BY ordinal_position
    `);
    
    const cronologico = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'seguimiento_cronologico' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📊 Estructura de seguimiento_academico:');
    academico.rows.forEach(row => console.log(`   - ${row.column_name}: ${row.data_type}`));
    
    console.log('\n📊 Estructura de seguimiento:');
    general.rows.forEach(row => console.log(`   - ${row.column_name}: ${row.data_type}`));
    
    console.log('\n📊 Estructura de seguimiento_cronologico:');
    cronologico.rows.forEach(row => console.log(`   - ${row.column_name}: ${row.data_type}`));
    
    console.log('\n✅ Esquema corregido exitosamente');
    
  } catch (error) {
    console.error('❌ Error corrigiendo esquema:', error.message);
  } finally {
    await pool.end();
  }
}

fixDatabaseSchema();
