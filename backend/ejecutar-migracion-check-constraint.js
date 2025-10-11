// Script para ejecutar la migración del CHECK constraint
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const { getPool } = require('./config/db');
const fs = require('fs');
const path = require('path');

async function ejecutarMigracion() {
  try {
    const pool = await getPool();
    const migracionPath = path.join(__dirname, 'migrations', 'add_check_constraint_asistencia_tipo.sql');
    const migracionSQL = fs.readFileSync(migracionPath, 'utf8');
    
    console.log('🔄 Ejecutando migración del CHECK constraint...');
    await pool.request().query(migracionSQL);
    
    console.log('✅ Migración ejecutada exitosamente');
    
    // Verificar que el constraint se creó
    const result = await pool.request().query(`
      SELECT constraint_name, check_clause 
      FROM information_schema.check_constraints 
      WHERE constraint_name = 'chk_asistencia_tipo'
    `);
    
    if (result.recordset.length > 0) {
      console.log('✅ CHECK constraint creado correctamente');
      console.log('📋 Detalles:', result.recordset[0]);
    } else {
      console.log('⚠️ No se pudo verificar el constraint');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    process.exit(1);
  }
}

ejecutarMigracion();
