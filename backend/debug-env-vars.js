console.log('🔍 Variables de entorno actuales:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'CONFIGURADA' : 'NO CONFIGURADA');
console.log('PGHOST:', process.env.PGHOST);
console.log('PGUSER:', process.env.PGUSER);
console.log('PGPASSWORD:', process.env.PGPASSWORD ? 'CONFIGURADA' : 'NO CONFIGURADA');
console.log('PGDATABASE:', process.env.PGDATABASE);

// Cargar dotenv
require('dotenv').config({ path: '.env.production' });

console.log('\n🔍 Después de cargar .env.production:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'CONFIGURADA' : 'NO CONFIGURADA');
console.log('PGHOST:', process.env.PGHOST);
console.log('PGUSER:', process.env.PGUSER);
console.log('PGPASSWORD:', process.env.PGPASSWORD ? 'CONFIGURADA' : 'NO CONFIGURADA');
console.log('PGDATABASE:', process.env.PGDATABASE);
