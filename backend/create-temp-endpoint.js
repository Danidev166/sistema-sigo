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

async function createTempEndpoint() {
  const pool = new Pool(renderConfig);
  
  try {
    console.log('🔧 Creando endpoint temporal para el dashboard...\n');
    
    // Crear una tabla que simule un endpoint temporal
    console.log('1. Creando tabla de endpoint temporal...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS temp_dashboard_endpoint (
        id SERIAL PRIMARY KEY,
        endpoint_name VARCHAR(100) UNIQUE NOT NULL,
        response_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla temporal creada');
    
    // Insertar los datos del dashboard en el formato correcto
    console.log('2. Insertando datos del dashboard...');
    const dashboardData = await pool.query('SELECT get_dashboard_final()');
    const correctData = dashboardData.rows[0].get_dashboard_final;
    
    await pool.query(`
      INSERT INTO temp_dashboard_endpoint (endpoint_name, response_data) 
      VALUES ('dashboard', $1)
      ON CONFLICT (endpoint_name) 
      DO UPDATE SET 
        response_data = EXCLUDED.response_data,
        updated_at = CURRENT_TIMESTAMP
    `, [JSON.stringify(correctData)]);
    console.log('✅ Datos del dashboard insertados');
    
    // Crear una función que devuelva los datos de la tabla temporal
    console.log('3. Creando función de endpoint temporal...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION get_temp_dashboard()
      RETURNS JSON AS $$
      DECLARE
        result JSON;
      BEGIN
        SELECT response_data INTO result
        FROM temp_dashboard_endpoint 
        WHERE endpoint_name = 'dashboard';
        
        RETURN result;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('✅ Función temporal creada');
    
    // Probar la función temporal
    console.log('4. Probando función temporal...');
    const testResult = await pool.query('SELECT get_temp_dashboard()');
    const tempData = testResult.rows[0].get_temp_dashboard;
    
    console.log('📋 Datos del endpoint temporal:');
    console.log(JSON.stringify(tempData, null, 2));
    
    console.log('\n🎯 Verificación de propiedades:');
    console.log(`   - totalEstudiantes: ${tempData.totalEstudiantes} ${tempData.totalEstudiantes ? '✅' : '❌'}`);
    console.log(`   - estudiantesActivos: ${tempData.estudiantesActivos} ${tempData.estudiantesActivos ? '✅' : '❌'}`);
    console.log(`   - entrevistasMes: ${tempData.entrevistasMes} ${tempData.entrevistasMes ? '✅' : '❌'}`);
    console.log(`   - intervencionesMes: ${tempData.intervencionesMes} ${tempData.intervencionesMes ? '✅' : '❌'}`);
    console.log(`   - promedioAsistencia: ${tempData.promedioAsistencia}% ${tempData.promedioAsistencia ? '✅' : '❌'}`);
    console.log(`   - recursosEntregados: ${tempData.recursosEntregados} ${tempData.recursosEntregados ? '✅' : '❌'}`);
    
    console.log('\n✅ Endpoint temporal creado exitosamente');
    console.log('\n💡 Ahora puedes probar:');
    console.log('1. Ve a tu aplicación frontend');
    console.log('2. Abre las herramientas de desarrollador (F12)');
    console.log('3. Ve a la pestaña Network');
    console.log('4. Recarga la página de reportes');
    console.log('5. Busca la petición a /api/reportes-mejorado/dashboard');
    console.log('6. Verifica si ahora devuelve los datos correctos');
    
  } catch (error) {
    console.error('❌ Error creando endpoint temporal:', error.message);
  } finally {
    await pool.end();
  }
}

createTempEndpoint();
