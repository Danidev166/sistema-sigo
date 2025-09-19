const db = require('../config/db');

class ConfiguracionSistemaModel {
  async obtenerTodos() {
    return db.query('SELECT * FROM Configuracion_Sistema');
  }
  async obtenerPorId(id) {
    return db.query('SELECT * FROM Configuracion_Sistema WHERE id = @id', { id });
  }
  async crear(data) {
    const { clave, valor, tipo, descripcion, categoria, editable, modificado_por } = data;
    return db.query(
      `INSERT INTO Configuracion_Sistema (clave, valor, tipo, descripcion, categoria, editable, modificado_por)
       VALUES (@clave, @valor, @tipo, @descripcion, @categoria, @editable, @modificado_por)`,
      { clave, valor, tipo, descripcion, categoria, editable, modificado_por }
    );
  }
  async actualizar(id, data) {
    const { valor, tipo, descripcion, categoria, editable, modificado_por } = data;
    return db.query(
      `UPDATE Configuracion_Sistema SET valor=@valor, tipo=@tipo, descripcion=@descripcion, categoria=@categoria, editable=@editable, modificado_por=@modificado_por, fecha_modificacion=GETDATE() WHERE id=@id`,
      { id, valor, tipo, descripcion, categoria, editable, modificado_por }
    );
  }
  async eliminar(id) {
    return db.query('DELETE FROM Configuracion_Sistema WHERE id = @id', { id });
  }
}

module.exports = new ConfiguracionSistemaModel(); 