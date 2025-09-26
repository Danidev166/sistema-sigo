// Script para migrar columnas de apoderado
const axios = require('axios');

async function migrateApoderado() {
  try {
    console.log('🔄 Iniciando migración de columnas de apoderado...');
    
    const response = await axios.post('https://sistema-sigo-backend.onrender.com/api/migrate-apoderado', {});
    
    console.log('✅ Migración completada:', response.data);
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.response?.data || error.message);
  }
}

migrateApoderado();
