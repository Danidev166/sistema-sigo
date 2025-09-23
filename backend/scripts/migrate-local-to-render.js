const { Pool } = require('pg');

// Configuración PostgreSQL LOCAL (origen)
const localConfig = {
  user: process.env.LOCAL_PGUSER || 'postgres',
  host: process.env.LOCAL_PGHOST || 'localhost',
  database: process.env.LOCAL_PGDATABASE || 'sigo_db',
  password: process.env.LOCAL_PGPASSWORD || 'password',
  port: process.env.LOCAL_PGPORT || 5432,
  ssl: false,
};

// Configuración PostgreSQL RENDER (destino)
const renderConfig = {
  user: process.env.PGUSER || process.env.DB_USER,
  host: process.env.PGHOST || process.env.DB_HOST,
  database: process.env.PGDATABASE || process.env.DB_NAME,
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
  port: process.env.PGPORT || process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

async function migrateLocalToRender() {
  let localPool, renderPool;
  
  try {
    console.log('🚀 Iniciando migración de PostgreSQL local a Render...');
    
    // Conectar a PostgreSQL local
    console.log('🔌 Conectando a PostgreSQL local...');
    localPool = new Pool(localConfig);
    await localPool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL local');
    
    // Conectar a PostgreSQL de Render
    console.log('🔌 Conectando a PostgreSQL de Render...');
    renderPool = new Pool(renderConfig);
    await renderPool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Crear tabla usuarios en Render si no existe
    const createUsuariosTable = `
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
    
    await renderPool.query(createUsuariosTable);
    console.log('✅ Tabla usuarios creada en Render');
    
    // Obtener usuarios de la base local
    const usuariosResult = await localPool.query('SELECT * FROM usuarios');
    console.log(`📊 Encontrados ${usuariosResult.rows.length} usuarios en local`);
    
    // Migrar usuarios a Render
    for (const usuario of usuariosResult.rows) {
      try {
        await renderPool.query(`
          INSERT INTO usuarios (id, nombre, apellido, rut, email, password, rol, estado, reset_token, reset_token_expiration, activo, fecha_creacion, fecha_actualizacion)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (id) DO UPDATE SET
            nombre = EXCLUDED.nombre,
            apellido = EXCLUDED.apellido,
            rut = EXCLUDED.rut,
            email = EXCLUDED.email,
            password = EXCLUDED.password,
            rol = EXCLUDED.rol,
            estado = EXCLUDED.estado,
            reset_token = EXCLUDED.reset_token,
            reset_token_expiration = EXCLUDED.reset_token_expiration,
            activo = EXCLUDED.activo,
            fecha_actualizacion = EXCLUDED.fecha_actualizacion
        `, [
          usuario.id,
          usuario.nombre,
          usuario.apellido,
          usuario.rut,
          usuario.email,
          usuario.password,
          usuario.rol,
          usuario.estado,
          usuario.reset_token,
          usuario.reset_token_expiration,
          usuario.activo,
          usuario.fecha_creacion,
          usuario.fecha_actualizacion
        ]);
      } catch (err) {
        console.error(`❌ Error migrando usuario ${usuario.email}:`, err.message);
      }
    }
    
    console.log('✅ Usuarios migrados a Render');
    
    // Verificar migración
    const renderUsuarios = await renderPool.query('SELECT COUNT(*) as total FROM usuarios');
    console.log(`📊 Usuarios en Render: ${renderUsuarios.rows[0].total}`);
    
    console.log('🎉 Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  } finally {
    // Cerrar conexiones
    if (localPool) {
      await localPool.end();
      console.log('🔌 Conexión local cerrada');
    }
    if (renderPool) {
      await renderPool.end();
      console.log('🔌 Conexión Render cerrada');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  migrateLocalToRender()
    .then(() => {
      console.log('✅ Migración completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en migración:', error);
      process.exit(1);
    });
}

module.exports = { migrateLocalToRender };
