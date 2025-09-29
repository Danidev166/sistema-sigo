/**
 * Script para verificar el código de recuperación en la base de datos
 */

const { getPool } = require('./backend/config/db');

async function verificarCodigoRecuperacion(email) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('email', email.toLowerCase())
      .query(`
        SELECT id, nombre, apellido, email, reset_token, reset_token_expiration
        FROM usuarios
        WHERE LOWER(email) = @email
        LIMIT 1
      `);
    
    if (result.recordset.length === 0) {
      console.log('❌ Usuario no encontrado');
      return null;
    }
    
    const usuario = result.recordset[0];
    console.log('✅ Usuario encontrado:');
    console.log(`   ID: ${usuario.id}`);
    console.log(`   Nombre: ${usuario.nombre} ${usuario.apellido}`);
    console.log(`   Email: ${usuario.email}`);
    console.log(`   Código: ${usuario.reset_token || 'No hay código'}`);
    console.log(`   Expira: ${usuario.reset_token_expiration || 'No hay expiración'}`);
    
    if (usuario.reset_token) {
      const ahora = new Date();
      const expiracion = new Date(usuario.reset_token_expiration);
      const valido = ahora < expiracion;
      
      console.log(`   Estado: ${valido ? '✅ Válido' : '❌ Expirado'}`);
      console.log(`   Tiempo restante: ${valido ? Math.round((expiracion - ahora) / 1000 / 60) + ' minutos' : 'Expirado'}`);
    }
    
    return usuario;
  } catch (error) {
    console.error('❌ Error consultando base de datos:', error);
    return null;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const email = process.argv[2] || 'daniel1822@gmail.com';
  console.log(`🔍 Verificando código de recuperación para: ${email}`);
  verificarCodigoRecuperacion(email).then(() => {
    process.exit(0);
  }).catch(console.error);
}

module.exports = { verificarCodigoRecuperacion };
