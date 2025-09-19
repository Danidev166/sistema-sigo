const db = require('../config/db');

class PermisosRolesModel {
  async obtenerTodos() {
    return db.query('SELECT * FROM Permisos_Roles');
  }
  async obtenerPorId(id) {
    return db.query('SELECT * FROM Permisos_Roles WHERE id = @id', { id });
  }
  async crear(data) {
    const { rol, modulo, accion, permitido } = data;
    return db.query(
      `INSERT INTO Permisos_Roles (rol, modulo, accion, permitido)
       VALUES (@rol, @modulo, @accion, @permitido)`,
      { rol, modulo, accion, permitido }
    );
  }
  async actualizar(id, data) {
    const { rol, modulo, accion, permitido } = data;
    return db.query(
      `UPDATE Permisos_Roles SET rol=@rol, modulo=@modulo, accion=@accion, permitido=@permitido WHERE id=@id`,
      { id, rol, modulo, accion, permitido }
    );
  }
  async eliminar(id) {
    return db.query('DELETE FROM Permisos_Roles WHERE id = @id', { id });
  }
}

module.exports = new PermisosRolesModel(); 