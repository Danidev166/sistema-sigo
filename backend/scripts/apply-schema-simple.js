const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración de PostgreSQL para Render - USANDO SIEMPRE DATABASE_URL PARA SEGURIDAD
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ ERROR: La variable de entorno DATABASE_URL no está configurada.');
  process.exit(1);
}

const renderConfig = {
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
};

async function applyFullSchema() {
  let pool;
  
  try {
    console.log('🚀 Iniciando aplicación del ESQUEMA MAESTRO COMPLETO a Render...');
    
    pool = new Pool(renderConfig);
    
    // Probar conexión
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Leer el archivo de esquema completo
    const schemaPath = path.join(__dirname, '../migrations/full_schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log(`📄 Esquema maestro leído desde ${schemaPath}`);
    
    // Ejecutar el esquema completo en una sola transacción
    console.log('📋 Ejecutando esquema maestro...');
    
    await pool.query('BEGIN');
    try {
      // Nota: El split por ; es simple pero efectivo para este esquema
      // aunque pg permite enviar múltiples comandos si se habilita
      await pool.query(schemaSQL);
      await pool.query('COMMIT');
      console.log('✅ Esquema ejecutado exitosamente');
    } catch (err) {
      await pool.query('ROLLBACK');
      console.log('⚠️  Error durante la ejecución del esquema, se hizo ROLLBACK.');
      console.log('Detalles:', err.message);
      throw err;
    }
    
    // Verificar que las tablas se crearon correctamente
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📊 RESUMEN DE TABLAS EN LA BASE DE DATOS:');
    tablesResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    
    console.log(`\n🎉 ¡SISTEMA RESTAURADO! Total de tablas: ${tablesResult.rows.length}`);
    
  } catch (error) {
    console.error('❌ Error crítico:', error.message);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  applyFullSchema()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { applyFullSchema };
