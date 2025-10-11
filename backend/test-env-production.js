// Test para verificar carga de .env.production
require('dotenv').config({ path: '.env.production' });

console.log('🔧 Variables desde .env.production:');
console.log('PGPASSWORD:', process.env.PGPASSWORD ? 'CONFIGURADA' : 'NO CONFIGURADA');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'CONFIGURADA' : 'NO CONFIGURADA');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'CONFIGURADA' : 'NO CONFIGURADA');
console.log('NODE_ENV:', process.env.NODE_ENV);
