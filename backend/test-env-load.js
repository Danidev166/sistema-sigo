// Script simple para probar la carga del archivo .env
console.log('🔧 Antes de cargar .env:');
console.log('  PGHOST:', process.env.PGHOST);
console.log('  PGUSER:', process.env.PGUSER);

console.log('\n🔧 Cargando .env...');
require('dotenv').config({ path: '.env' });

console.log('\n🔧 Después de cargar .env:');
console.log('  PGHOST:', process.env.PGHOST);
console.log('  PGUSER:', process.env.PGUSER);
console.log('  PGPASSWORD:', process.env.PGPASSWORD ? 'CONFIGURADA' : 'NO CONFIGURADA');
console.log('  PGDATABASE:', process.env.PGDATABASE);

console.log('\n🔧 Verificando archivo .env...');
const fs = require('fs');
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  console.log('✅ Archivo .env leído exitosamente');
  console.log('📄 Contenido:');
  console.log(envContent);
} catch (error) {
  console.error('❌ Error leyendo .env:', error.message);
}
