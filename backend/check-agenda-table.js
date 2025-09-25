// Script para verificar la tabla agenda
const { Pool } = require('pg');

const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

async function checkAgendaTable() {
  let pool;
  
  try {
    console.log('🔍 Verificando tabla agenda...');
    
    pool = new Pool(renderConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Verificar si la tabla existe
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'agenda'
      );
    `);
    
    console.log('📋 Tabla agenda existe:', tableExists.rows[0].exists);
    
    if (tableExists.rows[0].exists) {
      // Verificar estructura de la tabla
      const structure = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'agenda'
        ORDER BY ordinal_position;
      `);
      
      console.log('📋 Estructura de la tabla agenda:');
      structure.rows.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
      });
      
      // Verificar si hay datos
      const count = await pool.query('SELECT COUNT(*) FROM agenda');
      console.log('📊 Total de registros en agenda:', count.rows[0].count);
      
      // Probar la consulta que está fallando
      console.log('🧪 Probando consulta de agenda...');
      try {
        const result = await pool.query(`
          SELECT 
            a.*,
            COALESCE(e.nombre, 'Sin nombre') as nombre_estudiante,
            COALESCE(e.apellido, '') as apellido_estudiante,
            COALESCE(e.curso, 'Sin curso') as curso,
            'Pendiente' as estado,
            'Citación' as tipo,
            'Sin observaciones' as observaciones,
            'Pendiente' as asistencia
          FROM agenda a
          LEFT JOIN estudiantes e ON a.id_estudiante = e.id
          ORDER BY a.fecha DESC
          LIMIT 50
        `);
        
        console.log('✅ Consulta exitosa:', result.rows.length, 'registros');
        if (result.rows.length > 0) {
          console.log('📋 Primer registro:', result.rows[0]);
        }
      } catch (queryError) {
        console.error('❌ Error en consulta:', queryError.message);
        console.error('❌ Stack trace:', queryError.stack);
      }
    } else {
      console.log('❌ La tabla agenda no existe');
    }
    
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

checkAgendaTable();
