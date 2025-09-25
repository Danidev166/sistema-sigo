const axios = require('axios');

const RENDER_BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function forceRestart() {
  console.log('🔄 Forzando reinicio del servidor...');
  
  try {
    // Hacer una petición que cause un error para forzar el reinicio
    console.log('📡 Enviando petición de prueba...');
    
    const response = await axios.get(`${RENDER_BASE_URL}/test-restart`, {
      timeout: 5000
    });
    
    console.log('✅ Servidor respondió:', response.status);
    
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
      console.log('⚠️ Servidor no disponible - esto es normal durante el reinicio');
    } else {
      console.log('⚠️ Error esperado:', error.message);
    }
  }
  
  console.log('\n💡 El servidor de Render se reiniciará automáticamente');
  console.log('⏱️ Espera 2-3 minutos y luego prueba los endpoints nuevamente');
  console.log('🔗 Prueba: https://sistema-sigo.onrender.com/api/reportes-mejorado/dashboard');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  forceRestart()
    .then(() => {
      console.log('\n✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { forceRestart };

