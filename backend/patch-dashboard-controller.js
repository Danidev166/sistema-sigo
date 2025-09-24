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

async function patchDashboardController() {
  const pool = new Pool(renderConfig);
  
  try {
    console.log('🔧 Aplicando parche al controlador del dashboard...\n');
    
    // Crear una tabla de configuración para el dashboard
    console.log('1. Creando tabla de configuración del dashboard...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dashboard_config (
        id SERIAL PRIMARY KEY,
        config_key VARCHAR(100) UNIQUE NOT NULL,
        config_value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla de configuración creada');
    
    // Insertar la configuración del dashboard
    console.log('2. Insertando configuración del dashboard...');
    const dashboardData = await pool.query('SELECT get_dashboard_data()');
    const configData = dashboardData.rows[0].get_dashboard_data;
    
    await pool.query(`
      INSERT INTO dashboard_config (config_key, config_value) 
      VALUES ('dashboard_data', $1)
      ON CONFLICT (config_key) 
      DO UPDATE SET 
        config_value = EXCLUDED.config_value,
        updated_at = CURRENT_TIMESTAMP
    `, [JSON.stringify(configData)]);
    console.log('✅ Configuración del dashboard insertada');
    
    // Crear un endpoint temporal que devuelva los datos correctos
    console.log('3. Creando endpoint temporal...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION get_dashboard_endpoint()
      RETURNS JSON AS $$
      DECLARE
        result JSON;
      BEGIN
        -- Obtener los datos del dashboard
        SELECT config_value INTO result
        FROM dashboard_config 
        WHERE config_key = 'dashboard_data';
        
        -- Si no hay datos, usar la función directa
        IF result IS NULL THEN
          SELECT get_dashboard_data() INTO result;
        END IF;
        
        RETURN result;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('✅ Endpoint temporal creado');
    
    // Probar el endpoint temporal
    console.log('4. Probando endpoint temporal...');
    const testResult = await pool.query('SELECT get_dashboard_endpoint()');
    const endpointData = testResult.rows[0].get_dashboard_endpoint;
    
    console.log('📋 Datos del endpoint temporal:');
    console.log(JSON.stringify(endpointData, null, 2));
    
    // Crear un trigger para actualizar automáticamente los datos
    console.log('5. Creando trigger de actualización automática...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_dashboard_data()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Actualizar los datos del dashboard cuando cambien las tablas relevantes
        INSERT INTO dashboard_config (config_key, config_value) 
        VALUES ('dashboard_data', get_dashboard_data())
        ON CONFLICT (config_key) 
        DO UPDATE SET 
          config_value = EXCLUDED.config_value,
          updated_at = CURRENT_TIMESTAMP;
        
        RETURN COALESCE(NEW, OLD);
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    // Crear triggers en las tablas relevantes
    const tables = ['estudiantes', 'entrevistas', 'intervenciones', 'asistencia', 'recursos'];
    for (const table of tables) {
      try {
        await pool.query(`
          DROP TRIGGER IF EXISTS update_dashboard_${table} ON ${table};
          CREATE TRIGGER update_dashboard_${table}
          AFTER INSERT OR UPDATE OR DELETE ON ${table}
          FOR EACH STATEMENT
          EXECUTE FUNCTION update_dashboard_data();
        `);
        console.log(`   ✅ Trigger creado para tabla ${table}`);
      } catch (error) {
        console.log(`   ⚠️ No se pudo crear trigger para ${table}: ${error.message}`);
      }
    }
    
    console.log('\n✅ Parche aplicado exitosamente');
    console.log('\n💡 El dashboard ahora debería mostrar datos reales');
    console.log('📊 Datos actuales:');
    console.log(`   - Total Estudiantes: ${endpointData.totalEstudiantes}`);
    console.log(`   - Estudiantes Activos: ${endpointData.estudiantesActivos}`);
    console.log(`   - Entrevistas del Mes: ${endpointData.entrevistasMes}`);
    console.log(`   - Intervenciones del Mes: ${endpointData.intervencionesMes}`);
    console.log(`   - Promedio Asistencia: ${endpointData.promedioAsistencia}%`);
    console.log(`   - Recursos Entregados: ${endpointData.recursosEntregados}`);
    
  } catch (error) {
    console.error('❌ Error aplicando parche:', error.message);
  } finally {
    await pool.end();
  }
}

patchDashboardController();
