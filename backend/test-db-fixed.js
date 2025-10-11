// Script para probar la conexión a la base de datos con la nueva lógica
const isAzure = !!process.env.WEBSITE_SITE_NAME;
const isRender = !!process.env.RENDER;
const isLocal = !isAzure && !isRender;

console.log('🔧 Detección de entorno:');
console.log('  isAzure:', isAzure);
console.log('  isRender:', isRender);
console.log('  isLocal:', isLocal);

if (isLocal) {
  // Desarrollo local: siempre usar .env
  require("dotenv").config({ path: ".env" });
  console.log(`🔧 Cargando configuración desde .env (desarrollo local)`);
} else if (isRender) {
  // Render: usar .env.production
  require("dotenv").config({ path: ".env.production" });
  console.log(`🔧 Cargando configuración desde .env.production (Render)`);
} else {
  // Azure: usar App Settings
  console.log("🔧 Usando App Settings de Azure (sin .env local)");
}

console.log('\n🔧 Variables de entorno cargadas:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PGHOST:', process.env.PGHOST);
console.log('  PGPORT:', process.env.PGPORT);
console.log('  PGUSER:', process.env.PGUSER);
console.log('  PGPASSWORD:', process.env.PGPASSWORD ? 'CONFIGURADA' : 'NO CONFIGURADA');
console.log('  PGDATABASE:', process.env.PGDATABASE);
console.log('  PG_SSL:', process.env.PG_SSL);

const { getPool } = require('./config/db');

async function testConnection() {
  try {
    console.log('\n🔌 Probando conexión a la base de datos...');
    const pool = await getPool();
    console.log('✅ Pool creado exitosamente');
    
    // Probar una consulta simple
    const result = await pool.request().query('SELECT NOW() as current_time');
    console.log('✅ Consulta exitosa:', result.recordset[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  }
}

testConnection();
