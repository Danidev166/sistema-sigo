// ✅ controller/estudianteController.js
const { poolPromise, sql } = require("../config/db");
const logger = require("../utils/logger");
const LogsActividadModel = require('../models/logsActividadModel');
const EstudianteModel = require('../models/estudianteModel');

class EstudianteController {
  static async obtenerTodos(req, res, next) {
    try {
      const pool = await poolPromise;
      // Optimización: Solo campos necesarios y ordenamiento por nombre
      const result = await pool.request().query(`
        SELECT 
          id, nombre, apellido, rut, email, telefono, 
          direccion, fecha_nacimiento, curso, especialidad, 
          situacion_economica, fecha_registro, estado
        FROM Estudiantes 
        ORDER BY nombre, apellido
      `);
      res.json(result.recordset);
    } catch (error) {
      logger.error("Error al obtener estudiantes", error);
      next(error);
    }
  }

  static async buscarPorRut(req, res, next) {
    try {
      const { rut } = req.query;
      if (!rut) {
        return res.status(400).json({ error: "El RUT es requerido" });
      }

      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("rut", sql.NVarChar, rut)
        .query("SELECT * FROM Estudiantes WHERE rut = @rut");

      if (!result.recordset[0]) {
        return res.status(404).json({ error: "Estudiante no encontrado" });
      }

      res.json(result.recordset[0]);
    } catch (error) {
      logger.error("Error al buscar estudiante por RUT", error);
      next(error);
    }
  }

  static async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM Estudiantes WHERE id = @id");

