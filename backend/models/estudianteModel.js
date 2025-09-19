// models/estudianteModel.js
const { sql, poolPromise } = require("../config/db");

const EstudianteModel = {
  async crear(estudiante) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("nombre", sql.NVarChar(100), estudiante.nombre)
      .input("apellido", sql.NVarChar(100), estudiante.apellido)
      .input("rut", sql.NVarChar(20), estudiante.rut)
      .input("email", sql.NVarChar(100), estudiante.email)
      .input("telefono", sql.NVarChar(20), estudiante.telefono)
      .input("direccion", sql.NVarChar(255), estudiante.direccion)
      .input("fecha_nacimiento", sql.Date, estudiante.fechaNacimiento) // Convertir camelCase a snake_case
      .input("curso", sql.NVarChar(50), estudiante.curso)
      .input("especialidad", sql.NVarChar(100), estudiante.especialidad)
      .input("situacion_economica", sql.NVarChar(50), estudiante.situacion_economica)
      .input("fecha_registro", sql.DateTime, new Date())
      .input("estado", sql.VarChar(20), estudiante.estado || 'Activo')
      .query(`INSERT INTO Estudiantes (nombre, apellido, rut, email, telefono, direccion, fecha_nacimiento, curso, especialidad, situacion_economica, fecha_registro, estado)
              OUTPUT INSERTED.*
              VALUES (@nombre, @apellido, @rut, @email, @telefono, @direccion, @fecha_nacimiento, @curso, @especialidad, @situacion_economica, @fecha_registro, @estado)`);
    return result.recordset[0];
  },
  async crearMasivo(estudiantes) {
  const pool = await poolPromise;
  const results = await Promise.allSettled(estudiantes.map(async (est) => {
    try {
      console.log("Insertando estudiante:", est);
      await pool.request()
        .input("nombre", sql.NVarChar(100), est.nombre)
        .input("apellido", sql.NVarChar(100), est.apellido)
        .input("rut", sql.NVarChar(20), est.rut)
        .input("email", sql.NVarChar(100), est.email)
        .input("telefono", sql.NVarChar(20), est.telefono)
        .input("direccion", sql.NVarChar(255), est.direccion)
        .input("fecha_nacimiento", sql.Date, est.fechaNacimiento)
        .input("curso", sql.NVarChar(50), est.curso)
        .input("especialidad", sql.NVarChar(100), est.especialidad)
        .input("situacion_economica", sql.NVarChar(50), est.situacion_economica)
        .input("fecha_registro", sql.DateTime, new Date())
        .input("estado", sql.VarChar(20), est.estado || "Activo")
        .query(`
          INSERT INTO Estudiantes (
            nombre, apellido, rut, email, telefono, direccion,
            fecha_nacimiento, curso, especialidad, situacion_economica,
            fecha_registro, estado
          ) VALUES (
            @nombre, @apellido, @rut, @email, @telefono, @direccion,
            @fecha_nacimiento, @curso, @especialidad, @situacion_economica,
            @fecha_registro, @estado
          )
        `);
      return { status: "fulfilled", rut: est.rut };
    } catch (err) {
      console.error("Error insertando estudiante:", est.rut, err.message);
      return { status: "rejected", rut: est.rut, error: err.message };
    }
  }));
  console.log("Resultados de la carga masiva:", results);
},


  async listar() {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Estudiantes");
    return result.recordset;
  },

  async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Estudiantes WHERE id = @id");
    return result.recordset[0];
  },

  async actualizar(id, datos) {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("nombre", sql.NVarChar(100), datos.nombre)
      .input("apellido", sql.NVarChar(100), datos.apellido)
      .input("rut", sql.NVarChar(20), datos.rut)
      .input("email", sql.NVarChar(100), datos.email)
      .input("telefono", sql.NVarChar(20), datos.telefono)
      .input("direccion", sql.NVarChar(255), datos.direccion)
      .input("fecha_nacimiento", sql.Date, datos.fechaNacimiento)
      .input("curso", sql.NVarChar(50), datos.curso)
      .input("especialidad", sql.NVarChar(100), datos.especialidad)
      .input("situacion_economica", sql.NVarChar(50), datos.situacion_economica)
      .input("estado", sql.VarChar(20), datos.estado)
      .query(`UPDATE Estudiantes SET nombre = @nombre, apellido = @apellido, rut = @rut, email = @email, telefono = @telefono, direccion = @direccion, fecha_nacimiento = @fecha_nacimiento, curso = @curso, especialidad = @especialidad, situacion_economica = @situacion_economica, estado = @estado WHERE id = @id`);
  },

  async eliminar(id) {
    const pool = await poolPromise;
    await pool.request().input("id", sql.Int, id).query("DELETE FROM Estudiantes WHERE id = @id");
  },
  // models/estudianteModel.js
async listarActivos() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query("SELECT * FROM Estudiantes WHERE LOWER(estado) = 'activo'");
  return result.recordset;
},

async contar() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT COUNT(*) as total FROM Estudiantes
  `);
  return result.recordset[0].total;
}

};

module.exports = EstudianteModel;
