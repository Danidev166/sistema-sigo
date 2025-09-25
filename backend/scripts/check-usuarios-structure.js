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

async function checkUsuariosStructure() {
  let pool;
  
  try {
    console.log('🔍 Verificando estructura de tabla usuarios...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Obtener estructura de la tabla usuarios
    const structureResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'usuarios' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Estructura de tabla usuarios:');
    structureResult.rows.forEach((col, index) => {
      console.log(`${index + 1}. ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Obtener usuarios con columnas disponibles
    const usersResult = await pool.query(`
      SELECT id, nombre, email, rol, fecha_creacion
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
      console.log(`   Fecha: ${user.fecha_creacion}`);
    });
    
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
  checkUsuariosStructure()
    .then(() => {
      console.log('✅ Verificación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { checkUsuariosStructure };

