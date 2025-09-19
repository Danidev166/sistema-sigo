const sql = require('mssql');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración SQL Server (origen)
const sqlServerConfig = {
  user: process.env.SQL_SERVER_USER || 'sa',
  password: process.env.SQL_SERVER_PASSWORD || 'TuPassword123',
  server: process.env.SQL_SERVER_HOST || 'localhost',
  database: process.env.SQL_SERVER_DB || 'SIGO',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Configuración PostgreSQL (destino)
const postgresConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sigo_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// Esquema de tablas a migrar
const tables = [
  'Usuarios',
  'Estudiantes', 
  'Recursos',
  'Entregas_Recursos',
  'Movimientos_Recursos',
  'Evaluaciones_Vocacionales',
  'Entrevistas',
  'Agenda',
  'Historial_Academico',
  'Seguimiento_Psicosocial',
  'Asistencia',
  'Seguimiento_Academico',
  'Comunicacion_Familia',
  'Intervenciones',
  'Conducta',
  'Configuracion_Sistema',
  'Alertas',
  'Comunicacion_Interna',
  'Logs_Actividad',
  'Notificaciones',
  'Permisos_Roles',
  'Plantillas_Reportes',
  'Seguimiento_Cronologico'
];

// Función para crear el esquema en PostgreSQL
const createPostgresSchema = async (pgPool) => {
  console.log('🏗️ Creando esquema en PostgreSQL...');
  
  const schemaSQL = `
    -- Crear base de datos si no existe
    CREATE DATABASE sigo_db;
    
    -- Usar la base de datos
    \\c sigo_db;
    
    -- Crear extensiones necesarias
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Tabla Usuarios
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      rol VARCHAR(50) NOT NULL DEFAULT 'Orientador',
      activo BOOLEAN DEFAULT true,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Tabla Estudiantes
    CREATE TABLE IF NOT EXISTS estudiantes (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      apellido VARCHAR(100) NOT NULL,
      rut VARCHAR(20) UNIQUE NOT NULL,
      email VARCHAR(100),
      telefono VARCHAR(20),
      direccion TEXT,
      fecha_nacimiento DATE,
      curso VARCHAR(50),
      especialidad VARCHAR(100),
      situacion_economica VARCHAR(50),
      estado VARCHAR(50) DEFAULT 'Activo',
      nombre_apoderado VARCHAR(100),
      telefono_apoderado VARCHAR(20),
      email_apoderado VARCHAR(100),
      fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Tabla Recursos
    CREATE TABLE IF NOT EXISTS recursos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT,
      categoria VARCHAR(50),
      cantidad_disponible INTEGER DEFAULT 0,
      cantidad_total INTEGER DEFAULT 0,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      activo BOOLEAN DEFAULT true
    );
    
    -- Tabla Evaluaciones Vocacionales
    CREATE TABLE IF NOT EXISTS evaluaciones_vocacionales (
      id SERIAL PRIMARY KEY,
      estudiante_id INTEGER REFERENCES estudiantes(id),
      tipo_evaluacion VARCHAR(50) NOT NULL,
      fecha_aplicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      resultados JSONB,
      completada BOOLEAN DEFAULT false,
      creado_por INTEGER REFERENCES usuarios(id)
    );
    
    -- Tabla Entrevistas
    CREATE TABLE IF NOT EXISTS entrevistas (
      id SERIAL PRIMARY KEY,
      estudiante_id INTEGER REFERENCES estudiantes(id),
      fecha_entrevista TIMESTAMP NOT NULL,
      tipo_entrevista VARCHAR(50),
      motivo TEXT,
      observaciones TEXT,
      profesional_id INTEGER REFERENCES usuarios(id),
      estado VARCHAR(50) DEFAULT 'Programada'
    );
    
    -- Tabla Logs de Actividad
    CREATE TABLE IF NOT EXISTS logs_actividad (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER REFERENCES usuarios(id),
      accion VARCHAR(100) NOT NULL,
      tabla_afectada VARCHAR(50),
      registro_id INTEGER,
      detalles JSONB,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ip_address INET
    );
    
    -- Índices para mejorar rendimiento
    CREATE INDEX IF NOT EXISTS idx_estudiantes_rut ON estudiantes(rut);
    CREATE INDEX IF NOT EXISTS idx_estudiantes_curso ON estudiantes(curso);
    CREATE INDEX IF NOT EXISTS idx_evaluaciones_estudiante ON evaluaciones_vocacionales(estudiante_id);
    CREATE INDEX IF NOT EXISTS idx_entrevistas_estudiante ON entrevistas(estudiante_id);
    CREATE INDEX IF NOT EXISTS idx_logs_usuario ON logs_actividad(usuario_id);
    CREATE INDEX IF NOT EXISTS idx_logs_fecha ON logs_actividad(fecha);
  `;
  
  try {
    await pgPool.query(schemaSQL);
    console.log('✅ Esquema creado exitosamente');
  } catch (err) {
    console.error('❌ Error creando esquema:', err.message);
    throw err;
  }
};

// Función para migrar datos de una tabla
const migrateTable = async (tableName, sqlServerPool, pgPool) => {
  console.log(`🔄 Migrando tabla: ${tableName}`);
  
  try {
    // Obtener datos de SQL Server
    const result = await sqlServerPool.request().query(`SELECT * FROM ${tableName}`);
    const rows = result.recordset;
    
    if (rows.length === 0) {
      console.log(`⚠️ Tabla ${tableName} está vacía, saltando...`);
      return;
    }
    
    console.log(`📊 Encontrados ${rows.length} registros en ${tableName}`);
    
    // Insertar datos en PostgreSQL
    for (const row of rows) {
      const columns = Object.keys(row);
      const values = Object.values(row);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
      
      const insertSQL = `
        INSERT INTO ${tableName.toLowerCase()} (${columns.join(', ')})
        VALUES (${placeholders})
        ON CONFLICT DO NOTHING
      `;
      
      try {
        await pgPool.query(insertSQL, values);
      } catch (err) {
        console.error(`❌ Error insertando registro en ${tableName}:`, err.message);
        // Continuar con el siguiente registro
      }
    }
    
    console.log(`✅ Tabla ${tableName} migrada exitosamente`);
  } catch (err) {
    console.error(`❌ Error migrando tabla ${tableName}:`, err.message);
  }
};

// Función principal de migración
const migrate = async () => {
  let sqlServerPool, pgPool;
  
  try {
    console.log('🚀 Iniciando migración de SQL Server a PostgreSQL...');
    
    // Conectar a SQL Server
    console.log('🔌 Conectando a SQL Server...');
    sqlServerPool = await sql.connect(sqlServerConfig);
    console.log('✅ Conectado a SQL Server');
    
    // Conectar a PostgreSQL
    console.log('🔌 Conectando a PostgreSQL...');
    pgPool = new Pool(postgresConfig);
    await pgPool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL');
    
    // Crear esquema
    await createPostgresSchema(pgPool);
    
    // Migrar cada tabla
    for (const table of tables) {
      try {
        await migrateTable(table, sqlServerPool, pgPool);
      } catch (err) {
        console.error(`❌ Error con tabla ${table}:`, err.message);
      }
    }
    
    console.log('🎉 Migración completada exitosamente!');
    
  } catch (err) {
    console.error('❌ Error durante la migración:', err.message);
  } finally {
    // Cerrar conexiones
    if (sqlServerPool) {
      await sqlServerPool.close();
      console.log('🔌 Conexión SQL Server cerrada');
    }
    if (pgPool) {
      await pgPool.end();
      console.log('🔌 Conexión PostgreSQL cerrada');
    }
  }
};

// Ejecutar migración si se llama directamente
if (require.main === module) {
  migrate();
}

module.exports = { migrate };
