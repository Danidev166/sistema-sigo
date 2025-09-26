const { getPool } = require('./config/db');

async function addAsistenciaColumn() {
  try {
    console.log('🔍 Conectando a la base de datos...');
    const pool = await getPool();
    
    console.log('📋 Verificando si la columna asistencia ya existe...');
    const checkColumn = await pool.raw.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'agenda' AND column_name = 'asistencia'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('✅ La columna asistencia ya existe en la tabla agenda');
      return;
    }
    
    console.log('➕ Agregando columna asistencia a la tabla agenda...');
    await pool.raw.query(`
      ALTER TABLE agenda 
      ADD COLUMN asistencia VARCHAR(20) DEFAULT 'Pendiente'
    `);
    
    console.log('✅ Columna asistencia agregada exitosamente');
    
    // Verificar la estructura actualizada
    console.log('📋 Estructura actualizada de la tabla agenda:');
    const structure = await pool.raw.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'agenda'
      ORDER BY ordinal_position
    `);
    
    console.table(structure.rows);
    
  } catch (error) {
    console.error('❌ Error al agregar columna asistencia:', error);
  } finally {
    process.exit(0);
  }
}

addAsistenciaColumn();