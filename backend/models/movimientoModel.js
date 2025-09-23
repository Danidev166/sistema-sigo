// backend/models/movimientoModel.js
const { Pool } = require('pg');

// Configuración de PostgreSQL para Render
const renderConfig = {
  user: 'sigo_user',
  host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
  database: 'sigo_pro',
  password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
  port: 5432,
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool(renderConfig);

class MovimientoModel {
  static async registrar(data) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Normalizar tipo de movimiento: "Entrada" -> "Entrada", "Salida" -> "Salida"
      const tipo = String(data.tipo_movimiento || "").trim();
      const tipoNormalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();

      // Insertar movimiento
      const insertQuery = `
        INSERT INTO movimiento_recursos (tipo_movimiento, id_recurso, cantidad, id_estudiante, responsable, observaciones, fecha)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *
      `;
      
      const insertValues = [
        tipoNormalizado,
        data.id_recurso,
        data.cantidad,
        data.id_estudiante || null,
        data.responsable || null,
        data.observaciones || null
      ];
      
      const result = await client.query(insertQuery, insertValues);
      const movimiento = result.rows[0];

      // Actualizar stock del recurso
      if (tipoNormalizado === "Entrada") {
        await client.query(
          'UPDATE recursos SET stock = stock + $1 WHERE id = $2',
          [data.cantidad, data.id_recurso]
        );
      } else if (tipoNormalizado === "Salida") {
        await client.query(
          'UPDATE recursos SET stock = stock - $1 WHERE id = $2',
          [data.cantidad, data.id_recurso]
        );
      }

      await client.query('COMMIT');
      return movimiento;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async obtenerTodos() {
    const query = `
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
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  static async obtenerPorId(id) {
    const query = `
      SELECT m.*, 
             r.nombre AS recurso,
             r.tipo_recurso,
             e.nombre AS estudiante_nombre,
             e.apellido AS estudiante_apellido
      FROM movimiento_recursos m
      JOIN recursos r ON m.id_recurso = r.id
      LEFT JOIN estudiantes e ON m.id_estudiante = e.id
      WHERE m.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async actualizar(id, data) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Obtener el movimiento original para revertir el stock
      const movimientoOriginal = await client.query(
        'SELECT * FROM movimiento_recursos WHERE id = $1',
        [id]
      );

      if (movimientoOriginal.rows.length === 0) {
        throw new Error('Movimiento no encontrado');
      }

      const movOriginal = movimientoOriginal.rows[0];

      // Revertir el stock del movimiento original
      if (movOriginal.tipo_movimiento === "Entrada") {
        await client.query(
          'UPDATE recursos SET stock = stock - $1 WHERE id = $2',
          [movOriginal.cantidad, movOriginal.id_recurso]
        );
      } else if (movOriginal.tipo_movimiento === "Salida") {
        await client.query(
          'UPDATE recursos SET stock = stock + $1 WHERE id = $2',
          [movOriginal.cantidad, movOriginal.id_recurso]
        );
      }

      // Normalizar tipo de movimiento
      const tipo = String(data.tipo_movimiento || "").trim();
      const tipoNormalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();

      // Actualizar el movimiento
      const updateQuery = `
        UPDATE movimiento_recursos 
        SET tipo_movimiento = $1,
            id_recurso = $2,
            cantidad = $3,
            id_estudiante = $4,
            responsable = $5,
            observaciones = $6
        WHERE id = $7
        RETURNING *
      `;
      
      const updateValues = [
        tipoNormalizado,
        data.id_recurso,
        data.cantidad,
        data.id_estudiante || null,
        data.responsable || null,
        data.observaciones || null,
        id
      ];
      
      const result = await client.query(updateQuery, updateValues);

      // Aplicar el nuevo stock
      if (tipoNormalizado === "Entrada") {
        await client.query(
          'UPDATE recursos SET stock = stock + $1 WHERE id = $2',
          [data.cantidad, data.id_recurso]
        );
      } else if (tipoNormalizado === "Salida") {
        await client.query(
          'UPDATE recursos SET stock = stock - $1 WHERE id = $2',
          [data.cantidad, data.id_recurso]
        );
      }

      await client.query('COMMIT');
      return result.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async eliminar(id) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Obtener el movimiento para revertir el stock
      const movimiento = await client.query(
        'SELECT * FROM movimiento_recursos WHERE id = $1',
        [id]
      );

      if (movimiento.rows.length === 0) {
        throw new Error('Movimiento no encontrado');
      }

      const mov = movimiento.rows[0];

      // Revertir el stock
      if (mov.tipo_movimiento === "Entrada") {
        await client.query(
          'UPDATE recursos SET stock = stock - $1 WHERE id = $2',
          [mov.cantidad, mov.id_recurso]
        );
      } else if (mov.tipo_movimiento === "Salida") {
        await client.query(
          'UPDATE recursos SET stock = stock + $1 WHERE id = $2',
          [mov.cantidad, mov.id_recurso]
        );
      }

      // Eliminar el movimiento
      await client.query(
        'DELETE FROM movimiento_recursos WHERE id = $1',
        [id]
      );

      await client.query('COMMIT');
      return mov;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = MovimientoModel;