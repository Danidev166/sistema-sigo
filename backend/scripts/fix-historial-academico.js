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

async function fixHistorialAcademico() {
  let localPool, renderPool;
  
  try {
    console.log('🔧 Arreglando migración de historial_academico...');
    
    // Conectar a PostgreSQL local
    localPool = new Pool(localConfig);
    await localPool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL local');
    
    // Conectar a PostgreSQL de Render
    renderPool = new Pool(renderConfig);
    await renderPool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Obtener datos de historial_academico local
    const dataResult = await localPool.query('SELECT * FROM historial_academico');
    console.log(`📋 Encontrados ${dataResult.rows.length} registros en historial_academico`);
    
    if (dataResult.rows.length > 0) {
      const row = dataResult.rows[0];
      console.log('📋 Datos del registro:', row);
      
      // Insertar con año_academico por defecto
      await renderPool.query(`
        INSERT INTO historial_academico (
          id, id_estudiante, año_academico, curso, promedio, 
          observaciones, responsable_id, fecha_registro,
          promedio_general, asistencia, observaciones_academicas, fecha_actualizacion
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          row.id,
          row.id_estudiante,
          '2024', // año por defecto
          null, // curso
          row.promedio_general,
          row.observaciones_academicas,
          null, // responsable_id
          row.fecha_actualizacion || new Date(),
          row.promedio_general,
          row.asistencia,
          row.observaciones_academicas,
          row.fecha_actualizacion || new Date()
        ]);
      
      console.log('✅ Registro de historial_academico migrado exitosamente');
    }
    
    // Verificar datos migrados
    const countResult = await renderPool.query('SELECT COUNT(*) as total FROM historial_academico');
    console.log(`📋 historial_academico en Render: ${countResult.rows[0].total} registros`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (localPool) await localPool.end();
    if (renderPool) await renderPool.end();
    console.log('🔌 Conexiones cerradas');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixHistorialAcademico()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { fixHistorialAcademico };

