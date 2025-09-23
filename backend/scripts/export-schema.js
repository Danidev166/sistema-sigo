const { Pool } = require('pg');

// Configuración de tu base de datos LOCAL
const localConfig = {
  user: 'sitema_sigo',
  host: 'localhost',
  database: 'sistema-sigo',
  password: 'z5blhb00',
  port: 5432,
  ssl: false,
};

async function exportSchema() {
  let pool;
  
  try {
    console.log('🔍 Exportando esquema de la base de datos local...');
    
    pool = new Pool(localConfig);
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL local');
    
    // Obtener todas las tablas
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`📋 Encontradas ${tablesResult.rows.length} tablas:`);
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    let schemaSQL = `-- Esquema completo de la base de datos SIGO
-- Generado automáticamente el ${new Date().toISOString()}

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

`;

    // Para cada tabla, generar el CREATE TABLE
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      
      // Obtener estructura de la tabla
      const columnsResult = await pool.query(`
        SELECT 
          column_name,
          data_type,
          character_maximum_length,
          is_nullable,
          column_default,
          ordinal_position
        FROM information_schema.columns 
        WHERE table_name = $1 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `, [tableName]);
      
      // Obtener claves primarias
      const primaryKeyResult = await pool.query(`
        SELECT column_name
        FROM information_schema.key_column_usage
        WHERE table_name = $1 
        AND table_schema = 'public'
        AND constraint_name LIKE '%_pkey'
        ORDER BY ordinal_position
      `, [tableName]);
      
      // Obtener claves foráneas
      const foreignKeysResult = await pool.query(`
        SELECT 
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = $1
        AND tc.table_schema = 'public'
      `, [tableName]);
      
      // Generar CREATE TABLE
      schemaSQL += `-- Tabla ${tableName}\n`;
      schemaSQL += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
      
      const columnDefinitions = columnsResult.rows.map(col => {
        let definition = `  ${col.column_name} ${col.data_type}`;
        
        if (col.character_maximum_length) {
          definition += `(${col.character_maximum_length})`;
        }
        
        if (col.is_nullable === 'NO') {
          definition += ' NOT NULL';
        }
        
        if (col.column_default) {
          definition += ` DEFAULT ${col.column_default}`;
        }
        
        return definition;
      });
      
      schemaSQL += columnDefinitions.join(',\n');
      
      // Agregar claves primarias
      if (primaryKeyResult.rows.length > 0) {
        const pkColumns = primaryKeyResult.rows.map(row => row.column_name).join(', ');
        schemaSQL += `,\n  PRIMARY KEY (${pkColumns})`;
      }
      
      // Agregar claves foráneas
      foreignKeysResult.rows.forEach(fk => {
        schemaSQL += `,\n  FOREIGN KEY (${fk.column_name}) REFERENCES ${fk.foreign_table_name}(${fk.foreign_column_name})`;
      });
      
      schemaSQL += '\n);\n\n';
      
      // Obtener índices
      const indexesResult = await pool.query(`
        SELECT 
          indexname,
          indexdef
        FROM pg_indexes 
        WHERE tablename = $1 
        AND schemaname = 'public'
        AND indexname NOT LIKE '%_pkey'
      `, [tableName]);
      
      if (indexesResult.rows.length > 0) {
        schemaSQL += `-- Índices para ${tableName}\n`;
        indexesResult.rows.forEach(idx => {
          schemaSQL += `${idx.indexdef};\n`;
        });
        schemaSQL += '\n';
      }
    }
    
    // Escribir archivo
    const fs = require('fs');
    fs.writeFileSync('esquema_completo.sql', schemaSQL);
    
    console.log('✅ Esquema exportado a esquema_completo.sql');
    console.log('📄 Archivo generado con todas las tablas, índices y relaciones');
    
  } catch (error) {
    console.error('❌ Error exportando esquema:', error.message);
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
  exportSchema()
    .then(() => {
      console.log('✅ Exportación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { exportSchema };
