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
  let pool;
  
  try {
    console.log('🔍 Verificando estructura de tablas problemáticas...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Verificar estructura de intervenciones
    console.log('\n📋 Estructura de tabla intervenciones:');
    const intervencionesResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'intervenciones' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    if (intervencionesResult.rows.length === 0) {
      console.log('❌ Tabla intervenciones no existe');
    } else {
      intervencionesResult.rows.forEach((col, index) => {
        console.log(`${index + 1}. ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    }
    
    // Verificar estructura de seguimiento_psicosocial
    console.log('\n📋 Estructura de tabla seguimiento_psicosocial:');
    const seguimientoResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'seguimiento_psicosocial' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    if (seguimientoResult.rows.length === 0) {
      console.log('❌ Tabla seguimiento_psicosocial no existe');
    } else {
      seguimientoResult.rows.forEach((col, index) => {
        console.log(`${index + 1}. ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    }
    
    // Verificar todas las tablas disponibles
    console.log('\n📊 Todas las tablas disponibles:');
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
    console.error('❌ Error verificando estructura:', error.message);
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
  checkTableStructure()
    .then(() => {
      console.log('✅ Verificación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { checkTableStructure };

