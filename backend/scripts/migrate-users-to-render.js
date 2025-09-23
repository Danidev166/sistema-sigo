const { Pool } = require('pg');

// Configuración PostgreSQL LOCAL (origen)
const localConfig = {
  user: 'sitema_sigo',
  host: 'localhost',
  database: 'sistema-sigo',
  password: 'z5blhb00',
  port: 5432,
  ssl: false,
};

// Configuración PostgreSQL RENDER (destino)
const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

async function migrateUsersToRender() {
  let localPool, renderPool;
  
  try {
    console.log('🚀 Migrando usuarios de local a Render...');
    
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
    
    // Obtener usuarios de la base local
    console.log('📊 Obteniendo usuarios de la base local...');
    const usuariosResult = await localPool.query('SELECT * FROM usuarios');
    console.log(`📋 Encontrados ${usuariosResult.rows.length} usuarios en local`);
    
    if (usuariosResult.rows.length === 0) {
      console.log('⚠️ No hay usuarios en la base local');
      return;
    }
    
    // Mostrar usuarios que se van a migrar
    console.log('👥 Usuarios a migrar:');
    usuariosResult.rows.forEach((usuario, index) => {
      console.log(`  ${index + 1}. ${usuario.email} (${usuario.nombre} ${usuario.apellido}) - Rol: ${usuario.rol}`);
    });
    
    // Migrar usuarios a Render
    console.log('📤 Migrando usuarios a Render...');
    let migrated = 0;
    let errors = 0;
    
    for (const usuario of usuariosResult.rows) {
      try {
        await renderPool.query(`
          INSERT INTO usuarios (id, nombre, apellido, rut, email, password, rol, estado, fecha_creacion, reset_token, reset_token_expiration)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            nombre = EXCLUDED.nombre,
            apellido = EXCLUDED.apellido,
            rut = EXCLUDED.rut,
            email = EXCLUDED.email,
            password = EXCLUDED.password,
            rol = EXCLUDED.rol,
            estado = EXCLUDED.estado,
            reset_token = EXCLUDED.reset_token,
            reset_token_expiration = EXCLUDED.reset_token_expiration
        `, [
          usuario.id,
          usuario.nombre,
          usuario.apellido,
          usuario.rut,
          usuario.email,
          usuario.password,
          usuario.rol,
          usuario.estado,
          usuario.fecha_creacion,
          usuario.reset_token,
          usuario.reset_token_expiration
        ]);
        
        console.log(`✅ Usuario migrado: ${usuario.email}`);
        migrated++;
        
      } catch (err) {
        console.error(`❌ Error migrando usuario ${usuario.email}:`, err.message);
        errors++;
      }
    }
    
    console.log(`📊 Migración completada: ${migrated} exitosos, ${errors} errores`);
    
    // Verificar migración
    const renderUsuarios = await renderPool.query('SELECT COUNT(*) as total FROM usuarios');
    console.log(`👥 Total de usuarios en Render: ${renderUsuarios.rows[0].total}`);
    
    // Mostrar usuarios en Render
    const usuariosRender = await renderPool.query('SELECT id, nombre, apellido, email, rol, estado FROM usuarios ORDER BY id');
    console.log('👤 Usuarios en Render:');
    usuariosRender.rows.forEach(usuario => {
      console.log(`  - ${usuario.email} (${usuario.nombre} ${usuario.apellido}) - Rol: ${usuario.rol} - Estado: ${usuario.estado}`);
    });
    
    console.log('🎉 ¡Migración de usuarios completada!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
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
  migrateUsersToRender()
    .then(() => {
      console.log('✅ Migración completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en migración:', error);
      process.exit(1);
    });
}

module.exports = { migrateUsersToRender };
