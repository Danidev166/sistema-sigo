// backend/models/estudianteModel.js
const { sql, getPool } = require('../config/db');

// Fecha "YYYY-MM-DD" -> Date (evita desfases por zona horaria)
function toSqlDate(input) {
  if (input instanceof Date) return input;
  if (typeof input === 'string') {
    const [y, m, d] = input.split('-').map(Number);
    return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  }
  return new Date(input);
}

const EstudianteModel = {
  async crear(estudiante) {
    const pool = await getPool();
    const r = await pool.request()
      .input('nombre',             sql.NVarChar, estudiante.nombre)
      .input('apellido',           sql.NVarChar, estudiante.apellido)
      .input('rut',                sql.NVarChar, estudiante.rut)
      .input('email',              sql.NVarChar, estudiante.email)
      .input('telefono',           sql.NVarChar, estudiante.telefono)
      .input('direccion',          sql.NVarChar, estudiante.direccion)
      .input('fecha_nacimiento',   sql.DateTime, toSqlDate(estudiante.fechaNacimiento))
      .input('curso',              sql.NVarChar, estudiante.curso)
      .input('especialidad',       sql.NVarChar, estudiante.especialidad)
      .input('situacion_economica',sql.NVarChar, estudiante.situacion_economica)
      .input('nombreApoderado',    sql.NVarChar, estudiante.nombreApoderado || '')
      .input('telefonoApoderado',  sql.NVarChar, estudiante.telefonoApoderado || '')
      .input('emailApoderado',     sql.NVarChar, estudiante.emailApoderado || '')
      .input('fecha_registro',     sql.DateTime, new Date())
      .input('estado',             sql.VarChar,  estudiante.estado || 'Activo')
      .query(`
        INSERT INTO estudiantes (
          nombre, apellido, rut, email, telefono, direccion,
          fecha_nacimiento, curso, especialidad, situacion_economica,
          nombre_apoderado, telefono_apoderado, email_apoderado,
          fecha_registro, estado
        )
        VALUES (
          @nombre, @apellido, @rut, @email, @telefono, @direccion,
          @fecha_nacimiento, @curso, @especialidad, @situacion_economica,
          @nombreApoderado, @telefonoApoderado, @emailApoderado,
          @fecha_registro, @estado
        )
        RETURNING *
      `);
    return r.recordset[0];
  },

  async crearMasivo(estudiantes) {
    const pool = await getPool();
    const results = await Promise.allSettled(
      estudiantes.map(async (est) => {
        try {
          await pool.request()
            .input('nombre',             sql.NVarChar, est.nombre)
            .input('apellido',           sql.NVarChar, est.apellido)
            .input('rut',                sql.NVarChar, est.rut)
            .input('email',              sql.NVarChar, est.email)
            .input('telefono',           sql.NVarChar, est.telefono)
            .input('direccion',          sql.NVarChar, est.direccion)
            .input('fecha_nacimiento',   sql.DateTime, toSqlDate(est.fechaNacimiento))
            .input('curso',              sql.NVarChar, est.curso)
            .input('especialidad',       sql.NVarChar, est.especialidad)
            .input('situacion_economica',sql.NVarChar, est.situacion_economica)
            .input('nombreApoderado',    sql.NVarChar, est.nombreApoderado || '')
            .input('telefonoApoderado',  sql.NVarChar, est.telefonoApoderado || '')
            .input('emailApoderado',     sql.NVarChar, est.emailApoderado || '')
            .input('fecha_registro',     sql.DateTime, new Date())
            .input('estado',             sql.VarChar,  est.estado || 'Activo')
            .query(`
              INSERT INTO estudiantes (
                nombre, apellido, rut, email, telefono, direccion,
                fecha_nacimiento, curso, especialidad, situacion_economica,
                nombre_apoderado, telefono_apoderado, email_apoderado,
                fecha_registro, estado
              )
              VALUES (
                @nombre, @apellido, @rut, @email, @telefono, @direccion,
                @fecha_nacimiento, @curso, @especialidad, @situacion_economica,
                @nombreApoderado, @telefonoApoderado, @emailApoderado,
                @fecha_registro, @estado
              )
            `);
          return { status: 'fulfilled', rut: est.rut };
        } catch (err) {
          return { status: 'rejected', rut: est.rut, error: err.message };
        }
      })
    );
    return results;
  },

  async listar() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT * FROM estudiantes
      ORDER BY id DESC
    `);
    return r.recordset;
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM estudiantes WHERE id = @id');
    return r.recordset[0] || null;
  },

  async actualizar(id, datos) {
    const pool = await getPool();
    await pool.request()
      .input('id',                  sql.Int,     id)
      .input('nombre',              sql.NVarChar,datos.nombre)
      .input('apellido',            sql.NVarChar,datos.apellido)
      .input('rut',                 sql.NVarChar,datos.rut)
      .input('email',               sql.NVarChar,datos.email)
      .input('telefono',            sql.NVarChar,datos.telefono)
      .input('direccion',           sql.NVarChar,datos.direccion)
      .input('fecha_nacimiento',    sql.DateTime,toSqlDate(datos.fechaNacimiento))
      .input('curso',               sql.NVarChar,datos.curso)
      .input('especialidad',        sql.NVarChar,datos.especialidad)
      .input('situacion_economica', sql.NVarChar,datos.situacion_economica)
      .input('nombreApoderado',     sql.NVarChar,datos.nombreApoderado || '')
      .input('telefonoApoderado',   sql.NVarChar,datos.telefonoApoderado || '')
      .input('emailApoderado',      sql.NVarChar,datos.emailApoderado || '')
      .input('estado',              sql.VarChar, datos.estado)
      .query(`
        UPDATE estudiantes
           SET nombre = @nombre,
               apellido = @apellido,
               rut = @rut,
               email = @email,
               telefono = @telefono,
               direccion = @direccion,
               fecha_nacimiento = @fecha_nacimiento,
               curso = @curso,
               especialidad = @especialidad,
               situacion_economica = @situacion_economica,
               nombre_apoderado = @nombreApoderado,
               telefono_apoderado = @telefonoApoderado,
               email_apoderado = @emailApoderado,
               estado = @estado
         WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM estudiantes WHERE id = @id');
  },

  async listarActivos() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT * FROM estudiantes
      WHERE LOWER(TRIM(estado)) = 'activo'
      ORDER BY id DESC
    `);
    return r.recordset;
  },

  async contar() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT COUNT(*)::int AS total FROM estudiantes
    `);
    return r.recordset[0]?.total || 0;
  }
  
};



module.exports = EstudianteModel;
