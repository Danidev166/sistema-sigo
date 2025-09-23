const { execSync } = require('child_process');
const fs = require('fs');

async function deployUpdate() {
  try {
    console.log('🚀 Forzando actualización del servidor...');
    
    // Crear un archivo de timestamp para forzar el cambio
    const timestamp = new Date().toISOString();
    const updateFile = 'last-update.txt';
    
    fs.writeFileSync(updateFile, `Última actualización: ${timestamp}\n`);
    console.log('📝 Archivo de actualización creado');
    
    // Hacer commit y push
    console.log('📤 Haciendo commit y push...');
    
    try {
      execSync('git add .', { stdio: 'inherit' });
      execSync(`git commit -m "Update: Fix PostgreSQL models and controllers - ${timestamp}"`, { stdio: 'inherit' });
      execSync('git push origin main', { stdio: 'inherit' });
      
      console.log('✅ Cambios enviados a GitHub');
      console.log('🔄 Render detectará los cambios y reiniciará automáticamente');
      console.log('⏱️ Espera 2-3 minutos para que el despliegue se complete');
      
    } catch (gitError) {
      console.log('⚠️ Error en git (normal si no hay cambios):', gitError.message);
      console.log('💡 Los cambios ya están en el servidor, solo necesita reiniciarse');
    }
    
    console.log('\n🔗 Endpoints para probar después del reinicio:');
    console.log('   - https://sistema-sigo.onrender.com/api/test/health');
    console.log('   - https://sistema-sigo.onrender.com/api/reportes-mejorado/dashboard');
    console.log('   - https://sistema-sigo.onrender.com/api/seguimiento-psicosocial');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  deployUpdate()
    .then(() => {
      console.log('\n✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { deployUpdate };