      if (!result.recordset[0])
        return res.status(404).json({ error: "Estudiante no encontrado" });
      res.json(result.recordset[0]);
    } catch (error) {
      logger.error("Error al obtener estudiante por ID", error);
      next(error);
    }
  }
 static async obtenerPaginado(req, res, next) {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const pagina = parseInt(page);
    const limite = parseInt(limit);
    const offset = (pagina - 1) * limite;

    const pool = await poolPromise;

    const filtroSQL = `
      WHERE nombre LIKE @search OR apellido LIKE @search OR rut LIKE @search
    `;

    const searchParam = `%${search}%`;

    const totalQuery = await pool.request()
      .input("search", sql.NVarChar, searchParam)
      .query(`SELECT COUNT(*) AS total FROM Estudiantes ${search ? filtroSQL : ""}`);
    
    const total = totalQuery.recordset[0].total;

    const resultQuery = await pool.request()
      .input("limit", sql.Int, limite)
      .input("offset", sql.Int, offset)
      .input("search", sql.NVarChar, searchParam)
      .query(`
        SELECT * FROM Estudiantes
        ${search ? filtroSQL : ""}
        ORDER BY id DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `);

    res.json({
      total,
      page: pagina,
      limit: limite,
      data: resultQuery.recordset
    });
  } catch (error) {
    logger.error("Error en paginación de estudiantes con búsqueda", error);
    next(error);
  }
}


  static async crear(req, res, next) {
    try {
      console.log('📥 Datos recibidos en crear estudiante:', JSON.stringify(req.body, null, 2));
      
      const {
        nombre,
        apellido,
        rut,
        email,
        telefono,
        direccion,
        fechaNacimiento, // Cambiado de fecha_nacimiento a fechaNacimiento
        curso,
        especialidad,
        situacion_economica,
        estado,
      } = req.body;

      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("nombre", sql.NVarChar(100), nombre)
        .input("apellido", sql.NVarChar(100), apellido)
        .input("rut", sql.NVarChar(12), rut)
        .input("email", sql.NVarChar(100), email)
        .input("telefono", sql.NVarChar(20), telefono)
        .input("direccion", sql.NVarChar(255), direccion)
        .input("fecha_nacimiento", sql.Date, fechaNacimiento)
        .input("curso", sql.NVarChar(50), curso)
        .input("especialidad", sql.NVarChar(100), especialidad)
        .input("situacion_economica", sql.NVarChar(50), situacion_economica)
        .input("fecha_registro", sql.DateTime, new Date())
        .input("estado", sql.VarChar(20), estado || "Activo").query(`
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

      res.status(201).json({ message: "✅ Estudiante creado correctamente" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Crear',
        tabla_afectada: 'estudiantes',
        id_registro: null, // Podrías obtener el ID si lo retorna el insert
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(req.body),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("Error al crear estudiante", error);
      next(error);
    }
  }
  static async crearEstudiantesMasivo(req, res, next) {
    try {
      const estudiantes = req.body;
      console.log("Recibidos para carga masiva:", estudiantes); // LOG
      await EstudianteModel.crearMasivo(estudiantes);
      console.log("Carga masiva completada"); // LOG
      res.status(201).json({ message: "✅ Estudiantes registrados correctamente" });
    } catch (error) {
      logger.error("Error en carga masiva de estudiantes", error);
      next(error);
    }
  }

  static async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const {
        nombre,
        apellido,
        rut,
        email,
        telefono,
        direccion,
        fechaNacimiento, // Cambiado de fecha_nacimiento a fechaNacimiento
        curso,
        especialidad,
        situacion_economica,
        estado,
      } = req.body;

      const pool = await poolPromise;
      // Obtener datos anteriores
      const prev = await pool.request().input("id", sql.Int, id).query("SELECT * FROM Estudiantes WHERE id = @id");
      const datos_anteriores = prev.recordset[0] ? JSON.stringify(prev.recordset[0]) : null;
      await pool
        .request()
        .input("id", sql.Int, id)
        .input("nombre", sql.NVarChar(100), nombre)
        .input("apellido", sql.NVarChar(100), apellido)
        .input("rut", sql.NVarChar(12), rut)
        .input("email", sql.NVarChar(100), email)
        .input("telefono", sql.NVarChar(20), telefono)
        .input("direccion", sql.NVarChar(255), direccion)
        .input("fecha_nacimiento", sql.Date, fechaNacimiento)
        .input("curso", sql.NVarChar(50), curso)
        .input("especialidad", sql.NVarChar(100), especialidad)
        .input("situacion_economica", sql.NVarChar(50), situacion_economica)
        .input("estado", sql.VarChar(20), estado).query(`
          UPDATE Estudiantes SET
            nombre = @nombre,
            apellido = @apellido,
            rut = @rut,
            email = @email,
            telefono = @telefono,
            direccion = @direccion,
            fecha_nacimiento = @fecha_nacimiento,
            curso = @curso,
            especialidad = @especialidad,
            situacion_economica = @situacion_economica,
            estado = @estado
          WHERE id = @id
        `);

      res.json({ message: "✅ Estudiante actualizado correctamente" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'estudiantes',
        id_registro: id,
        datos_anteriores,
        datos_nuevos: JSON.stringify(req.body),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("Error al actualizar estudiante", error);
      next(error);
    }
  }

  static async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      const pool = await poolPromise;
      // Obtener datos anteriores
      const prev = await pool.request().input("id", sql.Int, id).query("SELECT * FROM Estudiantes WHERE id = @id");
      const datos_anteriores = prev.recordset[0] ? JSON.stringify(prev.recordset[0]) : null;
      await pool
        .request()
        .input("id", sql.Int, id)
        .query("DELETE FROM Estudiantes WHERE id = @id");

      res.json({ message: "🗑️ Estudiante eliminado correctamente" });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar',
        tabla_afectada: 'estudiantes',
        id_registro: id,
        datos_anteriores,
        datos_nuevos: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("Error al eliminar estudiante", error);
      next(error);
    }
  }
  // controller/estudianteController.js
  static async obtenerActivos(req, res, next) {
    try {
      const datos = await EstudianteModel.listarActivos();
      res.json(datos);
    } catch (error) {
      logger.error("Error al obtener estudiantes activos", error);
      next(error);
    }
  }
}

module.exports = EstudianteController;
