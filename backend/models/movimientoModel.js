// backend/models/movimientoModel.js
const { sql, getPool } = require("../config/db");

class MovimientoModel {
  static async registrar(data) {
    const pool = await getPool();
    
    // Normalizar tipo de movimiento: "Entrada" -> "Entrada", "Salida" -> "Salida"
    const tipo = String(data.tipo_movimiento || "").trim();
    const tipoNormalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();

    const r = await pool.request()
      .input("tipo_movimiento", sql.VarChar, tipoNormalizado)
      .input("id_recurso", sql.Int, data.id_recurso)
      .input("cantidad", sql.Int, data.cantidad)
      .input("id_estudiante", sql.Int, data.id_estudiante || null)
      .input("responsable", sql.VarChar, data.responsable || null)
      .input("observaciones", sql.VarChar, data.observaciones || null)
      .query(`
        INSERT INTO movimiento_recursos (tipo_movimiento, id_recurso, cantidad, id_estudiante, responsable, observaciones, fecha)
        VALUES (@tipo_movimiento, @id_recurso, @cantidad, @id_estudiante, @responsable, @observaciones, NOW())
        RETURNING *
      `);

    // Actualizar stock del recurso
    if (tipoNormalizado === "Entrada") {
      await pool.request()
        .input("id_recurso", sql.Int, data.id_recurso)
        .input("cantidad", sql.Int, data.cantidad)
        .query(`UPDATE recursos SET stock = stock + @cantidad WHERE id = @id_recurso`);
    } else if (tipoNormalizado === "Salida") {
      await pool.request()
        .input("id_recurso", sql.Int, data.id_recurso)
        .input("cantidad", sql.Int, data.cantidad)
        .query(`UPDATE recursos SET stock = stock - @cantidad WHERE id = @id_recurso`);
    }

    return r.recordset[0];
  }

  // 👇 ESTA FUNCIÓN TE FALTABA
  static async obtenerTodos() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT m.id, 
             m.fecha, 
             m.tipo_movimiento, 
             m.cantidad,
             r.nombre AS recurso, 
             r.tipo_recurso,
             CASE 
               WHEN m.id_estudiante IS NOT NULL THEN 
                 CONCAT(e.nombre, ' ', e.apellido, ' (', e.rut, ')')
               ELSE '-'
             END AS estudiante,
             m.id_estudiante,
             m.responsable, 
             m.observaciones
      FROM movimiento_recursos m
      JOIN recursos r ON m.id_recurso = r.id
      LEFT JOIN estudiantes e ON m.id_estudiante = e.id
      ORDER BY m.fecha DESC, m.id DESC
    `);
    return r.recordset;
  }

  static async actualizar(id, data) {
    const pool = await getPool();
    const tx = pool.transaction();
    
    try {
      await tx.begin();

      // Obtener el movimiento actual para revertir el stock
      const movimientoActual = await tx.request()
        .input('id', sql.Int, id)
        .query(`SELECT * FROM movimiento_recursos WHERE id = @id`);

      if (movimientoActual.recordset.length === 0) {
        throw new Error('Movimiento no encontrado');
      }

      const mov = movimientoActual.recordset[0];
      const tipoAnterior = mov.tipo_movimiento;
      const cantidadAnterior = mov.cantidad;

      // Revertir el stock anterior
      if (tipoAnterior === "Entrada") {
        await tx.request()
          .input("id_recurso", sql.Int, mov.id_recurso)
          .input("cantidad", sql.Int, cantidadAnterior)
          .query(`UPDATE recursos SET stock = stock - @cantidad WHERE id = @id_recurso`);
      } else if (tipoAnterior === "Salida") {
        await tx.request()
          .input("id_recurso", sql.Int, mov.id_recurso)
          .input("cantidad", sql.Int, cantidadAnterior)
          .query(`UPDATE recursos SET stock = stock + @cantidad WHERE id = @id_recurso`);
      }

      // Actualizar el movimiento
      const r = await tx.request()
        .input('id', sql.Int, id)
        .input('tipo_movimiento', sql.VarChar(30), data.tipo_movimiento)
        .input('cantidad', sql.Int, data.cantidad)
        .input('observaciones', sql.Text, data.observaciones || null)
        .input('id_estudiante', sql.Int, data.id_estudiante || null)
        .input('responsable', sql.VarChar(100), data.responsable || null)
        .query(`
          UPDATE movimiento_recursos 
          SET tipo_movimiento = @tipo_movimiento,
              cantidad = @cantidad,
              observaciones = @observaciones,
              id_estudiante = @id_estudiante,
              responsable = @responsable
          WHERE id = @id
          RETURNING *
        `);

      // Aplicar el nuevo stock
      const tipoNormalizado = data.tipo_movimiento.charAt(0).toUpperCase() + data.tipo_movimiento.slice(1).toLowerCase();
      if (tipoNormalizado === "Entrada") {
        await tx.request()
          .input("id_recurso", sql.Int, mov.id_recurso)
          .input("cantidad", sql.Int, data.cantidad)
          .query(`UPDATE recursos SET stock = stock + @cantidad WHERE id = @id_recurso`);
      } else if (tipoNormalizado === "Salida") {
        await tx.request()
          .input("id_recurso", sql.Int, mov.id_recurso)
          .input("cantidad", sql.Int, data.cantidad)
          .query(`UPDATE recursos SET stock = stock - @cantidad WHERE id = @id_recurso`);
      }

      await tx.commit();
      return r.recordset[0];
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  static async eliminar(id) {
    const pool = await getPool();
    const tx = pool.transaction();
    
    try {
      await tx.begin();

      // Obtener el movimiento para revertir el stock
      const movimiento = await tx.request()
        .input('id', sql.Int, id)
        .query(`SELECT * FROM movimiento_recursos WHERE id = @id`);

      if (movimiento.recordset.length === 0) {
        throw new Error('Movimiento no encontrado');
      }

      const mov = movimiento.recordset[0];

      // Revertir el stock
      if (mov.tipo_movimiento === "Entrada") {
        await tx.request()
          .input("id_recurso", sql.Int, mov.id_recurso)
          .input("cantidad", sql.Int, mov.cantidad)
          .query(`UPDATE recursos SET stock = stock - @cantidad WHERE id = @id_recurso`);
      } else if (mov.tipo_movimiento === "Salida") {
        await tx.request()
          .input("id_recurso", sql.Int, mov.id_recurso)
          .input("cantidad", sql.Int, mov.cantidad)
          .query(`UPDATE recursos SET stock = stock + @cantidad WHERE id = @id_recurso`);
      }

      // Eliminar el movimiento
      await tx.request()
        .input('id', sql.Int, id)
        .query(`DELETE FROM movimiento_recursos WHERE id = @id`);

      await tx.commit();
      return mov;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}

module.exports = MovimientoModel;
