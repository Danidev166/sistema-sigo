// Script para agregar columnas faltantes a la tabla entrevistas
const { Pool } = require('pg');

const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

async function addEntrevistasColumns() {
  let pool;
  
  try {
    console.log('🔧 Agregando columnas faltantes a tabla entrevistas...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Agregar columna conclusiones si no existe
    try {
      await pool.query(`
        ALTER TABLE entrevistas 
        ADD COLUMN IF NOT EXISTS conclusiones TEXT;
      `);
      console.log('✅ Columna conclusiones agregada');
    } catch (error) {
      console.log('⚠️ Columna conclusiones ya existe o error:', error.message);
    }
    
    // Agregar columna acciones_acordadas si no existe
    try {
      await pool.query(`
        ALTER TABLE entrevistas 
        ADD COLUMN IF NOT EXISTS acciones_acordadas TEXT;
      `);
      console.log('✅ Columna acciones_acordadas agregada');
    } catch (error) {
      console.log('⚠️ Columna acciones_acordadas ya existe o error:', error.message);
    }
    
    // Verificar estructura final
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'entrevistas'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Estructura final de la tabla entrevistas:');
    structure.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
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

addEntrevistasColumns();

