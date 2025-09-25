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
      
      // Consulta ultra simple para verificar que funciona
      const result = await pool.request().query(`SELECT * FROM agenda LIMIT 10`);
      
      console.log('📅 Agenda obtenida:', result.recordset.length, 'registros');
      console.log('📅 Primer registro:', result.recordset[0]);
      
      // Agregar campos adicionales en JavaScript
      const agendaConCampos = result.recordset.map(item => ({
        ...item,
        nombre_estudiante: 'Sin nombre',
        apellido_estudiante: '',
        curso: 'Sin curso',
        estado: 'Programada',
        tipo: 'Citación',
        observaciones: 'Sin observaciones',
        asistencia: 'Pendiente'
      }));
      
      return agendaConCampos;
    } catch (error) {
      console.error('❌ Error en obtenerTodos agenda:', error);
      console.error('❌ Stack trace:', error.stack);
      throw error;
    }
  }

  static async obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM agenda WHERE id = @id');
    return result.recordset[0] || null;
  }

  static async crear(data) {
    const pool = await getPool();
    const horaStr = normalizeTimeStr(data.hora);

    const result = await pool.request()
      .input('id_estudiante',   sql.Int,             data.id_estudiante)
      .input('fecha',           sql.Date,            toPgDate(data.fecha))
      .input('hora',            sql.VarChar,         horaStr) // TIME desde string
      .input('motivo',          sql.NVarChar(255),   data.motivo)
      .input('profesional',     sql.NVarChar(100),   data.profesional)
      .input('email_orientador',sql.NVarChar(255),   data.email_orientador || null)
      .input('creado_en',       sql.DateTime,        new Date())
      .query(`
        INSERT INTO agenda (id_estudiante, fecha, hora, motivo, profesional, email_orientador, creado_en)
        VALUES (@id_estudiante, @fecha, @hora::time, @motivo, @profesional, @email_orientador, @creado_en)
        RETURNING *
      `);

    return result.recordset[0];
  }

  static async actualizar(id, data) {
    const pool = await getPool();
    const horaStr = normalizeTimeStr(data.hora);

    await pool.request()
      .input('id',              sql.Int,            id)
      .input('id_estudiante',   sql.Int,            data.id_estudiante)
      .input('fecha',           sql.Date,           toPgDate(data.fecha))
      .input('hora',            sql.VarChar,        horaStr)
      .input('motivo',          sql.NVarChar(255),  data.motivo)
      .input('profesional',     sql.NVarChar(100),  data.profesional)
      .input('email_orientador',sql.NVarChar(255),  data.email_orientador || null)
      .query(`
        UPDATE agenda
           SET id_estudiante   = @id_estudiante,
               fecha           = @fecha,
               hora            = @hora::time,
               motivo          = @motivo,
               profesional     = @profesional,
               email_orientador= @email_orientador
         WHERE id = @id
      `);
  }

  static async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM agenda WHERE id = @id');
  }
}

module.exports = AgendaModel;
