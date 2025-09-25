const { Pool } = require('pg');

// Configuración de PostgreSQL para Render
const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

async function checkUserPasswordsRender() {
  let pool;
  
  try {
    console.log('🔍 Verificando contraseñas de usuarios en Render...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Obtener usuarios con información de contraseña (sin mostrar la contraseña completa)
    const usersResult = await pool.query(`
      SELECT id, nombre, email, rol, 
             SUBSTRING(password, 1, 10) as password_start,
             LENGTH(password) as password_length
      FROM usuarios 
      ORDER BY id
    `);
    
    console.log(`\n👥 Usuarios en Render: ${usersResult.rows.length}`);
    
    usersResult.rows.forEach((user, index) => {
      console.log(`\n${index + 1}. Usuario:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.nombre}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.rol}`);
      console.log(`   Password: ${user.password_start}... (${user.password_length} caracteres)`);
    });
    
    console.log('\n💡 Las contraseñas están hasheadas con bcrypt');
    console.log('💡 Necesitas usar las contraseñas originales para hacer login');
    
  } catch (error) {
    console.error('❌ Error verificando usuarios:', error.message);
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
  checkUserPasswordsRender()
    .then(() => {
      console.log('✅ Verificación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { checkUserPasswordsRender };

