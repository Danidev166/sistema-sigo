const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando archivo .env.production...');

const envPath = path.join(__dirname, '.env.production');

// Verificar si el archivo existe
if (fs.existsSync(envPath)) {
  console.log('✅ Archivo .env.production existe');
  
  // Leer el contenido
  const content = fs.readFileSync(envPath, 'utf8');
  console.log('📄 Contenido del archivo:');
  console.log(content);
  
  // Probar cargar con dotenv
  require('dotenv').config({ path: envPath });
  console.log('\n🔧 Variables cargadas:');
  console.log('PGPASSWORD:', process.env.PGPASSWORD ? 'CONFIGURADA' : 'NO CONFIGURADA');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'CONFIGURADA' : 'NO CONFIGURADA');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'CONFIGURADA' : 'NO CONFIGURADA');
} else {
  console.log('❌ Archivo .env.production NO existe');
}
