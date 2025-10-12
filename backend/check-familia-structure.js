// Script para verificar la estructura de la tabla comunicacion_familia
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const { getPool } = require('./config/db');

async function checkFamiliaStructure() {
  try {
    const pool = await getPool();
    console.log('🔍 Verificando estructura de comunicacion_familia...\n');
    
    // Verificar columnas existentes
    const columnsResult = await pool.request().query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'comunicacion_familia' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Columnas actuales:');
    columnsResult.recordset.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    // Verificar datos existentes
    const dataResult = await pool.request().query(`
      SELECT COUNT(*) as total FROM comunicacion_familia
    `);
    
    console.log(`\n📈 Total registros: ${dataResult.recordset[0].total}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkFamiliaStructure();


