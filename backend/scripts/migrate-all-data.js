const { Pool } = require('pg');

// Configuración PostgreSQL LOCAL (origen)
const localConfig = {
  user: 'sitema_sigo',
  host: 'localhost',
  database: 'sistema-sigo',
  password: 'z5blhb00',
  port: 5432,
  ssl: false,
};

// Configuración PostgreSQL RENDER (destino)
const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

async function migrateAllData() {
  let localPool, renderPool;
  
  try {
    console.log('🚀 Migrando todos los datos de local a Render...');
    
    // Conectar a PostgreSQL local
    console.log('🔌 Conectando a PostgreSQL local...');
    localPool = new Pool(localConfig);
    await localPool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL local');
    
    // Conectar a PostgreSQL de Render
    console.log('🔌 Conectando a PostgreSQL de Render...');
    renderPool = new Pool(renderConfig);
    await renderPool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Lista de tablas a migrar (en orden de dependencias)
    const tablesToMigrate = [
      'estudiantes',
      'recursos', 
      'alertas',
      'notificaciones',
      'agenda',
      'evaluaciones_vocacionales',
      'entrevistas',
      'logs_actividad',
      'configuracion'
    ];
    
    for (const tableName of tablesToMigrate) {
      try {
        console.log(`\n📊 Migrando tabla: ${tableName}`);
        
        // Verificar si la tabla existe en local
        const tableExists = await localPool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `, [tableName]);
        
        if (!tableExists.rows[0].exists) {
          console.log(`⚠️ Tabla ${tableName} no existe en local, saltando...`);
          continue;
        }
        
        // Obtener datos de la tabla local
        const dataResult = await localPool.query(`SELECT * FROM ${tableName}`);
        console.log(`📋 Encontrados ${dataResult.rows.length} registros en ${tableName}`);
        
        if (dataResult.rows.length === 0) {
          console.log(`⚠️ Tabla ${tableName} está vacía, saltando...`);
          continue;
        }
        
        // Obtener estructura de la tabla
        const structureResult = await localPool.query(`
          SELECT column_name, data_type
          FROM information_schema.columns 
          WHERE table_name = $1 
          AND table_schema = 'public'
          ORDER BY ordinal_position
        `, [tableName]);
        
        const columns = structureResult.rows.map(col => col.column_name);
        console.log(`📋 Columnas: ${columns.join(', ')}`);
        
        // Migrar datos
        let migrated = 0;
        let errors = 0;
        
        for (const row of dataResult.rows) {
          try {
            const values = columns.map(col => row[col]);
            const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
            
            const insertSQL = `
              INSERT INTO ${tableName} (${columns.join(', ')})
              VALUES (${placeholders})
              ON CONFLICT (id) DO UPDATE SET
                ${columns.filter(col => col !== 'id').map(col => `${col} = EXCLUDED.${col}`).join(', ')}
            `;
            
            await renderPool.query(insertSQL, values);
            migrated++;
            
          } catch (err) {
            console.error(`❌ Error insertando registro en ${tableName}:`, err.message);
            errors++;
          }
        }
        
        console.log(`✅ ${tableName}: ${migrated} migrados, ${errors} errores`);
        
      } catch (err) {
        console.error(`❌ Error migrando tabla ${tableName}:`, err.message);
      }
    }
    
    // Verificar datos migrados
    console.log('\n📊 Verificando datos migrados...');
    
    for (const tableName of tablesToMigrate) {
      try {
        const countResult = await renderPool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
        console.log(`📋 ${tableName}: ${countResult.rows[0].total} registros`);
      } catch (err) {
        console.log(`⚠️ ${tableName}: Error al contar registros`);
      }
    }
    
    console.log('\n🎉 ¡Migración de datos completada!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    throw error;
  } finally {
    // Cerrar conexiones
    if (localPool) {
      await localPool.end();
      console.log('🔌 Conexión local cerrada');
    }
    if (renderPool) {
      await renderPool.end();
      console.log('🔌 Conexión Render cerrada');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  migrateAllData()
    .then(() => {
      console.log('✅ Migración completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en migración:', error);
      process.exit(1);
    });
}

module.exports = { migrateAllData };

