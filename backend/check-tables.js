// Script para verificar todas las tablas disponibles
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const { getPool } = require('./config/db');

async function checkTables() {
  try {
    const pool = await getPool();
    console.log('🔍 Verificando tablas disponibles...\n');
    
    // Listar todas las tablas
    const tablesResult = await pool.request().query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📊 Tablas disponibles:');
    tablesResult.recordset.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTables();


