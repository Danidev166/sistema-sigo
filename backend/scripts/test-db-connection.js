// Script para probar la conexión a la base de datos
const { Pool } = require('pg');

// Cargar variables de entorno
require('dotenv').config({ path: '.env.production' });

// Si no se cargan desde .env, usar las variables del sistema
const config = {
  host: process.env.PGHOST || 'dpg-d391d4nfte5s73cff6p0-a',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'sigo_user',
  password: process.env.PGPASSWORD || 'z5blhb00',
  database: process.env.PGDATABASE || 'sigo_pro',
  ssl: false // Desactivar SSL para Render
};

const pool = new Pool(config);

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    console.log('Host:', config.host);
    console.log('Port:', config.port);
    console.log('User:', config.user);
    console.log('Database:', config.database);
    
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Probar una consulta simple
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Consulta exitosa:', result.rows[0]);
    
    // Verificar si existen las tablas principales
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tablas disponibles:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  }
}

testConnection();
