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

async function applySchemaToRender() {
  let pool;
  
  try {
    console.log('🚀 Aplicando esquema completo a la base de datos de Render...');
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
    
    // Dividir el SQL en comandos individuales
    const commands = schemaSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
      .sort((a, b) => {
        // Priorizar CREATE TABLE antes que CREATE INDEX
        if (a.includes('CREATE TABLE') && b.includes('CREATE INDEX')) return -1;
        if (a.includes('CREATE INDEX') && b.includes('CREATE TABLE')) return 1;
        return 0;
      });
    
    console.log(`📋 Ejecutando ${commands.length} comandos SQL...`);
    
    // Ejecutar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          await pool.query(command);
          console.log(`✅ Comando ${i + 1}/${commands.length} ejecutado`);
        } catch (err) {
          // Si es un error de "ya existe", lo ignoramos
          if (err.code === '42P07' || err.message.includes('already exists')) {
            console.log(`⚠️ Comando ${i + 1}/${commands.length} ya existe (ignorado)`);
          } else {
            console.error(`❌ Error en comando ${i + 1}/${commands.length}:`, err.message);
            console.error(`SQL: ${command.substring(0, 100)}...`);
          }
        }
      }
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
    } else {
      console.log('❌ Error: Tabla usuarios no se creó');
    }
    
    console.log('🎉 Esquema aplicado exitosamente a Render!');
    
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
  applySchemaToRender()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { applySchemaToRender };
