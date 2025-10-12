// Script para verificar si existe la tabla comunicacion_familia con diferentes nombres
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const { getPool } = require('./config/db');

async function checkComunicacionFamiliaExists() {
  try {
    const pool = await getPool();
    console.log('🔍 Buscando tabla de comunicación familia...\n');
    
    // Buscar tablas que contengan "comunicacion" o "familia"
    const tablesResult = await pool.request().query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (table_name ILIKE '%comunicacion%' OR table_name ILIKE '%familia%')
      ORDER BY table_name
    `);
    
    console.log('📊 Tablas relacionadas con comunicación/familia:');
    if (tablesResult.recordset.length > 0) {
      tablesResult.recordset.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    } else {
      console.log('  ❌ No se encontraron tablas relacionadas');
    }
    
    // Verificar si existe con nombre exacto
    try {
      const checkResult = await pool.request().query(`
        SELECT COUNT(*) as total FROM comunicacion_familia
      `);
      console.log(`\n✅ Tabla 'comunicacion_familia' existe con ${checkResult.recordset[0].total} registros`);
    } catch (error) {
      console.log(`\n❌ Tabla 'comunicacion_familia' no existe: ${error.message}`);
    }
    
    // Verificar si existe con guión bajo
    try {
      const checkResult2 = await pool.request().query(`
        SELECT COUNT(*) as total FROM comunicacion_familia
      `);
      console.log(`\n✅ Tabla 'comunicacion_familia' existe con ${checkResult2.recordset[0].total} registros`);
    } catch (error) {
      console.log(`\n❌ Tabla 'comunicacion_familia' no existe: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkComunicacionFamiliaExists();


