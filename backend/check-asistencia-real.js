process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const { getPool } = require('./config/db');

(async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'asistencia' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Columnas de la tabla asistencia:');
    result.recordset.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });
    
    // Verificar algunos valores de ejemplo
    const sampleResult = await pool.request().query(`
      SELECT DISTINCT tipo 
      FROM asistencia 
      LIMIT 10
    `);
    
    console.log('\n📋 Valores de ejemplo en la columna tipo:');
    sampleResult.recordset.forEach(row => {
      console.log(`  tipo: ${row.tipo}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
