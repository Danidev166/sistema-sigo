process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const { getPool } = require('./config/db');

(async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'historial_academico' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Columnas de la tabla historial_academico:');
    result.recordset.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
