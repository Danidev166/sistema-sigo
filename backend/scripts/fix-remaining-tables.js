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

async function fixRemainingTables() {
  let pool;
  
  try {
    console.log('🔧 Arreglando tablas restantes...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // 1. Arreglar tabla movimiento_recursos - agregar columna fecha
    console.log('📋 Arreglando tabla movimiento_recursos...');
    try {
      await pool.query('ALTER TABLE movimiento_recursos ADD COLUMN IF NOT EXISTS fecha TIMESTAMP WITH TIME ZONE');
      await pool.query('ALTER TABLE movimiento_recursos ADD COLUMN IF NOT EXISTS responsable VARCHAR(100)');
      console.log('✅ Tabla movimiento_recursos arreglada');
    } catch (err) {
      console.log('⚠️ Error arreglando movimiento_recursos:', err.message);
    }
    
    // 2. Arreglar tabla historial_academico - agregar columnas faltantes
    console.log('📋 Arreglando tabla historial_academico...');
    try {
      await pool.query('ALTER TABLE historial_academico ADD COLUMN IF NOT EXISTS promedio_general DECIMAL(4,2)');
      await pool.query('ALTER TABLE historial_academico ADD COLUMN IF NOT EXISTS asistencia DECIMAL(5,2)');
      await pool.query('ALTER TABLE historial_academico ADD COLUMN IF NOT EXISTS observaciones_academicas TEXT');
      await pool.query('ALTER TABLE historial_academico ADD COLUMN IF NOT EXISTS fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
      console.log('✅ Tabla historial_academico arreglada');
    } catch (err) {
      console.log('⚠️ Error arreglando historial_academico:', err.message);
    }
    
    // 3. Crear tabla comunicacion_familia si no existe
    console.log('📋 Verificando tabla comunicacion_familia...');
    try {
      const exists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'comunicacion_familia'
        );
      `);
      
      if (!exists.rows[0].exists) {
        await pool.query(`
          CREATE TABLE comunicacion_familia (
            id SERIAL PRIMARY KEY,
            id_estudiante INTEGER REFERENCES estudiantes(id),
            fecha_comunicacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            tipo_comunicacion VARCHAR(50) NOT NULL,
            medio VARCHAR(50),
            asunto VARCHAR(255),
            contenido TEXT,
            responsable_id INTEGER REFERENCES usuarios(id),
            respuesta_familia TEXT,
            estado VARCHAR(50) DEFAULT 'Enviado'
          )
        `);
        console.log('✅ Tabla comunicacion_familia creada');
      } else {
        console.log('✅ Tabla comunicacion_familia ya existe');
      }
    } catch (err) {
      console.log('⚠️ Error con comunicacion_familia:', err.message);
    }
    
    console.log('\n🎉 ¡Tablas restantes arregladas!');
    
  } catch (error) {
    console.error('❌ Error arreglando tablas:', error.message);
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
  fixRemainingTables()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { fixRemainingTables };
