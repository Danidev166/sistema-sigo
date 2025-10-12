// Script para verificar la estructura de la tabla comunicacion_interna
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const { getPool } = require('./config/db');

async function checkComunicacionInternaStructure() {
  try {
    const pool = await getPool();
    console.log('🔍 Verificando estructura de comunicacion_interna...\n');
    
    // Verificar columnas existentes
    const columnsResult = await pool.request().query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'comunicacion_interna' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Columnas actuales:');
    columnsResult.recordset.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    // Verificar datos existentes
    const dataResult = await pool.request().query(`
      SELECT COUNT(*) as total FROM comunicacion_interna
    `);
    
    console.log(`\n📈 Total registros: ${dataResult.recordset[0].total}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkComunicacionInternaStructure();


