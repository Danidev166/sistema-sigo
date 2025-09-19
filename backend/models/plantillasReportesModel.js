const { sql, poolPromise } = require('../config/db');

class PlantillasReportesModel {
  async obtenerTodos() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Plantillas_Reportes ORDER BY fecha_creacion DESC');
    return result.recordset;
  }
  
  async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Plantillas_Reportes WHERE id = @id');
    return result.recordset[0];
  }
  
  async crear(data) {
    const { nombre, descripcion, tipo_reporte, configuracion, activa, creado_por } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('nombre', sql.NVarChar(255), nombre)
      .input('descripcion', sql.Text, descripcion)
      .input('tipo_reporte', sql.NVarChar(50), tipo_reporte)
      .input('configuracion', sql.NVarChar(sql.MAX), configuracion)
      .input('activa', sql.Bit, activa)
      .input('creado_por', sql.Int, creado_por)
      .query(
        `INSERT INTO Plantillas_Reportes (nombre, descripcion, tipo_reporte, configuracion, activa, creado_por)
         OUTPUT INSERTED.id
         VALUES (@nombre, @descripcion, @tipo_reporte, @configuracion, @activa, @creado_por)`
      );
    return { insertId: result.recordset[0].id };
  }
  
  async actualizar(id, data) {
    const { nombre, descripcion, tipo_reporte, configuracion, activa } = data;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.NVarChar(255), nombre)
      .input('descripcion', sql.Text, descripcion)
      .input('tipo_reporte', sql.NVarChar(50), tipo_reporte)
      .input('configuracion', sql.NVarChar(sql.MAX), configuracion)
      .input('activa', sql.Bit, activa)
      .query(
        `UPDATE Plantillas_Reportes 
         SET nombre=@nombre, descripcion=@descripcion, tipo_reporte=@tipo_reporte, 
             configuracion=@configuracion, activa=@activa, fecha_modificacion=GETDATE() 
         WHERE id=@id`
      );
  }
  
  async eliminar(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Plantillas_Reportes WHERE id = @id');
  }
}

module.exports = new PlantillasReportesModel(); 