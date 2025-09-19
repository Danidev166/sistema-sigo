const { sql, poolPromise } = require("../config/db");

const NotificacionModel = {
  async obtenerTodos() {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Notificaciones");
    return result.recordset;
  },

  async crear(data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id_usuario", sql.Int, data.id_usuario)
      .input("tipo", sql.NVarChar(50), data.tipo)
      .input("titulo", sql.NVarChar(255), data.titulo)
      .input("mensaje", sql.Text, data.mensaje)
      .input("prioridad", sql.NVarChar(20), data.prioridad)
      .input("categoria", sql.NVarChar(50), data.categoria)
      .input("id_estudiante", sql.Int, data.id_estudiante || null)
      .input("fecha_limite", sql.DateTime, data.fecha_limite || null)
      .input("leida", sql.Bit, data.leida)
      .input("accion_requerida", sql.NVarChar(100), data.accion_requerida || null)
      .query(`
        INSERT INTO Notificaciones
        (id_usuario, tipo, titulo, mensaje, prioridad, categoria, id_estudiante, fecha_limite, leida, accion_requerida, fecha_creacion)
        OUTPUT INSERTED.id
        VALUES
        (@id_usuario, @tipo, @titulo, @mensaje, @prioridad, @categoria, @id_estudiante, @fecha_limite, @leida, @accion_requerida, GETDATE())
      `);
    return { insertId: result.recordset[0].id };
  },

  // ...otros métodos

  async marcarComoLeida(id, leida) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('leida', sql.Bit, leida)
      .query('UPDATE Notificaciones SET leida = @leida WHERE id = @id');
  },

  async eliminar(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Notificaciones WHERE id = @id');
  },
};

module.exports = NotificacionModel; 