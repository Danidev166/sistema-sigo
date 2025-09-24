const ReportesMejoradoController = require('./controller/reportesMejoradoController');

// Simular request y response
const mockReq = {};
const mockRes = {
  json: (data) => {
    console.log('📋 Respuesta del controlador:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log('\n🎯 Verificación de propiedades:');
    console.log(`   - totalEstudiantes: ${data.totalEstudiantes} ${data.totalEstudiantes ? '✅' : '❌'}`);
    console.log(`   - estudiantesActivos: ${data.estudiantesActivos} ${data.estudiantesActivos ? '✅' : '❌'}`);
    console.log(`   - entrevistasMes: ${data.entrevistasMes} ${data.entrevistasMes ? '✅' : '❌'}`);
    console.log(`   - intervencionesMes: ${data.intervencionesMes} ${data.intervencionesMes ? '✅' : '❌'}`);
    console.log(`   - promedioAsistencia: ${data.promedioAsistencia}% ${data.promedioAsistencia ? '✅' : '❌'}`);
    console.log(`   - recursosEntregados: ${data.recursosEntregados} ${data.recursosEntregados ? '✅' : '❌'}`);
  }
};
const mockNext = (error) => {
  console.error('❌ Error:', error);
};

async function testLocalDashboard() {
  console.log('🧪 Probando controlador local...\n');
  
  try {
    await ReportesMejoradoController.dashboard(mockReq, mockRes, mockNext);
    console.log('\n✅ Controlador local funcionando correctamente');
  } catch (error) {
    console.error('❌ Error en controlador local:', error.message);
  }
}

testLocalDashboard();
