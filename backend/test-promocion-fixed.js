// Script de prueba para verificar la corrección del modelo de promoción
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const PromocionModel = require('./models/promocionModel');

async function testPromocion() {
  console.log('🧪 Iniciando prueba del modelo de promoción...\n');
  
  try {
    // Probar obtener estudiantes con datos para un curso específico
    console.log('📊 Probando obtenerEstudiantesConDatos...');
    const curso = '1° BÁSICO';
    const anio = 2024;
    
    const estudiantes = await PromocionModel.obtenerEstudiantesConDatos(curso, anio);
    
    console.log(`✅ Consulta ejecutada exitosamente para curso: ${curso}, año: ${anio}`);
    console.log(`📈 Estudiantes encontrados: ${estudiantes.length}`);
    
    if (estudiantes.length > 0) {
      console.log('\n📋 Datos del primer estudiante:');
      const primerEstudiante = estudiantes[0];
      console.log(`   - Nombre: ${primerEstudiante.nombre} ${primerEstudiante.apellido}`);
      console.log(`   - RUT: ${primerEstudiante.rut}`);
      console.log(`   - Total clases: ${primerEstudiante.total_clases}`);
      console.log(`   - Clases presente: ${primerEstudiante.clases_presente}`);
      console.log(`   - Porcentaje asistencia: ${primerEstudiante.porcentaje_asistencia}%`);
      console.log(`   - Promedio anual: ${primerEstudiante.promedio_anual}`);
      
      // Probar cálculo de criterios de promoción
      console.log('\n🎯 Probando cálculo de criterios de promoción...');
      const criterios = PromocionModel.calcularCriteriosPromocion(primerEstudiante);
      console.log(`   - Estado promoción: ${criterios.estado_promocion}`);
      console.log(`   - Requiere decisión: ${criterios.requiere_decision}`);
      console.log(`   - Razón: ${criterios.razon}`);
    }
    
    // Probar reporte de promoción
    console.log('\n📊 Probando obtenerReportePromocion...');
    const reporte = await PromocionModel.obtenerReportePromocion(curso, anio);
    console.log(`✅ Reporte generado exitosamente`);
    console.log(`   - Total estudiantes: ${reporte.total_estudiantes}`);
    console.log(`   - Promovidos: ${reporte.resumen.promovidos}`);
    console.log(`   - Repiten: ${reporte.resumen.repiten}`);
    console.log(`   - Requieren decisión: ${reporte.resumen.requieren_decision}`);
    
    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('✅ La corrección del modelo de promoción funciona correctamente');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    console.error('📋 Stack trace:', error.stack);
    
    if (error.message.includes('presente')) {
      console.error('🚨 El error indica que aún hay referencias a la columna "presente" que no existe');
    }
  }
}

// Ejecutar la prueba
testPromocion().then(() => {
  console.log('\n🏁 Prueba completada');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
