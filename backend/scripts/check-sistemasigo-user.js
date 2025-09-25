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

async function checkSistemasigoUser() {
  let pool;
  
  try {
    console.log('🔍 Buscando usuario "sistemasigo"...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Buscar usuario por email que contenga "sistema" o "sigo"
    const usuariosResult = await pool.query(`
      SELECT id, nombre, apellido, email, rol, estado, 
             SUBSTRING(password, 1, 20) as password_preview
      FROM usuarios 
      WHERE email ILIKE '%sistema%' 
         OR email ILIKE '%sigo%'
         OR nombre ILIKE '%sistema%'
         OR nombre ILIKE '%sigo%'
      ORDER BY id
    `);
    
    console.log(`📋 Usuarios encontrados: ${usuariosResult.rows.length}`);
    
    if (usuariosResult.rows.length === 0) {
      console.log('❌ No se encontró usuario "sistemasigo"');
      
      // Mostrar todos los usuarios disponibles
      const allUsers = await pool.query(`
        SELECT id, nombre, apellido, email, rol, estado
        FROM usuarios 
        ORDER BY id
      `);
      
      console.log('\n👥 Usuarios disponibles:');
      allUsers.rows.forEach((usuario, index) => {
        console.log(`  ${index + 1}. ${usuario.email} (${usuario.nombre} ${usuario.apellido}) - Rol: ${usuario.rol}`);
      });
      
      return;
    }
    
    console.log('👥 Usuarios encontrados:');
    usuariosResult.rows.forEach((usuario, index) => {
      console.log(`\n${index + 1}. ${usuario.email}`);
      console.log(`   Nombre: ${usuario.nombre} ${usuario.apellido}`);
      console.log(`   Rol: ${usuario.rol}`);
      console.log(`   Estado: ${usuario.estado}`);
      console.log(`   Password (preview): ${usuario.password_preview}...`);
    });
    
    // Si encontramos el usuario, intentar crear uno con credenciales conocidas
    console.log('\n💡 Si no tienes las credenciales, puedes usar:');
    console.log('   Email: test@test.com');
    console.log('   Contraseña: test123');
    
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
  checkSistemasigoUser()
    .then(() => {
      console.log('✅ Verificación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { checkSistemasigoUser };

