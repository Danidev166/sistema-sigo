// Script para configurar la base de datos en Render
const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
  host: process.env.PGHOST || 'dpg-d391d4nfte5s73cff6p0-a',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'sigo_user',
  password: process.env.PGPASSWORD || 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  database: process.env.PGDATABASE || 'sigo_pro',
  ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
  try {
    console.log('🔍 Conectando a la base de datos...');
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');

    // Crear tabla usuarios
    console.log('📋 Creando tabla usuarios...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol VARCHAR(50) NOT NULL DEFAULT 'Orientador',
        estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
        reset_token VARCHAR(255),
        reset_token_expiration TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla estudiantes
    console.log('📋 Creando tabla estudiantes...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS estudiantes (
        id SERIAL PRIMARY KEY,
        rut VARCHAR(20) UNIQUE NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        telefono VARCHAR(20),
        curso VARCHAR(50),
        estado VARCHAR(20) DEFAULT 'Activo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla entrevistas
    console.log('📋 Creando tabla entrevistas...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS entrevistas (
        id SERIAL PRIMARY KEY,
        id_estudiante INTEGER REFERENCES estudiantes(id),
        id_orientador INTEGER REFERENCES usuarios(id),
        fecha_entrevista TIMESTAMP NOT NULL,
        motivo VARCHAR(255),
        observaciones TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla evaluaciones_vocacionales
    console.log('📋 Creando tabla evaluaciones_vocacionales...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS evaluaciones_vocacionales (
        id SERIAL PRIMARY KEY,
        id_estudiante INTEGER REFERENCES estudiantes(id),
        tipo_evaluacion VARCHAR(50) NOT NULL,
        resultados TEXT,
        fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        nombre_completo VARCHAR(200),
        curso VARCHAR(50)
      )
    `);

    // Crear tabla asistencia
    console.log('📋 Creando tabla asistencia...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS asistencia (
        id SERIAL PRIMARY KEY,
        id_estudiante INTEGER REFERENCES estudiantes(id),
        fecha DATE NOT NULL,
        presente BOOLEAN DEFAULT false,
        justificacion TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla historial_academico
    console.log('📋 Creando tabla historial_academico...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS historial_academico (
        id SERIAL PRIMARY KEY,
        id_estudiante INTEGER REFERENCES estudiantes(id),
        año INTEGER NOT NULL,
        semestre INTEGER NOT NULL,
        promedio DECIMAL(4,2),
        asistencia DECIMAL(5,2),
        observaciones TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear usuario admin por defecto
    console.log('👤 Creando usuario administrador...');
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await client.query(`
      INSERT INTO usuarios (nombre, apellido, email, password, rol, estado)
      VALUES ('Admin', 'Sistema', 'admin@sigo.com', $1, 'Admin', 'Activo')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);

    // Crear algunos estudiantes de ejemplo
    console.log('👥 Creando estudiantes de ejemplo...');
    await client.query(`
      INSERT INTO estudiantes (rut, nombre, apellido, email, curso, estado)
      VALUES 
        ('12345678-9', 'Juan', 'Pérez', 'juan.perez@email.com', '4° Medio A', 'Activo'),
        ('98765432-1', 'María', 'González', 'maria.gonzalez@email.com', '3° Medio B', 'Activo'),
        ('11223344-5', 'Carlos', 'López', 'carlos.lopez@email.com', '2° Medio A', 'Activo')
      ON CONFLICT (rut) DO NOTHING
    `);

    console.log('✅ Base de datos configurada exitosamente');
    console.log('👤 Usuario admin creado: admin@sigo.com / admin123');
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error configurando base de datos:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  }
}

setupDatabase();
