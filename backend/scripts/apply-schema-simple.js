const { Pool } = require('pg');
const fs = require('fs');

// Configuración de PostgreSQL para Render
const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

async function applySchemaSimple() {
  let pool;
  
  try {
    console.log('🚀 Aplicando esquema a la base de datos de Render...');
    console.log('Host:', renderConfig.host);
    console.log('Database:', renderConfig.database);
    console.log('User:', renderConfig.user);
    
    pool = new Pool(renderConfig);
    
    // Probar conexión
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL de Render');
    
    // Leer el archivo de esquema
    const schemaSQL = fs.readFileSync('esquema_completo.sql', 'utf8');
    console.log('📄 Esquema leído desde esquema_completo.sql');
    
    // Ejecutar el SQL completo de una vez
    console.log('📋 Ejecutando esquema completo...');
    
    try {
      await pool.query(schemaSQL);
      console.log('✅ Esquema ejecutado exitosamente');
    } catch (err) {
      console.log('⚠️ Algunos comandos pueden haber fallado, continuando...');
      console.log('Error:', err.message);
    }
    
    // Verificar que las tablas se crearon
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`📋 Tablas creadas en Render: ${tablesResult.rows.length}`);
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Verificar específicamente la tabla usuarios
    const usuariosExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      );
    `);
    
    if (usuariosExists.rows[0].exists) {
      console.log('✅ Tabla usuarios creada exitosamente');
      
      // Verificar estructura
      const structureResult = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `);
      
      console.log('📊 Estructura de la tabla usuarios:');
      structureResult.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
      
      // Verificar si hay usuarios
      const countResult = await pool.query('SELECT COUNT(*) as total FROM usuarios');
      console.log(`👥 Total de usuarios: ${countResult.rows[0].total}`);
      
    } else {
      console.log('❌ Error: Tabla usuarios no se creó');
    }
    
    console.log('🎉 Proceso completado!');
    
  } catch (error) {
    console.error('❌ Error aplicando esquema:', error.message);
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
  applySchemaSimple()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { applySchemaSimple };
