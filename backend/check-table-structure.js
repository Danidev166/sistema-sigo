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

async function checkTableStructure() {
  const pool = new Pool(renderConfig);
  
  try {
    console.log('🔍 Verificando estructura de las tablas...\n');
    
    const tables = [
      'seguimiento_academico',
      'seguimiento',
      'seguimiento_cronologico'
    ];
    
    for (const table of tables) {
      console.log(`📋 Estructura de la tabla ${table}:`);
      try {
        const result = await pool.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = $1
          ORDER BY ordinal_position;
        `, [table]);
        
        if (result.rows.length === 0) {
          console.log('   ❌ Tabla no encontrada');
        } else {
          result.rows.forEach(row => {
            console.log(`   - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
          });
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  } finally {
    await pool.end();
  }
}

checkTableStructure();
