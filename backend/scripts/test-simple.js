// Script simple para probar la conexión a la base de datos
const { getPool } = require('../config/db');

async function testConnection() {
  try {
    console.log('🔌 Probando conexión a la base de datos...');
    const pool = await getPool();
    
    // Probar consulta simple
    const result = await pool.request().query('SELECT COUNT(*) as total FROM estudiantes');
    console.log('✅ Conexión exitosa');
    console.log(`📊 Total estudiantes: ${result.recordset[0].total}`);
    
    // Probar consulta de historial académico
    const historialResult = await pool.request().query('SELECT COUNT(*) as total FROM historial_academico');
    console.log(`📚 Total registros en historial académico: ${historialResult.recordset[0].total}`);
    
    // Probar consulta de entrevistas
    const entrevistasResult = await pool.request().query('SELECT COUNT(*) as total FROM entrevistas');
    console.log(`💬 Total entrevistas: ${entrevistasResult.recordset[0].total}`);
    
    // Probar consulta de intervenciones
    const intervencionesResult = await pool.request().query('SELECT COUNT(*) as total FROM intervenciones');
    console.log(`🔧 Total intervenciones: ${intervencionesResult.recordset[0].total}`);
    
    // Probar consulta de entrega de recursos
    const recursosResult = await pool.request().query('SELECT COUNT(*) as total FROM entrega_recursos');
    console.log(`📦 Total entregas de recursos: ${recursosResult.recordset[0].total}`);
    
    console.log('🎉 Todas las consultas funcionaron correctamente');
    
  } catch (error) {
    console.error('❌ Error en la conexión:', error.message);
  }
}

testConnection();
