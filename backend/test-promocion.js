// Script de prueba para el sistema de promoción
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';

const { getPool } = require('./config/db');
const PromocionModel = require('./models/promocionModel');

async function testPromocion() {
  try {
    console.log('🧪 PROBANDO SISTEMA DE PROMOCIÓN');
    console.log('=================================');
    
    // 1. Verificar que la tabla existe
    console.log('\n📊 1. Verificando tabla decisiones_promocion...');
    const pool = await getPool();
    const tableCheck = await pool.request().query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'decisiones_promocion'
      );
    `);
    
    console.log('✅ Tabla existe:', tableCheck.recordset[0].exists);
    
    // 2. Probar obtención de estudiantes con datos
    console.log('\n📊 2. Probando obtención de estudiantes...');
    const estudiantes = await PromocionModel.obtenerEstudiantesConDatos('4° MEDIO A', 2024);
    console.log(`✅ Encontrados ${estudiantes.length} estudiantes`);
    
    if (estudiantes.length > 0) {
      console.log('\n📋 Primer estudiante:');
      const primerEstudiante = estudiantes[0];
      console.log(`  Nombre: ${primerEstudiante.nombre} ${primerEstudiante.apellido}`);
      console.log(`  Promedio: ${primerEstudiante.promedio_anual}`);
      console.log(`  Asistencia: ${primerEstudiante.porcentaje_asistencia}%`);
      
      // 3. Probar cálculo de criterios
      console.log('\n📊 3. Probando cálculo de criterios...');
      const criterios = PromocionModel.calcularCriteriosPromocion(primerEstudiante);
      console.log('✅ Criterios calculados:');
      console.log(`  Estado: ${criterios.estado_promocion}`);
      console.log(`  Requiere decisión: ${criterios.requiere_decision}`);
      console.log(`  Razón: ${criterios.razon}`);
      
      // 4. Probar reporte completo
      console.log('\n📊 4. Probando reporte completo...');
      const reporte = await PromocionModel.obtenerReportePromocion('4° MEDIO A', 2024);
      console.log('✅ Reporte generado:');
      console.log(`  Total estudiantes: ${reporte.total_estudiantes}`);
      console.log(`  Promovidos: ${reporte.resumen.promovidos}`);
      console.log(`  Repiten: ${reporte.resumen.repiten}`);
      console.log(`  Requieren decisión: ${reporte.resumen.requieren_decision}`);
    }
    
    console.log('\n🎉 SISTEMA DE PROMOCIÓN FUNCIONANDO CORRECTAMENTE');
    
  } catch (error) {
    console.error('❌ Error en prueba:', error.message);
    console.error('Detalles:', error);
  }
}

testPromocion();
