/**
 * Script para verificar usuarios en la base de datos
 */

require('dotenv').config({ path: '.env.production' });
const { getPool } = require('./config/db');

async function checkUsers() {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT id, nombre, apellido, email, rol, estado 
      FROM usuarios 
      ORDER BY id 
      LIMIT 10
    `);
    
    console.log('👥 Usuarios en la base de datos:');
    console.log('=' .repeat(60));
    
    result.recordset.forEach(user => {
      console.log(`ID: ${user.id} | ${user.nombre} ${user.apellido} | ${user.email} | ${user.rol} | ${user.estado}`);
    });
    
    console.log(`\nTotal: ${result.recordset.length} usuarios encontrados`);
    
  } catch (error) {
    console.error('❌ Error consultando usuarios:', error.message);
  }
}

checkUsers();
