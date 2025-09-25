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

async function createMissingTables() {
  let pool;
  
  try {
    console.log('🚀 Creando tablas faltantes en Render...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // 1. Tabla alertas
    console.log('📋 Creando tabla alertas...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alertas (
        id SERIAL PRIMARY KEY,
        id_estudiante INTEGER REFERENCES estudiantes(id),
        fecha_alerta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        tipo_alerta VARCHAR(100) NOT NULL,
        descripcion TEXT,
        estado VARCHAR(30) DEFAULT 'Nueva',
        creado_por INTEGER REFERENCES usuarios(id),
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla alertas creada');
    
    // 2. Tabla notificaciones
    console.log('📋 Creando tabla notificaciones...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notificaciones (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id),
        titulo VARCHAR(255) NOT NULL,
        mensaje TEXT NOT NULL,
        tipo VARCHAR(50) DEFAULT 'info',
        leida BOOLEAN DEFAULT false,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        fecha_lectura TIMESTAMP WITH TIME ZONE
      )
    `);
    console.log('✅ Tabla notificaciones creada');
    
    // 3. Tabla agenda
    console.log('📋 Creando tabla agenda...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS agenda (
        id SERIAL PRIMARY KEY,
        id_estudiante INTEGER REFERENCES estudiantes(id),
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        motivo VARCHAR(255) NOT NULL,
        profesional VARCHAR(100) NOT NULL,
        email_orientador VARCHAR(255),
        creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        creado_por INTEGER REFERENCES usuarios(id)
      )
    `);
    console.log('✅ Tabla agenda creada');
    
    // 4. Tabla configuracion
    console.log('📋 Creando tabla configuracion...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS configuracion (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL,
        clave VARCHAR(100) NOT NULL,
        valor TEXT,
        descripcion TEXT,
        usuario_modificacion VARCHAR(100),
        fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(tipo, clave)
      )
    `);
    console.log('✅ Tabla configuracion creada');
    
    // 5. Tabla logs_actividad (ya existe, pero vamos a verificar)
    console.log('📋 Verificando tabla logs_actividad...');
    const logsExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'logs_actividad'
      );
    `);
    
    if (!logsExists.rows[0].exists) {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS logs_actividad (
          id SERIAL PRIMARY KEY,
          usuario_id INTEGER REFERENCES usuarios(id),
          accion VARCHAR(100) NOT NULL,
          tabla_afectada VARCHAR(50),
          registro_id INTEGER,
          detalles JSONB,
          fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          ip_address INET
        )
      `);
      console.log('✅ Tabla logs_actividad creada');
    } else {
      console.log('✅ Tabla logs_actividad ya existe');
    }
    
    // 6. Crear índices para mejorar rendimiento
    console.log('📋 Creando índices...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_alertas_estudiante ON alertas(id_estudiante)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_alertas_fecha ON alertas(fecha_alerta)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(usuario_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones(leida)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_agenda_fecha ON agenda(fecha)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_agenda_estudiante ON agenda(id_estudiante)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_configuracion_tipo ON configuracion(tipo)');
    console.log('✅ Índices creados');
    
    // Verificar todas las tablas
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`📋 Total de tablas en Render: ${tablesResult.rows.length}`);
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Insertar datos de configuración básicos
    console.log('📋 Insertando configuraciones básicas...');
    const configuraciones = [
      { tipo: 'institucional', clave: 'nombre_institucion', valor: 'Liceo SIGO', descripcion: 'Nombre de la institución' },
      { tipo: 'institucional', clave: 'direccion', valor: 'Dirección del Liceo', descripcion: 'Dirección de la institución' },
      { tipo: 'personalizacion', clave: 'tema', valor: 'claro', descripcion: 'Tema de la aplicación' },
      { tipo: 'politicas', clave: 'politica_privacidad', valor: 'Política de privacidad básica', descripcion: 'Política de privacidad' }
    ];
    
    for (const config of configuraciones) {
      try {
        await pool.query(`
          INSERT INTO configuracion (tipo, clave, valor, descripcion, usuario_modificacion)
          VALUES ($1, $2, $3, $4, 'sistema')
          ON CONFLICT (tipo, clave) DO NOTHING
        `, [config.tipo, config.clave, config.valor, config.descripcion]);
      } catch (err) {
        console.log(`⚠️ Configuración ${config.clave} ya existe`);
      }
    }
    console.log('✅ Configuraciones básicas insertadas');
    
    console.log('🎉 ¡Todas las tablas faltantes creadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error creando tablas:', error.message);
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
  createMissingTables()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { createMissingTables };

