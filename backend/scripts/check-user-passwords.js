const { Pool } = require('pg');

// Configuración PostgreSQL LOCAL
const localConfig = {
  user: 'sitema_sigo',
  host: 'localhost',
  database: 'sistema-sigo',
  password: 'z5blhb00',
  port: 5432,
  ssl: false,
};

async function checkUserPasswords() {
  let pool;
  
  try {
    console.log('🔍 Verificando contraseñas de usuarios...');
    
    pool = new Pool(localConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL local');
    
    // Obtener usuarios con sus contraseñas (hasheadas)
    const usuariosResult = await pool.query(`
      SELECT id, nombre, apellido, email, rol, estado, 
             SUBSTRING(password, 1, 20) as password_preview
      FROM usuarios 
      ORDER BY id
    `);
    
    console.log(`📋 Usuarios encontrados: ${usuariosResult.rows.length}`);
    console.log('👥 Información de usuarios:');
    
    usuariosResult.rows.forEach((usuario, index) => {
      console.log(`\n${index + 1}. ${usuario.email}`);
      console.log(`   Nombre: ${usuario.nombre} ${usuario.apellido}`);
      console.log(`   Rol: ${usuario.rol}`);
      console.log(`   Estado: ${usuario.estado}`);
      console.log(`   Password (preview): ${usuario.password_preview}...`);
    });
    
    console.log('\n💡 Las contraseñas están hasheadas con bcrypt');
    console.log('💡 Para probar el login, necesitas usar la contraseña original');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  checkUserPasswords()
    .then(() => {
      console.log('✅ Verificación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { checkUserPasswords };

