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

async function testDbConnection() {
  let pool;
  
  try {
    console.log('🔌 Probando conexión a PostgreSQL de Render...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Probar consulta a seguimiento_psicosocial
    console.log('📊 Probando consulta a seguimiento_psicosocial...');
    const result = await pool.query('SELECT COUNT(*) as total FROM seguimiento_psicosocial');
    console.log(`✅ Tabla seguimiento_psicosocial: ${result.rows[0].total} registros`);
    
    // Probar consulta con JOIN
    console.log('📊 Probando consulta con JOIN...');
    const joinResult = await pool.query(`
      SELECT s.*, e.nombre, e.apellido
      FROM seguimiento_psicosocial s
      LEFT JOIN estudiantes e ON s.id_estudiante = e.id
      ORDER BY s.fecha_seguimiento DESC, s.id DESC
    `);
    console.log(`✅ Consulta con JOIN: ${joinResult.rows.length} registros`);
    
    if (joinResult.rows.length > 0) {
      console.log('📋 Primer registro:', joinResult.rows[0]);
    }
    
  } catch (error) {
    console.error('❌ Error en conexión:', error.message);
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
  testDbConnection()
    .then(() => {
      console.log('✅ Prueba completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { testDbConnection };