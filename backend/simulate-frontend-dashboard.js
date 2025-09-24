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

async function simulateFrontendDashboard() {
  const pool = new Pool(renderConfig);
  
  try {
    console.log('🔍 Simulando datos del dashboard para el frontend...\n');
    
    // Obtener estadísticas generales (igual que el controlador actualizado)
    const estudiantesQuery = 'SELECT COUNT(*) as total FROM estudiantes';
    const estudiantesActivosQuery = 'SELECT COUNT(*) as total FROM estudiantes WHERE estado = \'Activo\'';
    const entrevistasQuery = 'SELECT COUNT(*) as total FROM entrevistas';
    const entrevistasMesQuery = `
      SELECT COUNT(*) as total FROM entrevistas 
      WHERE EXTRACT(YEAR FROM fecha_entrevista) = EXTRACT(YEAR FROM CURRENT_DATE)
      AND EXTRACT(MONTH FROM fecha_entrevista) = EXTRACT(MONTH FROM CURRENT_DATE)
    `;
    const intervencionesQuery = 'SELECT COUNT(*) as total FROM intervenciones';
    const intervencionesMesQuery = `
      SELECT COUNT(*) as total FROM intervenciones 
      WHERE EXTRACT(YEAR FROM fecha_intervencion) = EXTRACT(YEAR FROM CURRENT_DATE)
      AND EXTRACT(MONTH FROM fecha_intervencion) = EXTRACT(MONTH FROM CURRENT_DATE)
    `;
    const recursosQuery = 'SELECT COUNT(*) as total FROM recursos';
    const asistenciaQuery = `
      SELECT 
        COUNT(CASE WHEN tipo = 'Presente' THEN 1 END) as presentes,
        COUNT(*) as total
      FROM asistencia 
      WHERE EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
      AND EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
    `;
    
    const [
      estudiantes, 
      estudiantesActivos, 
      entrevistas, 
      entrevistasMes, 
      intervenciones, 
      intervencionesMes, 
      recursos, 
      asistencia
    ] = await Promise.all([
      pool.query(estudiantesQuery),
      pool.query(estudiantesActivosQuery),
      pool.query(entrevistasQuery),
      pool.query(entrevistasMesQuery),
      pool.query(intervencionesQuery),
      pool.query(intervencionesMesQuery),
      pool.query(recursosQuery),
      pool.query(asistenciaQuery)
    ]);
    
    // Calcular promedio de asistencia
    const totalAsistencia = parseInt(asistencia.rows[0].total) || 0;
    const presentesAsistencia = parseInt(asistencia.rows[0].presentes) || 0;
    const promedioAsistencia = totalAsistencia > 0 ? Math.round((presentesAsistencia / totalAsistencia) * 100) : 0;
    
    // Datos en el formato que espera el frontend
    const dashboardData = {
      totalEstudiantes: parseInt(estudiantes.rows[0].total) || 0,
      estudiantesActivos: parseInt(estudiantesActivos.rows[0].total) || 0,
      entrevistas: parseInt(entrevistas.rows[0].total) || 0,
      entrevistasMes: parseInt(entrevistasMes.rows[0].total) || 0,
      intervenciones: parseInt(intervenciones.rows[0].total) || 0,
      intervencionesMes: parseInt(intervencionesMes.rows[0].total) || 0,
      recursos: parseInt(recursos.rows[0].total) || 0,
      recursosEntregados: parseInt(recursos.rows[0].total) || 0,
      promedioAsistencia: promedioAsistencia,
      timestamp: new Date().toISOString()
    };
    
    console.log('📊 Datos del dashboard (formato frontend):');
    console.log(JSON.stringify(dashboardData, null, 2));
    
    console.log('\n🎯 Valores que deberían mostrarse en el frontend:');
    console.log(`   - Total Estudiantes: ${dashboardData.totalEstudiantes}`);
    console.log(`   - Estudiantes Activos: ${dashboardData.estudiantesActivos}`);
    console.log(`   - Entrevistas del Mes: ${dashboardData.entrevistasMes}`);
    console.log(`   - Intervenciones del Mes: ${dashboardData.intervencionesMes}`);
    console.log(`   - Promedio Asistencia: ${dashboardData.promedioAsistencia}%`);
    console.log(`   - Recursos Entregados: ${dashboardData.recursosEntregados}`);
    
    console.log('\n✅ Simulación completada');
    
  } catch (error) {
    console.error('❌ Error en simulación:', error.message);
  } finally {
    await pool.end();
  }
}

simulateFrontendDashboard();
