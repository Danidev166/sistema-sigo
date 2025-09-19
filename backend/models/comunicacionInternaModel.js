const db = require('../config/db');

class ComunicacionInternaModel {
  async obtenerTodos() {
    return db.query('SELECT * FROM Comunicacion_Interna');
  }
  async obtenerPorId(id) {
    return db.query('SELECT * FROM Comunicacion_Interna WHERE id = @id', { id });
  }
  async crear(data) {
    const { id_remitente, id_destinatario, asunto, mensaje, prioridad, leida, adjuntos } = data;
    return db.query(
      `INSERT INTO Comunicacion_Interna (id_remitente, id_destinatario, asunto, mensaje, prioridad, leida, adjuntos)
       VALUES (@id_remitente, @id_destinatario, @asunto, @mensaje, @prioridad, @leida, @adjuntos)`,
      { id_remitente, id_destinatario, asunto, mensaje, prioridad, leida, adjuntos }
    );
  }
  async actualizar(id, data) {
    const { asunto, mensaje, prioridad, leida, adjuntos } = data;
    return db.query(
      `UPDATE Comunicacion_Interna SET asunto=@asunto, mensaje=@mensaje, prioridad=@prioridad, leida=@leida, adjuntos=@adjuntos, fecha_lectura=CASE WHEN leida=1 THEN GETDATE() ELSE NULL END WHERE id=@id`,
      { id, asunto, mensaje, prioridad, leida, adjuntos }
    );
  }
  async eliminar(id) {
    return db.query('DELETE FROM Comunicacion_Interna WHERE id = @id', { id });
  }
}

module.exports = new ComunicacionInternaModel(); 