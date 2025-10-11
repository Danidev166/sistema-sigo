// Script para probar la conexión a la base de datos
require('dotenv').config({ path: '.env' });

console.log('🔧 Variables de entorno cargadas:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PGHOST:', process.env.PGHOST);
console.log('  PGPORT:', process.env.PGPORT);
console.log('  PGUSER:', process.env.PGUSER);
console.log('  PGPASSWORD:', process.env.PGPASSWORD ? 'CONFIGURADA' : 'NO CONFIGURADA');
console.log('  PGDATABASE:', process.env.PGDATABASE);
console.log('  PG_SSL:', process.env.PG_SSL);

const { getPool } = require('./config/db');

async function testConnection() {
  try {
    console.log('\n🔌 Probando conexión a la base de datos...');
    const pool = await getPool();
    console.log('✅ Pool creado exitosamente');
    
    // Probar una consulta simple
    const result = await pool.request().query('SELECT NOW() as current_time');
    console.log('✅ Consulta exitosa:', result.recordset[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  }
}

testConnection();
