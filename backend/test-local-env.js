/**
 * Script para probar la configuración local
 */

require('dotenv').config({ path: '.env' });

console.log('🔧 Cargando configuración desde .env (desarrollo local)');
console.log('📊 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada ✅' : 'No configurada ❌');
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);

if (process.env.DATABASE_URL) {
  console.log('🔗 URL:', process.env.DATABASE_URL.substring(0, 50) + '...');
  
  // Probar conexión
  const { Pool } = require('pg');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  pool.query('SELECT NOW()')
    .then(result => {
      console.log('✅ Conexión exitosa a la base de datos de Render');
      console.log('🕐 Hora del servidor:', result.rows[0].now);
      
      // Verificar si hay apoderados
      return pool.query(`
        SELECT COUNT(*) as total_apoderados 
        FROM estudiantes 
        WHERE email_apoderado IS NOT NULL 
        AND email_apoderado != ''
      `);
    })
    .then(result => {
      console.log('👥 Total de apoderados:', result.rows[0].total_apoderados);
      console.log('🎉 ¡Ahora tu desarrollo local usa los mismos datos que producción!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error de conexión:', error.message);
      process.exit(1);
    });
} else {
  console.log('❌ DATABASE_URL no configurada en .env');
  process.exit(1);
}

