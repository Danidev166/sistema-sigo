// Script para verificar el conteo de entrevistas
const { Pool } = require('pg');

const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

async function checkEntrevistasCount() {
  let pool;
  
  try {
    console.log('🔍 Verificando conteo de entrevistas...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Verificar conteo total
    const countResult = await pool.query('SELECT COUNT(*) FROM entrevistas');
    console.log('📊 Total de entrevistas:', countResult.rows[0].count);
    
    // Verificar el último ID
    const lastIdResult = await pool.query('SELECT MAX(id) FROM entrevistas');
    console.log('📊 Último ID:', lastIdResult.rows[0].max);
    
    // Verificar la secuencia
    const sequenceResult = await pool.query('SELECT last_value FROM entrevistas_id_seq');
    console.log('📊 Valor actual de la secuencia:', sequenceResult.rows[0].last_value);
    
    // Mostrar las últimas 5 entrevistas
    const lastEntrevistas = await pool.query(`
      SELECT id, id_estudiante, motivo, estado, fecha_entrevista 
      FROM entrevistas 
      ORDER BY id DESC 
      LIMIT 5
    `);
    
    console.log('📋 Últimas 5 entrevistas:');
    lastEntrevistas.rows.forEach(entrevista => {
      console.log(`   ID: ${entrevista.id}, Estudiante: ${entrevista.id_estudiante}, Motivo: ${entrevista.motivo}, Estado: ${entrevista.estado}`);
    });
    
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

checkEntrevistasCount();
