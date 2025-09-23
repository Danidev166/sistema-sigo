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

async function checkMissingTables() {
  let pool;
  
  try {
    console.log('🔍 Verificando tablas faltantes para reportes, movimientos y seguimiento psicosocial...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Tablas necesarias para estas secciones
    const requiredTables = [
      'movimiento_recursos',
      'entrega_recursos', 
      'seguimiento_psicosocial',
      'seguimiento_academico',
      'asistencia',
      'comunicacion_familia',
      'intervenciones',
      'conducta',
      'historial_academico',
      'seguimiento',
      'seguimiento_cronologico',
      'plantillas_reportes'
    ];
    
    console.log('\n📋 Verificando tablas requeridas...');
    
    for (const tableName of requiredTables) {
      try {
        const tableExists = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `, [tableName]);
        
        if (tableExists.rows[0].exists) {
          // Verificar si tiene datos
          const countResult = await pool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
          console.log(`✅ ${tableName}: Existe (${countResult.rows[0].total} registros)`);
        } else {
          console.log(`❌ ${tableName}: NO EXISTE`);
        }
      } catch (err) {
        console.log(`⚠️ ${tableName}: Error verificando - ${err.message}`);
      }
    }
    
    // Verificar todas las tablas disponibles
    console.log('\n📊 Todas las tablas disponibles en Render:');
    const allTablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    allTablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error verificando tablas:', error.message);
    throw error;
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  checkMissingTables()
    .then(() => {
      console.log('✅ Verificación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { checkMissingTables };
