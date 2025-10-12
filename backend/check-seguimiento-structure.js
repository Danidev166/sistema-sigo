// Script para verificar la estructura de la tabla seguimiento_academico
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const { getPool } = require('./config/db');

async function checkStructure() {
  try {
    const pool = await getPool();
    console.log('🔍 Verificando estructura de seguimiento_academico...\n');
    
    // Verificar columnas existentes
    const columnsResult = await pool.request().query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'seguimiento_academico' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Columnas actuales:');
    columnsResult.recordset.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    // Verificar si existe el campo asignatura
    const hasAsignatura = columnsResult.recordset.some(col => col.column_name === 'asignatura');
    console.log(`\n🎯 Campo 'asignatura' existe: ${hasAsignatura ? 'SÍ' : 'NO'}`);
    
    if (!hasAsignatura) {
      console.log('\n➕ Agregando campo asignatura...');
      await pool.request().query(`
        ALTER TABLE seguimiento_academico 
        ADD COLUMN asignatura VARCHAR(100) DEFAULT 'General'
      `);
      console.log('✅ Campo asignatura agregado');
    }
    
    // Verificar datos existentes
    const dataResult = await pool.request().query(`
      SELECT COUNT(*) as total, 
             COUNT(CASE WHEN asignatura IS NOT NULL THEN 1 END) as con_asignatura
      FROM seguimiento_academico
    `);
    
    console.log('\n📈 Datos actuales:');
    console.log(`  - Total registros: ${dataResult.recordset[0].total}`);
    console.log(`  - Con asignatura: ${dataResult.recordset[0].con_asignatura}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkStructure();


