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

async function createTablesStepByStep() {
  let pool;
  
  try {
    console.log('🚀 Creando tablas paso a paso en Render...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // 1. Crear extensiones
    console.log('📋 Creando extensiones...');
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ Extensiones creadas');
    
    // 2. Crear tabla usuarios primero (sin dependencias)
    console.log('📋 Creando tabla usuarios...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        rut VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password TEXT NOT NULL,
        rol VARCHAR(30) NOT NULL,
        estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
        fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        reset_token TEXT,
        reset_token_expiration TIMESTAMP WITH TIME ZONE
      )
    `);
    console.log('✅ Tabla usuarios creada');
    
    // 3. Crear tabla estudiantes
    console.log('📋 Creando tabla estudiantes...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS estudiantes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        rut VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        telefono VARCHAR(20),
        direccion TEXT,
        fecha_nacimiento DATE,
        curso VARCHAR(50),
        especialidad VARCHAR(100),
        situacion_economica VARCHAR(50),
        estado VARCHAR(50) DEFAULT 'Activo',
        nombre_apoderado VARCHAR(100),
        telefono_apoderado VARCHAR(20),
        email_apoderado VARCHAR(255),
        fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla estudiantes creada');
    
    // 4. Crear tabla recursos
    console.log('📋 Creando tabla recursos...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recursos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        categoria VARCHAR(50),
        cantidad_disponible INTEGER DEFAULT 0,
        cantidad_total INTEGER DEFAULT 0,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        activo BOOLEAN DEFAULT true
      )
    `);
    console.log('✅ Tabla recursos creada');
    
    // 5. Crear tabla evaluaciones_vocacionales
    console.log('📋 Creando tabla evaluaciones_vocacionales...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS evaluaciones_vocacionales (
        id SERIAL PRIMARY KEY,
        estudiante_id INTEGER REFERENCES estudiantes(id),
        tipo_evaluacion VARCHAR(50) NOT NULL,
        fecha_aplicacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        resultados JSONB,
        completada BOOLEAN DEFAULT false,
        creado_por INTEGER REFERENCES usuarios(id)
      )
    `);
    console.log('✅ Tabla evaluaciones_vocacionales creada');
    
    // 6. Crear tabla entrevistas
    console.log('📋 Creando tabla entrevistas...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS entrevistas (
        id SERIAL PRIMARY KEY,
        estudiante_id INTEGER REFERENCES estudiantes(id),
        fecha_entrevista TIMESTAMP WITH TIME ZONE NOT NULL,
        tipo_entrevista VARCHAR(50),
        motivo TEXT,
        observaciones TEXT,
        profesional_id INTEGER REFERENCES usuarios(id),
        estado VARCHAR(50) DEFAULT 'Programada'
      )
    `);
    console.log('✅ Tabla entrevistas creada');
    
    // 7. Crear tabla logs_actividad
    console.log('📋 Creando tabla logs_actividad...');
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
    
    // 8. Crear índices
    console.log('📋 Creando índices...');
    await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS usuarios_rut_key ON usuarios(rut)');
    await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS usuarios_email_key ON usuarios(email)');
    await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS estudiantes_rut_key ON estudiantes(rut)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_estudiantes_curso ON estudiantes(curso)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_evaluaciones_estudiante ON evaluaciones_vocacionales(estudiante_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_entrevistas_estudiante ON entrevistas(estudiante_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_logs_usuario ON logs_actividad(usuario_id)');
    console.log('✅ Índices creados');
    
    // Verificar tablas creadas
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`📋 Tablas creadas en Render: ${tablesResult.rows.length}`);
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Verificar tabla usuarios específicamente
    const usuariosExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      );
    `);
    
    if (usuariosExists.rows[0].exists) {
      console.log('✅ Tabla usuarios verificada');
      
      // Verificar estructura
      const structureResult = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `);
      
      console.log('📊 Estructura de la tabla usuarios:');
      structureResult.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
    }
    
    console.log('🎉 ¡Todas las tablas principales creadas exitosamente!');
    
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
  createTablesStepByStep()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { createTablesStepByStep };

