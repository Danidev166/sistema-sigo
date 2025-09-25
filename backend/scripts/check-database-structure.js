const { Pool } = require('pg');

// Configuración de PostgreSQL para Render
const postgresConfig = {
  user: process.env.PGUSER || process.env.DB_USER,
  host: process.env.PGHOST || process.env.DB_HOST,
  database: process.env.PGDATABASE || process.env.DB_NAME,
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
  port: process.env.PGPORT || process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

async function checkDatabaseStructure() {
  let pool;
  
  try {
    console.log('🔍 Verificando estructura de la base de datos...');
    console.log('Host:', postgresConfig.host);
    console.log('Database:', postgresConfig.database);
    console.log('User:', postgresConfig.user);
    
    pool = new Pool(postgresConfig);
    
    // Probar conexión
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL');
    
    // Verificar todas las tablas
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tablas disponibles:');
    if (tablesResult.rows.length === 0) {
      console.log('❌ No hay tablas en la base de datos');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }
    
    // Verificar específicamente la tabla usuarios
    const usuariosExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      );
    `);
    
    if (usuariosExists.rows[0].exists) {
      console.log('✅ Tabla usuarios existe');
      
      // Verificar estructura de la tabla usuarios
      const structureResult = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `);
      
      console.log('📊 Estructura de la tabla usuarios:');
      structureResult.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      
      // Verificar si hay usuarios
      const countResult = await pool.query('SELECT COUNT(*) as total FROM usuarios');
      console.log(`👥 Total de usuarios: ${countResult.rows[0].total}`);
      
      // Mostrar algunos usuarios de ejemplo
      if (countResult.rows[0].total > 0) {
        const sampleResult = await pool.query('SELECT id, nombre, email, rol, estado FROM usuarios LIMIT 3');
        console.log('👤 Usuarios de ejemplo:');
        sampleResult.rows.forEach(user => {
          console.log(`  - ${user.email} (${user.nombre}) - Rol: ${user.rol} - Estado: ${user.estado}`);
        });
      }
      
    } else {
      console.log('❌ Tabla usuarios NO existe');
    }
    
    // Verificar esquemas
    const schemasResult = await pool.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name
    `);
    
    console.log('📁 Esquemas disponibles:');
    schemasResult.rows.forEach(row => {
      console.log(`  - ${row.schema_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  checkDatabaseStructure()
    .then(() => {
      console.log('✅ Verificación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { checkDatabaseStructure };

