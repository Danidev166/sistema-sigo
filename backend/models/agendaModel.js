// backend/models/agendaModel.js
const { sql, getPool } = require('../config/db');

// normaliza "HH:mm" -> "HH:mm:ss"
function normalizeTimeStr(v) {
  if (v == null) return null;
  if (typeof v !== 'string') return v;
  return v.length === 5 ? `${v}:00` : v;
}

// helper "YYYY-MM-DD" seguro (date)
function toPgDate(input) {
  if (!input) return null;
  if (input instanceof Date) return input;
  if (typeof input === 'string') return input; // PG acepta 'YYYY-MM-DD'
  return new Date(input);
}

class AgendaModel {
  static async obtenerTodos() {
    try {
      const pool = await getPool();
      
      // Consulta para PostgreSQL con LEFT JOIN para obtener datos de estudiantes
      const query = `
        SELECT 
          a.*,
          COALESCE(e.nombre, 'Sin nombre') as nombre_estudiante,
          COALESCE(e.apellido, '') as apellido_estudiante,
          COALESCE(e.curso, 'Sin curso') as curso,
          COALESCE(a.estado, 'Pendiente') as estado,
          COALESCE(a.tipo, 'Citación') as tipo,
          COALESCE(a.observaciones, 'Sin observaciones') as observaciones,
          COALESCE(a.asistencia, 'Pendiente') as asistencia
        FROM agenda a
        LEFT JOIN estudiantes e ON a.estudiante_id = e.id
        ORDER BY a.fecha_programada DESC
        LIMIT 50
      `;
      
      const result = await pool.query(query);
      
      console.log('📅 Agenda obtenida:', result.rows.length, 'registros');
      console.log('📅 Primer registro:', result.rows[0]);
      
      return result.rows;
    } catch (error) {
      console.error('❌ Error en obtenerTodos agenda:', error);
      console.error('❌ Stack trace:', error.stack);
      throw error;
    }
  }

  static async obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.query('SELECT * FROM agenda WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async crear(data) {
    const pool = await getPool();
    const horaStr = normalizeTimeStr(data.hora);

    const query = `
      INSERT INTO agenda (estudiante_id, fecha_programada, hora, motivo, profesional, email_orientador, creado_en)
      VALUES ($1, $2, $3::time, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      data.id_estudiante || data.estudiante_id,
      toPgDate(data.fecha),
      horaStr,
      data.motivo,
      data.profesional,
      data.email_orientador || null,
      new Date()
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async actualizar(id, data) {
    const pool = await getPool();
    const horaStr = normalizeTimeStr(data.hora);

    const query = `
      UPDATE agenda
      SET estudiante_id = $1,
          fecha_programada = $2,
          hora = $3::time,
          motivo = $4,
          profesional = $5,
          email_orientador = $6
      WHERE id = $7
    `;
    
    const values = [
      data.id_estudiante || data.estudiante_id,
      toPgDate(data.fecha),
      horaStr,
      data.motivo,
      data.profesional,
      data.email_orientador || null,
      id
    ];

    await pool.query(query, values);
  }

  static async eliminar(id) {
    const pool = await getPool();
    await pool.query('DELETE FROM agenda WHERE id = $1', [id]);
  }
}

module.exports = AgendaModel;
