// Script para verificar las columnas de la tabla agenda
const { Pool } = require('pg');

const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

async function checkAgendaColumns() {
  let pool;
  
  try {
    console.log('🔍 Verificando columnas de la tabla agenda...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Verificar estructura de la tabla agenda
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'agenda'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Estructura de la tabla agenda:');
    structure.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    // Verificar si existe la columna asistencia
    const hasAsistencia = structure.rows.some(col => col.column_name === 'asistencia');
    console.log('📊 ¿Tiene columna asistencia?', hasAsistencia);
    
    if (!hasAsistencia) {
      console.log('🔧 Agregando columna asistencia...');
      await pool.query(`
        ALTER TABLE agenda 
        ADD COLUMN asistencia VARCHAR(20) DEFAULT 'Pendiente';
      `);
      console.log('✅ Columna asistencia agregada');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack trace:', error.stack);
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

checkAgendaColumns();

