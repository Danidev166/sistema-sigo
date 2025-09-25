// Script para insertar datos de ejemplo en citaciones
const { getPool, sql } = require('./config/db');

async function insertarDatosCitaciones() {
  try {
    const pool = await getPool();
    
    // Primero verificar si ya existen datos
    const checkQuery = await pool.request().query('SELECT COUNT(*) as count FROM agenda');
    const existingCount = checkQuery.recordset[0].count;
    
    if (existingCount > 0) {
      console.log(`✅ Ya existen ${existingCount} registros en agenda`);
      return;
    }
    
    // Obtener un estudiante existente para las citaciones
    const estudianteQuery = await pool.request().query('SELECT id, nombre, apellido, curso FROM estudiantes LIMIT 1');
    const estudiante = estudianteQuery.recordset[0];
    
    if (!estudiante) {
      console.log('❌ No hay estudiantes en la base de datos');
      return;
    }
    
    console.log(`📝 Insertando citaciones para estudiante: ${estudiante.nombre} ${estudiante.apellido}`);
    
    // Insertar citaciones de ejemplo
    const citaciones = [
      {
        id_estudiante: estudiante.id,
        fecha: '2024-12-20',
        hora: '10:00:00',
        motivo: 'Reunión de seguimiento académico',
        profesional: 'Dr. María González',
        email_orientador: 'maria.gonzalez@colegio.cl',
        observaciones: 'Revisar progreso en matemáticas y ciencias',
        estado_asistencia: 'asistida'
      },
      {
        id_estudiante: estudiante.id,
        fecha: '2024-12-22',
        hora: '14:30:00',
        motivo: 'Citación por comportamiento',
        profesional: 'Prof. Carlos López',
        email_orientador: 'carlos.lopez@colegio.cl',
        observaciones: 'Conversar sobre incidente en el recreo',
        estado_asistencia: 'no_asistida'
      },
      {
        id_estudiante: estudiante.id,
        fecha: '2024-12-25',
        hora: '09:15:00',
        motivo: 'Orientación vocacional',
        profesional: 'Psic. Ana Martínez',
        email_orientador: 'ana.martinez@colegio.cl',
        observaciones: 'Evaluación de intereses profesionales',
        estado_asistencia: 'pendiente'
      }
    ];
    
    for (const citacion of citaciones) {
      await pool.request()
        .input('id_estudiante', sql.Int, citacion.id_estudiante)
        .input('fecha', sql.Date, citacion.fecha)
        .input('hora', sql.VarChar, citacion.hora)
        .input('motivo', sql.NVarChar, citacion.motivo)
        .input('profesional', sql.NVarChar, citacion.profesional)
        .input('email_orientador', sql.NVarChar, citacion.email_orientador)
        .input('observaciones', sql.NVarChar, citacion.observaciones)
        .input('estado_asistencia', sql.NVarChar, citacion.estado_asistencia)
        .input('creado_en', sql.DateTime, new Date())
        .query(`
          INSERT INTO agenda 
          (id_estudiante, fecha, hora, motivo, profesional, email_orientador, observaciones, estado_asistencia, creado_en)
          VALUES 
          (@id_estudiante, @fecha, @hora::time, @motivo, @profesional, @email_orientador, @observaciones, @estado_asistencia, @creado_en)
        `);
    }
    
    console.log('✅ Datos de citaciones insertados correctamente');
    
  } catch (error) {
    console.error('❌ Error al insertar datos de citaciones:', error);
  } finally {
    process.exit(0);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  insertarDatosCitaciones();
}

module.exports = insertarDatosCitaciones;
