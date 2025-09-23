const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Configuración de PostgreSQL para Render
const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

async function createTestUser() {
  let pool;
  
  try {
    console.log('👤 Creando usuario de prueba...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      ['test@test.com']
    );
    
    if (existingUser.rows.length > 0) {
      console.log('⚠️ Usuario test@test.com ya existe');
      return;
    }
    
    // Crear hash de la contraseña
    const password = 'test123';
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insertar usuario de prueba (sin especificar ID para que use SERIAL)
    const result = await pool.query(`
      INSERT INTO usuarios (nombre, apellido, rut, email, password, rol, estado, fecha_creacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, nombre, email, rol
    `, [
      'Usuario',
      'Prueba',
      '12345678-9',
      'test@test.com',
      hashedPassword,
      'Admin',
      'Activo',
      new Date()
    ]);
    
    const newUser = result.rows[0];
    console.log('✅ Usuario de prueba creado exitosamente:');
    console.log(`   ID: ${newUser.id}`);
    console.log(`   Nombre: ${newUser.nombre}`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Rol: ${newUser.rol}`);
    console.log(`   Contraseña: ${password}`);
    
  } catch (error) {
    console.error('❌ Error creando usuario:', error.message);
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
  createTestUser()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { createTestUser };
