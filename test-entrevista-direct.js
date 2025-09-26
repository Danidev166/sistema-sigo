// Script para probar directamente la funcionalidad de entrevistas
const { Pool } = require('pg');

const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

async function testEntrevistaDirect() {
  let pool;
  
  try {
    console.log('🔍 Probando funcionalidad de entrevistas directamente...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // 1. Obtener agenda
    console.log('📅 Obteniendo agenda...');
    const agendaResult = await pool.query('SELECT * FROM agenda WHERE id = $1', [2]);
    const agenda = agendaResult.rows[0];
    
    if (!agenda) {
      console.log('❌ No se encontró agenda con ID 2');
      return;
    }
    
    console.log('📋 Agenda encontrada:', agenda);
    
    // 2. Crear entrevista
    console.log('📝 Creando entrevista...');
    const fechaHora = new Date(`${agenda.fecha}T${agenda.hora}`);
    
    const entrevistaData = {
      id_estudiante: agenda.id_estudiante,
      id_orientador: 122, // ID del usuario de prueba
      fecha_entrevista: fechaHora,
      motivo: agenda.motivo,
      observaciones: 'Prueba de observaciones',
      conclusiones: 'Prueba de conclusiones',
      acciones_acordadas: 'Prueba de acciones',
      estado: 'realizada'
    };
    
    const insertQuery = `
      INSERT INTO entrevistas
        (id_estudiante, id_orientador, fecha_entrevista, motivo, observaciones, conclusiones, acciones_acordadas, estado)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      entrevistaData.id_estudiante,
      entrevistaData.id_orientador,
      entrevistaData.fecha_entrevista,
      entrevistaData.motivo,
      entrevistaData.observaciones,
      entrevistaData.conclusiones,
      entrevistaData.acciones_acordadas,
      entrevistaData.estado
    ];
    
    const result = await pool.query(insertQuery, values);
    console.log('✅ Entrevista creada:', result.rows[0]);
    
    // 3. Marcar agenda como realizada
    console.log('📝 Marcando agenda como realizada...');
    await pool.query(`
      UPDATE agenda
         SET motivo = motivo || ' (Registrada)'
       WHERE id = $1
    `, [2]);
    
    console.log('✅ Agenda marcada como realizada');
    
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

testEntrevistaDirect();

