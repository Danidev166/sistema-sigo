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

async function fixDashboardFormat() {
  const pool = new Pool(renderConfig);
  
  try {
    console.log('🔧 Solucionando formato del dashboard...\n');
    
    // Como el servidor en Render no se actualizó, vamos a crear una función
    // que devuelva los datos en el formato correcto directamente desde la base de datos
    
    // 1. Obtener todas las métricas necesarias
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
    
    // 2. Crear una tabla temporal o función que devuelva los datos en el formato correcto
    console.log('📊 Datos actuales en la base de datos:');
    console.log(`   - Total Estudiantes: ${estudiantes.rows[0].total}`);
    console.log(`   - Estudiantes Activos: ${estudiantesActivos.rows[0].total}`);
    console.log(`   - Total Entrevistas: ${entrevistas.rows[0].total}`);
    console.log(`   - Entrevistas del Mes: ${entrevistasMes.rows[0].total}`);
    console.log(`   - Total Intervenciones: ${intervenciones.rows[0].total}`);
    console.log(`   - Intervenciones del Mes: ${intervencionesMes.rows[0].total}`);
    console.log(`   - Total Recursos: ${recursos.rows[0].total}`);
    console.log(`   - Promedio Asistencia: ${promedioAsistencia}%`);
    
    // 3. Crear una vista o función que el controlador actual pueda usar
    console.log('\n🔧 Creando función auxiliar para el dashboard...');
    
    // Crear una función que devuelva los datos en el formato correcto
    await pool.query(`
      CREATE OR REPLACE FUNCTION get_dashboard_data()
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
        
        -- Construir el JSON de respuesta
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
    
    console.log('✅ Función auxiliar creada');
    
    // 4. Probar la función
    console.log('\n🧪 Probando la función auxiliar...');
    const testResult = await pool.query('SELECT get_dashboard_data()');
    console.log('📋 Resultado de la función:');
    console.log(JSON.stringify(JSON.parse(testResult.rows[0].get_dashboard_data), null, 2));
    
    console.log('\n✅ Dashboard corregido exitosamente');
    console.log('\n💡 Ahora el controlador puede usar: SELECT get_dashboard_data()');
    
  } catch (error) {
    console.error('❌ Error corrigiendo dashboard:', error.message);
  } finally {
    await pool.end();
  }
}

fixDashboardFormat();
