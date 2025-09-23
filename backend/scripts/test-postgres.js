// Script para probar la conexión a PostgreSQL
const { Pool } = require('pg');

// Cargar configuración de producción
require('dotenv').config({ path: '.env.production' });

async function testPostgresConnection() {
  let pool;
  
  try {
    console.log('🔌 Probando conexión a PostgreSQL...');
    console.log('📋 Configuración:');
    console.log(`   - DATABASE_URL: ${process.env.DATABASE_URL ? 'Configurada' : 'No configurada'}`);
    console.log(`   - NODE_ENV: ${process.env.NODE_ENV}`);
    
    // Crear pool de conexión
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
    });
    
    // Probar conexión
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Probar consulta simple
    const result = await client.query('SELECT version()');
    console.log('📊 Versión de PostgreSQL:', result.rows[0].version);
    
    // Probar consulta de estudiantes
    const estudiantesResult = await client.query('SELECT COUNT(*) as total FROM estudiantes');
    console.log(`👥 Total estudiantes: ${estudiantesResult.rows[0].total}`);
    
    // Probar consulta de asistencia
    const asistenciaResult = await client.query('SELECT COUNT(*) as total FROM asistencia');
    console.log(`📅 Total registros de asistencia: ${asistenciaResult.rows[0].total}`);
    
    // Probar consulta de entrevistas
    const entrevistasResult = await client.query('SELECT COUNT(*) as total FROM entrevistas');
    console.log(`💬 Total entrevistas: ${entrevistasResult.rows[0].total}`);
    
    // Probar consulta de intervenciones
    const intervencionesResult = await client.query('SELECT COUNT(*) as total FROM intervenciones');
    console.log(`🔧 Total intervenciones: ${intervencionesResult.rows[0].total}`);
    
    // Probar consulta de entrega de recursos
    const recursosResult = await client.query('SELECT COUNT(*) as total FROM entrega_recursos');
    console.log(`📦 Total entregas de recursos: ${recursosResult.rows[0].total}`);
    
    // Probar consulta de historial académico
    const historialResult = await client.query('SELECT COUNT(*) as total FROM historial_academico');
    console.log(`📚 Total registros en historial académico: ${historialResult.rows[0].total}`);
    
    // Probar consulta de asistencia con datos reales
    const asistenciaData = await client.query(`
      SELECT 
        a.id_estudiante,
        e.nombre,
        e.apellido,
        a.fecha,
        a.tipo
      FROM asistencia a
      INNER JOIN estudiantes e ON a.id_estudiante = e.id
      ORDER BY a.fecha DESC
      LIMIT 5
    `);
    
    if (asistenciaData.rows.length > 0) {
      console.log('\n📊 Datos de asistencia encontrados:');
      asistenciaData.rows.forEach(reg => {
        console.log(`   - ${reg.nombre} ${reg.apellido}: ${reg.tipo} el ${reg.fecha}`);
      });
    } else {
      console.log('\n⚠️ No hay datos de asistencia en la base de datos');
    }
    
    client.release();
    console.log('\n🎉 Todas las pruebas pasaron correctamente');
    
  } catch (error) {
    console.error('❌ Error en la conexión:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

testPostgresConnection();
