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

async function fixTableStructure() {
  let pool;
  
  try {
    console.log('🔧 Arreglando estructura de tablas en Render...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // 1. Arreglar tabla recursos - agregar columna tipo_recurso
    console.log('📋 Arreglando tabla recursos...');
    try {
      await pool.query('ALTER TABLE recursos ADD COLUMN IF NOT EXISTS tipo_recurso VARCHAR(50)');
      await pool.query('ALTER TABLE recursos ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0');
      console.log('✅ Tabla recursos arreglada');
    } catch (err) {
      console.log('⚠️ Error arreglando recursos:', err.message);
    }
    
    // 2. Arreglar tabla evaluaciones_vocacionales - cambiar estudiante_id
    console.log('📋 Arreglando tabla evaluaciones_vocacionales...');
    try {
      await pool.query('ALTER TABLE evaluaciones_vocacionales RENAME COLUMN estudiante_id TO id_estudiante');
      await pool.query('ALTER TABLE evaluaciones_vocacionales ADD COLUMN IF NOT EXISTS fecha_evaluacion TIMESTAMP WITH TIME ZONE');
      await pool.query('ALTER TABLE evaluaciones_vocacionales ADD COLUMN IF NOT EXISTS nombre_completo VARCHAR(200)');
      await pool.query('ALTER TABLE evaluaciones_vocacionales ADD COLUMN IF NOT EXISTS curso VARCHAR(50)');
      console.log('✅ Tabla evaluaciones_vocacionales arreglada');
    } catch (err) {
      console.log('⚠️ Error arreglando evaluaciones:', err.message);
    }
    
    // 3. Arreglar tabla entrevistas - cambiar estudiante_id
    console.log('📋 Arreglando tabla entrevistas...');
    try {
      await pool.query('ALTER TABLE entrevistas RENAME COLUMN estudiante_id TO id_estudiante');
      await pool.query('ALTER TABLE entrevistas ADD COLUMN IF NOT EXISTS id_orientador INTEGER REFERENCES usuarios(id)');
      console.log('✅ Tabla entrevistas arreglada');
    } catch (err) {
      console.log('⚠️ Error arreglando entrevistas:', err.message);
    }
    
    // 4. Arreglar tabla logs_actividad - cambiar usuario_id
    console.log('📋 Arreglando tabla logs_actividad...');
    try {
      await pool.query('ALTER TABLE logs_actividad RENAME COLUMN usuario_id TO id_usuario');
      await pool.query('ALTER TABLE logs_actividad ADD COLUMN IF NOT EXISTS id_registro INTEGER');
      await pool.query('ALTER TABLE logs_actividad ADD COLUMN IF NOT EXISTS datos_anteriores TEXT');
      await pool.query('ALTER TABLE logs_actividad ADD COLUMN IF NOT EXISTS datos_nuevos TEXT');
      await pool.query('ALTER TABLE logs_actividad ADD COLUMN IF NOT EXISTS user_agent TEXT');
      await pool.query('ALTER TABLE logs_actividad ADD COLUMN IF NOT EXISTS fecha_accion TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
      console.log('✅ Tabla logs_actividad arreglada');
    } catch (err) {
      console.log('⚠️ Error arreglando logs:', err.message);
    }
    
    // 5. Verificar estructura final
    console.log('\n📊 Verificando estructura final de las tablas...');
    
    const tables = ['recursos', 'evaluaciones_vocacionales', 'entrevistas', 'logs_actividad'];
    
    for (const tableName of tables) {
      try {
        const structureResult = await pool.query(`
          SELECT column_name, data_type
          FROM information_schema.columns 
          WHERE table_name = $1 
          AND table_schema = 'public'
          ORDER BY ordinal_position
        `, [tableName]);
        
        console.log(`\n📋 Estructura de ${tableName}:`);
        structureResult.rows.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type}`);
        });
      } catch (err) {
        console.log(`⚠️ Error verificando ${tableName}:`, err.message);
      }
    }
    
    console.log('\n🎉 ¡Estructura de tablas arreglada!');
    
  } catch (error) {
    console.error('❌ Error arreglando estructura:', error.message);
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
  fixTableStructure()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { fixTableStructure };

