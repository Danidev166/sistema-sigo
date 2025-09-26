// Script para corregir la secuencia de entrevistas
const { Pool } = require('pg');

const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

async function fixEntrevistasSequence() {
  let pool;
  
  try {
    console.log('🔧 Corrigiendo secuencia de entrevistas...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Obtener el último ID
    const lastIdResult = await pool.query('SELECT MAX(id) FROM entrevistas');
    const lastId = lastIdResult.rows[0].max;
    console.log('📊 Último ID encontrado:', lastId);
    
    // Corregir la secuencia
    await pool.query(`SELECT setval('entrevistas_id_seq', $1)`, [lastId]);
    console.log('✅ Secuencia corregida a:', lastId);
    
    // Verificar que la secuencia esté correcta
    const sequenceResult = await pool.query('SELECT last_value FROM entrevistas_id_seq');
    console.log('📊 Nuevo valor de la secuencia:', sequenceResult.rows[0].last_value);
    
    // Probar insertar una nueva entrevista
    console.log('🧪 Probando inserción...');
    const testResult = await pool.query(`
      INSERT INTO entrevistas
        (id_estudiante, id_orientador, fecha_entrevista, motivo, observaciones, conclusiones, acciones_acordadas, estado)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      1, // id_estudiante
      122, // id_orientador
      new Date(), // fecha_entrevista
      'Prueba de secuencia', // motivo
      'Observaciones de prueba', // observaciones
      'Conclusiones de prueba', // conclusiones
      'Acciones de prueba', // acciones_acordadas
      'realizada' // estado
    ]);
    
    console.log('✅ Entrevista de prueba creada con ID:', testResult.rows[0].id);
    
    // Eliminar la entrevista de prueba
    await pool.query('DELETE FROM entrevistas WHERE id = $1', [testResult.rows[0].id]);
    console.log('✅ Entrevista de prueba eliminada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack trace:', error.stack);
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

fixEntrevistasSequence();

