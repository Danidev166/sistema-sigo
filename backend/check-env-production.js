const fs = require('fs');

// Leer el archivo .env.production
const envContent = fs.readFileSync('.env.production', 'utf8');

console.log('📋 VARIABLES DEL .env.production');
console.log('================================\n');

// Extraer variables del archivo
const lines = envContent.split('\n');
const variables = {};

lines.forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#') && line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    variables[key.trim()] = value.trim();
  }
});

// Mostrar variables importantes
const importantVars = [
  'DATABASE_URL',
  'PG_SSL',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'REFRESH_TOKEN_SECRET',
  'REFRESH_TOKEN_EXPIRES_IN',
  'MAIL_HOST',
  'MAIL_PORT',
  'MAIL_SECURE',
  'MAIL_USER',
  'MAIL_PASS',
  'MAIL_FROM',
  'NODE_ENV',
  'PORT',
  'API_PREFIX',
  'FRONTEND_URL',
  'FRONTEND_URLS'
];

console.log('🔧 CONFIGURA ESTAS VARIABLES EN RENDER:');
console.log('=======================================\n');

importantVars.forEach(varName => {
  const value = variables[varName];
  if (value) {
    console.log(`${varName}=${value}`);
  }
});

console.log('\n📊 ANÁLISIS:');
console.log('============');

// Verificar DATABASE_URL
if (variables.DATABASE_URL) {
  if (variables.DATABASE_URL.includes('localhost')) {
    console.log('❌ DATABASE_URL: Apunta a localhost (incorrecto para Render)');
    console.log('   Debería ser: postgresql://sigo_user:qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv@dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com/sigo_pro');
  } else if (variables.DATABASE_URL.includes('dpg-d391d4nfte5s73cff6p0-a')) {
    console.log('✅ DATABASE_URL: Apunta a Render (correcto)');
  } else {
    console.log('⚠️  DATABASE_URL: Verificar que sea la URL correcta de Render');
  }
} else {
  console.log('❌ DATABASE_URL: No definida');
}

// Verificar PG_SSL
if (variables.PG_SSL === 'true') {
  console.log('✅ PG_SSL: true (correcto para Render)');
} else if (variables.PG_SSL === 'false') {
  console.log('❌ PG_SSL: false (incorrecto para Render)');
} else {
  console.log('⚠️  PG_SSL: No definida o valor incorrecto');
}

// Verificar JWT_SECRET
if (variables.JWT_SECRET) {
  console.log('✅ JWT_SECRET: Configurado');
} else {
  console.log('❌ JWT_SECRET: No configurado');
}

// Verificar MAIL
if (variables.MAIL_USER && variables.MAIL_PASS) {
  console.log('✅ MAIL: Configurado');
} else {
  console.log('❌ MAIL: No configurado completamente');
}

console.log('\n🚨 PROBLEMA IDENTIFICADO:');
console.log('El .env.production tiene DATABASE_URL=localhost');
console.log('Pero Render necesita la URL real de la base de datos');
console.log('\n💡 SOLUCIÓN:');
console.log('1. Ve a tu dashboard de Render');
console.log('2. Ve a la pestaña "Environment"');
console.log('3. Configura las variables mostradas arriba');
console.log('4. Cambia DATABASE_URL por la URL real de Render');
console.log('5. Cambia PG_SSL a true');
