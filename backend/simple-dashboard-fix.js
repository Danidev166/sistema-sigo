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

async function simpleDashboardFix() {
  const pool = new Pool(renderConfig);
  
  try {
    console.log('🔧 Aplicando solución simple al dashboard...\n');
    
    // Crear una función que devuelva los datos en el formato que el frontend espera
    console.log('1. Creando función simple del dashboard...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION get_dashboard_simple()
      RETURNS JSON AS $$
      DECLARE
        result JSON;
        total_estudiantes INTEGER;
        estudiantes_activos INTEGER;
        total_entrevistas INTEGER;
        entrevistas_mes INTEGER;
        total_intervenciones INTEGER;
        intervenciones_mes INTEGER;
        total_recursos INTEGER;
        promedio_asistencia INTEGER;
      BEGIN
        -- Obtener total de estudiantes
        SELECT COUNT(*) INTO total_estudiantes FROM estudiantes;
        
        -- Obtener estudiantes activos
        SELECT COUNT(*) INTO estudiantes_activos FROM estudiantes WHERE estado = 'Activo';
        
        -- Obtener total de entrevistas
        SELECT COUNT(*) INTO total_entrevistas FROM entrevistas;
        
        -- Obtener entrevistas del mes
        SELECT COUNT(*) INTO entrevistas_mes FROM entrevistas 
        WHERE EXTRACT(YEAR FROM fecha_entrevista) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND EXTRACT(MONTH FROM fecha_entrevista) = EXTRACT(MONTH FROM CURRENT_DATE);
        
        -- Obtener total de intervenciones
        SELECT COUNT(*) INTO total_intervenciones FROM intervenciones;
        
        -- Obtener intervenciones del mes
        SELECT COUNT(*) INTO intervenciones_mes FROM intervenciones 
        WHERE EXTRACT(YEAR FROM fecha_intervencion) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND EXTRACT(MONTH FROM fecha_intervencion) = EXTRACT(MONTH FROM CURRENT_DATE);
        
        -- Obtener total de recursos
        SELECT COUNT(*) INTO total_recursos FROM recursos;
        
        -- Calcular promedio de asistencia
        SELECT 
          CASE 
            WHEN COUNT(*) > 0 THEN 
              ROUND((COUNT(CASE WHEN tipo = 'Presente' THEN 1 END)::FLOAT / COUNT(*)) * 100)
            ELSE 0 
          END
        INTO promedio_asistencia
        FROM asistencia 
        WHERE EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE);
        
        -- Construir el JSON de respuesta en el formato que espera el frontend
        result := json_build_object(
          'totalEstudiantes', total_estudiantes,
          'estudiantesActivos', estudiantes_activos,
          'entrevistas', total_entrevistas,
          'entrevistasMes', entrevistas_mes,
          'intervenciones', total_intervenciones,
          'intervencionesMes', intervenciones_mes,
          'recursos', total_recursos,
          'recursosEntregados', total_recursos,
          'promedioAsistencia', promedio_asistencia,
          'timestamp', NOW()::TEXT
        );
        
        RETURN result;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('✅ Función simple creada');
    
    // Probar la función
    console.log('2. Probando función simple...');
    const testResult = await pool.query('SELECT get_dashboard_simple()');
    const dashboardData = testResult.rows[0].get_dashboard_simple;
    
    console.log('📋 Datos del dashboard (formato frontend):');
    console.log(JSON.stringify(dashboardData, null, 2));
    
    console.log('\n🎯 Valores que deberían mostrarse en el frontend:');
    console.log(`   - Total Estudiantes: ${dashboardData.totalEstudiantes}`);
    console.log(`   - Estudiantes Activos: ${dashboardData.estudiantesActivos}`);
    console.log(`   - Entrevistas del Mes: ${dashboardData.entrevistasMes}`);
    console.log(`   - Intervenciones del Mes: ${dashboardData.intervencionesMes}`);
    console.log(`   - Promedio Asistencia: ${dashboardData.promedioAsistencia}%`);
    console.log(`   - Recursos Entregados: ${dashboardData.recursosEntregados}`);
    
    console.log('\n✅ Solución simple aplicada exitosamente');
    console.log('\n💡 El controlador debe usar: SELECT get_dashboard_simple()');
    
  } catch (error) {
    console.error('❌ Error aplicando solución simple:', error.message);
  } finally {
    await pool.end();
  }
}

simpleDashboardFix();
