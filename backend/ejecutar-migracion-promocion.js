// Script para ejecutar migración de promoción
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';

const { getPool } = require('./config/db');
const fs = require('fs');

async function ejecutarMigracion() {
  try {
    console.log('🔄 Ejecutando migración de promoción...');
    
    const pool = await getPool();
    const sql = fs.readFileSync('./migrations/create_decisiones_promocion.sql', 'utf8');
    
    // Dividir el SQL en comandos individuales
    const comandos = sql.split(';').filter(cmd => cmd.trim());
    
    for (const comando of comandos) {
      if (comando.trim()) {
        console.log('📝 Ejecutando:', comando.trim().substring(0, 50) + '...');
        await pool.raw.query(comando.trim());
      }
    }
    
    console.log('✅ Migración ejecutada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en migración:', error.message);
    console.error('Detalles:', error);
  }
}

ejecutarMigracion();
