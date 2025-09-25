const { Pool } = require('pg');

// Configuración de PostgreSQL para Render
const postgresConfig = {
  user: process.env.PGUSER || process.env.DB_USER,
  host: process.env.PGHOST || process.env.DB_HOST,
  database: process.env.PGDATABASE || process.env.DB_NAME,
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
  port: process.env.PGPORT || process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

async function createUsuariosTable() {
  let pool;
  
  try {
    console.log('🚀 Creando tabla usuarios...');
    console.log('Host:', postgresConfig.host);
    console.log('Database:', postgresConfig.database);
    console.log('User:', postgresConfig.user);
    
    pool = new Pool(postgresConfig);
    
    // Probar conexión
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL');
    
    // Crear tabla usuarios
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100),
        rut VARCHAR(20) UNIQUE,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol VARCHAR(50) NOT NULL DEFAULT 'Orientador',
        estado VARCHAR(50) DEFAULT 'Activo',
        reset_token VARCHAR(255),
        reset_token_expiration TIMESTAMP,
        activo BOOLEAN DEFAULT true,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await pool.query(createTableSQL);
    console.log('✅ Tabla usuarios creada');
    
    // Crear índices
    await pool.query('CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_usuarios_reset_token ON usuarios(reset_token);');
    console.log('✅ Índices creados');
    
    // Verificar que la tabla existe
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'usuarios'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Tabla usuarios verificada');
    } else {
      console.log('❌ Error: Tabla usuarios no encontrada');
    }
    
    console.log('🎉 Proceso completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error creando tabla usuarios:', error.message);
    console.error('Stack trace:', error.stack);
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
  createUsuariosTable()
    .then(() => {
      console.log('✅ Tabla usuarios creada exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { createUsuariosTable };

