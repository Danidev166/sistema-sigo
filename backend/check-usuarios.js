// Script para verificar usuarios en la base de datos
require('dotenv').config();
const { sql, poolPromise } = require('./config/db');

async function checkUsuarios() {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT id, nombre, apellido, email, rol, estado FROM Usuarios');
    
    console.log('Ì±• Usuarios en la base de datos:');
    console.log('================================');
    
    result.recordset.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Nombre: ${user.nombre} ${user.apellido}`);
      console.log(`Email: ${user.email}`);
      console.log(`Rol: ${user.rol}`);
      console.log(`Estado: ${user.estado ? 'Activo' : 'Inactivo'}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('‚ùå Error:', error);
    process.exit(1);
  }
}

checkUsuarios();
