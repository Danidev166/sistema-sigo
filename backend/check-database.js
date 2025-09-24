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

async function checkDatabase() {
  const pool = new Pool(renderConfig);
  
  try {
    console.log('🔍 Verificando conexión a la base de datos...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL');
    
    // Verificar si las tablas existen
    const tables = [
      'usuarios',
      'estudiantes', 
      'seguimiento_academico',
      'seguimiento',
      'seguimiento_cronologico'
    ];
    
    for (const table of tables) {
      try {
        const result = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `, [table]);
        
        const exists = result.rows[0].exists;
        console.log(`${exists ? '✅' : '❌'} Tabla ${table}: ${exists ? 'EXISTE' : 'NO EXISTE'}`);
        
        if (exists) {
          // Contar registros
          const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
          const count = countResult.rows[0].count;
          console.log(`   📊 Registros: ${count}`);
        }
      } catch (error) {
        console.log(`❌ Error verificando tabla ${table}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();
