// Script para debuggear el problema de comunicacion-familia
require('dotenv').config({ path: '.env.production' });

console.log('🔧 Verificando configuración completa...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'No configurado');
console.log('MAIL_USER:', process.env.MAIL_USER);
console.log('MAIL_PASS:', process.env.MAIL_PASS ? 'Configurado' : 'No configurado');

// Verificar si las variables de email están configuradas
const emailConfig = {
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS ? 'Configurado' : 'No configurado',
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE === 'true'
};

console.log('\n📧 Configuración de email:');
console.log(JSON.stringify(emailConfig, null, 2));

// Verificar variables de base de datos
const dbConfig = {
  url: process.env.DATABASE_URL ? 'Configurado' : 'No configurado',
  ssl: process.env.PG_SSL
};

console.log('\n🗄️ Configuración de base de datos:');
console.log(JSON.stringify(dbConfig, null, 2));

// Verificar variables requeridas
const requiredVars = ['MAIL_USER', 'MAIL_PASS', 'MAIL_HOST', 'MAIL_PORT', 'DATABASE_URL'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('\n❌ Variables faltantes:', missingVars);
} else {
  console.log('\n✅ Todas las variables requeridas están configuradas');
}

console.log('\n🧪 Probando conexión a base de datos...');
const { Pool } = require('pg');

async function testDatabase() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false
    });
    
    const client = await pool.connect();
    console.log('✅ Conexión a base de datos exitosa');
    
    // Verificar tabla comunicacion_familia
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'comunicacion_familia'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Estructura de tabla comunicacion_familia:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error de base de datos:', error.message);
  }
}

testDatabase();
