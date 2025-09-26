// Script para verificar la tabla entrevistas
const { Pool } = require('pg');

const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

async function checkEntrevistasTable() {
  let pool;
  
  try {
    console.log('🔍 Verificando tabla entrevistas...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Verificar si la tabla existe
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'entrevistas'
      );
    `);
    
    console.log('📋 Tabla entrevistas existe:', tableExists.rows[0].exists);
    
    if (tableExists.rows[0].exists) {
      // Verificar estructura de la tabla
      const structure = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'entrevistas'
        ORDER BY ordinal_position;
      `);
      
      console.log('📋 Estructura de la tabla entrevistas:');
      structure.rows.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
      });
      
      // Verificar si hay datos
      const count = await pool.query('SELECT COUNT(*) FROM entrevistas');
      console.log('📊 Total de registros en entrevistas:', count.rows[0].count);
    } else {
      console.log('❌ La tabla entrevistas no existe');
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

checkEntrevistasTable();

