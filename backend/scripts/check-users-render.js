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

async function checkUsersRender() {
  let pool;
  
  try {
    console.log('👥 Verificando usuarios en Render...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Obtener todos los usuarios
    const usersResult = await pool.query(`
      SELECT id, nombre, email, rol, activo, fecha_creacion
      FROM usuarios 
      ORDER BY id
    `);
    
    console.log(`\n📋 Usuarios en Render: ${usersResult.rows.length}`);
    
    usersResult.rows.forEach((user, index) => {
      console.log(`\n${index + 1}. Usuario:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.nombre}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.rol}`);
      console.log(`   Activo: ${user.activo}`);
      console.log(`   Fecha: ${user.fecha_creacion}`);
    });
    
    if (usersResult.rows.length === 0) {
      console.log('\n⚠️ No hay usuarios en Render');
    } else {
      console.log('\n💡 Usa uno de estos emails para hacer login');
    }
    
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
  checkUsersRender()
    .then(() => {
      console.log('✅ Verificación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { checkUsersRender };
