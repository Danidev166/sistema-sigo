const { Pool } = require('pg');

// Configuración de PostgreSQL para Render
const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

async function testDashboardFunction() {
  const pool = new Pool(renderConfig);
  
  try {
    console.log('🧪 Probando la función del dashboard...\n');
    
    // Probar la función
    const result = await pool.query('SELECT get_dashboard_data()');
    const dashboardData = result.rows[0].get_dashboard_data;
    
    console.log('📋 Datos del dashboard (formato correcto):');
    console.log(JSON.stringify(dashboardData, null, 2));
    
    console.log('\n🎯 Valores que deberían mostrarse en el frontend:');
    console.log(`   - Total Estudiantes: ${dashboardData.totalEstudiantes}`);
    console.log(`   - Estudiantes Activos: ${dashboardData.estudiantesActivos}`);
    console.log(`   - Entrevistas del Mes: ${dashboardData.entrevistasMes}`);
    console.log(`   - Intervenciones del Mes: ${dashboardData.intervencionesMes}`);
    console.log(`   - Promedio Asistencia: ${dashboardData.promedioAsistencia}%`);
    console.log(`   - Recursos Entregados: ${dashboardData.recursosEntregados}`);
    
    console.log('\n✅ Función del dashboard funcionando correctamente');
    
  } catch (error) {
    console.error('❌ Error probando función:', error.message);
  } finally {
    await pool.end();
  }
}

testDashboardFunction();
