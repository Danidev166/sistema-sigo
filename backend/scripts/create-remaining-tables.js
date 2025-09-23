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

async function createRemainingTables() {
  let pool;
  
  try {
    console.log('🚀 Creando tablas faltantes para reportes, movimientos y seguimiento...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // 1. Tabla movimiento_recursos
    console.log('📋 Creando tabla movimiento_recursos...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movimiento_recursos (
        id SERIAL PRIMARY KEY,
        id_recurso INTEGER REFERENCES recursos(id),
        id_estudiante INTEGER REFERENCES estudiantes(id),
        tipo_movimiento VARCHAR(50) NOT NULL,
        cantidad INTEGER NOT NULL,
        fecha_movimiento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        motivo TEXT,
        responsable_id INTEGER REFERENCES usuarios(id),
        observaciones TEXT
      )
    `);
    console.log('✅ Tabla movimiento_recursos creada');
    
    // 2. Tabla entrega_recursos
    console.log('📋 Creando tabla entrega_recursos...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS entrega_recursos (
        id SERIAL PRIMARY KEY,
        id_recurso INTEGER REFERENCES recursos(id),
        id_estudiante INTEGER REFERENCES estudiantes(id),
        cantidad_entregada INTEGER NOT NULL,
        fecha_entrega TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        fecha_devolucion TIMESTAMP WITH TIME ZONE,
        estado VARCHAR(50) DEFAULT 'Entregado',
        responsable_id INTEGER REFERENCES usuarios(id),
        observaciones TEXT
      )
    `);
    console.log('✅ Tabla entrega_recursos creada');
    
    // 3. Tabla seguimiento_psicosocial
    console.log('📋 Creando tabla seguimiento_psicosocial...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seguimiento_psicosocial (
        id SERIAL PRIMARY KEY,
        id_estudiante INTEGER REFERENCES estudiantes(id),
        fecha_seguimiento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        tipo_seguimiento VARCHAR(50) NOT NULL,
        observaciones TEXT,
        recomendaciones TEXT,
        profesional_id INTEGER REFERENCES usuarios(id),
        estado VARCHAR(50) DEFAULT 'Activo',
        proxima_cita TIMESTAMP WITH TIME ZONE
      )
    `);
    console.log('✅ Tabla seguimiento_psicosocial creada');
    
    // 4. Tabla seguimiento_academico
    console.log('📋 Creando tabla seguimiento_academico...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seguimiento_academico (
        id SERIAL PRIMARY KEY,
        id_estudiante INTEGER REFERENCES estudiantes(id),
        fecha_seguimiento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        rendimiento VARCHAR(50),
        asistencia_porcentaje DECIMAL(5,2),
        observaciones TEXT,
        recomendaciones TEXT,
        responsable_id INTEGER REFERENCES usuarios(id),
        periodo VARCHAR(50)
      )
    `);
    console.log('✅ Tabla seguimiento_academico creada');
    
    // 5. Tabla asistencia
    console.log('📋 Creando tabla asistencia...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS asistencia (
        id SERIAL PRIMARY KEY,
        id_estudiante INTEGER REFERENCES estudiantes(id),
        fecha DATE NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        justificacion TEXT,
        responsable_id INTEGER REFERENCES usuarios(id),
        observaciones TEXT
      )
    `);
    console.log('✅ Tabla asistencia creada');
    
    // 6. Tabla comunicacion_familia
    console.log('📋 Creando tabla comunicacion_familia...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comunicacion_familia (
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
    
    // 7. Tabla intervenciones
    console.log('📋 Creando tabla intervenciones...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS intervenciones (
        id SERIAL PRIMARY KEY,
        id_estudiante INTEGER REFERENCES estudiantes(id),
        fecha_intervencion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        tipo_intervencion VARCHAR(50) NOT NULL,
        descripcion TEXT,
        objetivo TEXT,
        responsable_id INTEGER REFERENCES usuarios(id),
        estado VARCHAR(50) DEFAULT 'Programada',
        resultado TEXT,
        fecha_finalizacion TIMESTAMP WITH TIME ZONE
      )
    `);
    console.log('✅ Tabla intervenciones creada');
    
    // 8. Tabla conducta
    console.log('📋 Creando tabla conducta...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS conducta (
        id SERIAL PRIMARY KEY,
        id_estudiante INTEGER REFERENCES estudiantes(id),
        fecha_incidente TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        tipo_conducta VARCHAR(50) NOT NULL,
        descripcion TEXT,
        gravedad VARCHAR(20),
        medidas_tomadas TEXT,
        responsable_id INTEGER REFERENCES usuarios(id),
        testigos TEXT,
        seguimiento TEXT
      )
    `);
    console.log('✅ Tabla conducta creada');
    
    // 9. Tabla historial_academico
    console.log('📋 Creando tabla historial_academico...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS historial_academico (
        id SERIAL PRIMARY KEY,
        id_estudiante INTEGER REFERENCES estudiantes(id),
        año_academico VARCHAR(10) NOT NULL,
        curso VARCHAR(50),
        promedio DECIMAL(4,2),
        observaciones TEXT,
        responsable_id INTEGER REFERENCES usuarios(id),
        fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla historial_academico creada');
    
    // 10. Tabla seguimiento
    console.log('📋 Creando tabla seguimiento...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seguimiento (
        id SERIAL PRIMARY KEY,
        id_estudiante INTEGER REFERENCES estudiantes(id),
        fecha_seguimiento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        tipo_seguimiento VARCHAR(50) NOT NULL,
        observaciones TEXT,
        recomendaciones TEXT,
        responsable_id INTEGER REFERENCES usuarios(id),
        estado VARCHAR(50) DEFAULT 'Activo',
        proxima_fecha TIMESTAMP WITH TIME ZONE
      )
    `);
    console.log('✅ Tabla seguimiento creada');
    
    // 11. Tabla seguimiento_cronologico
    console.log('📋 Creando tabla seguimiento_cronologico...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seguimiento_cronologico (
        id SERIAL PRIMARY KEY,
        id_estudiante INTEGER REFERENCES estudiantes(id),
        fecha_evento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        tipo_evento VARCHAR(50) NOT NULL,
        descripcion TEXT,
        responsable_id INTEGER REFERENCES usuarios(id),
        observaciones TEXT
      )
    `);
    console.log('✅ Tabla seguimiento_cronologico creada');
    
    // 12. Tabla plantillas_reportes
    console.log('📋 Creando tabla plantillas_reportes...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS plantillas_reportes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        tipo_reporte VARCHAR(50) NOT NULL,
        contenido TEXT,
        configuracion JSONB,
        activa BOOLEAN DEFAULT true,
        creado_por INTEGER REFERENCES usuarios(id),
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla plantillas_reportes creada');
    
    // Crear índices para mejorar rendimiento
    console.log('📋 Creando índices...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_movimiento_recursos_estudiante ON movimiento_recursos(id_estudiante)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_movimiento_recursos_fecha ON movimiento_recursos(fecha_movimiento)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_entrega_recursos_estudiante ON entrega_recursos(id_estudiante)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_seguimiento_psicosocial_estudiante ON seguimiento_psicosocial(id_estudiante)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_seguimiento_academico_estudiante ON seguimiento_academico(id_estudiante)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_asistencia_estudiante ON asistencia(id_estudiante)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_asistencia_fecha ON asistencia(fecha)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_comunicacion_familia_estudiante ON comunicacion_familia(id_estudiante)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_intervenciones_estudiante ON intervenciones(id_estudiante)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_conducta_estudiante ON conducta(id_estudiante)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_historial_academico_estudiante ON historial_academico(id_estudiante)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_seguimiento_estudiante ON seguimiento(id_estudiante)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_seguimiento_cronologico_estudiante ON seguimiento_cronologico(id_estudiante)');
    console.log('✅ Índices creados');
    
    // Verificar tablas creadas
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`\n📋 Total de tablas en Render: ${tablesResult.rows.length}`);
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    console.log('\n🎉 ¡Todas las tablas faltantes creadas exitosamente!');
    
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
  createRemainingTables()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { createRemainingTables };
