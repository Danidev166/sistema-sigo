// ✅ controller/estudianteController.js (PostgreSQL)
const logger = require("../utils/logger");
const LogsActividadModel = require('../models/logsActividadModel');
const EstudianteModel = require('../models/estudianteModel');

class EstudianteController {
static async obtenerTodos(_req, res, next) {
  try {
    const estudiantes = await EstudianteModel.listar(); 
    res.json(estudiantes);
  } catch (error) {
    logger.error("Error al obtener estudiantes", error);
    next(error);
  }
}


  static async buscarPorRut(req, res, next) {
    try {
      const { rut } = req.query;
      if (!rut) return res.status(400).json({ error: "El RUT es requerido" });

      const est = await EstudianteModel.buscarPorRut(rut);
      if (!est) return res.status(404).json({ error: "Estudiante no encontrado" });
      res.json(est);
    } catch (error) {
      logger.error("Error al buscar estudiante por RUT", error);
      next(error);
    }
  }

  static async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      
      // Si el ID es "nuevo", devolver un objeto vacío para el formulario
      if (id === "nuevo") {
        return res.json({
          id: null,
          nombre: "",
          apellido: "",
          rut: "",
          curso: "",
          estado: "activo",
          especialidad: "",
          situacion_economica: "",
          fecha_nacimiento: "",
          email: "",
          telefono: "",
          direccion: ""
        });
      }
      
      // Validar que el ID sea un número
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID de estudiante inválido" });
      }
      
      const est = await EstudianteModel.obtenerPorId(id);
      if (!est) return res.status(404).json({ error: "Estudiante no encontrado" });
      res.json(est);
    } catch (error) {
      logger.error("Error al obtener estudiante por ID", error);
      next(error);
    }
  }

  static async obtenerPaginado(req, res, next) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const pagina = parseInt(page, 10);
      const limite = parseInt(limit, 10);
      const data = await EstudianteModel.obtenerPaginado({ page: pagina, limit: limite, search });
      res.json(data);
    } catch (error) {
      logger.error("Error en paginación de estudiantes", error);
      next(error);
    }
  }

  static async crear(req, res, next) {
    try {
      const nuevo = await EstudianteModel.crear(req.body); // debe devolver el registro creado
      res.status(201).json({ message: "✅ Estudiante creado", id: nuevo?.id, estudiante: nuevo });

      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Crear',
        tabla_afectada: 'estudiantes',
        id_registro: nuevo?.id || null,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(nuevo),
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
      await EstudianteModel.crearMasivo(estudiantes);
      res.status(201).json({ message: "✅ Estudiantes registrados correctamente" });
    } catch (error) {
      logger.error("Error en carga masiva de estudiantes", error);
      next(error);
    }
  }

  static async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const prev = await EstudianteModel.obtenerPorId(id);
      if (!prev) return res.status(404).json({ error: "Estudiante no encontrado" });

      await EstudianteModel.actualizar(id, req.body);
      res.json({ message: "✅ Estudiante actualizado" });

      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'estudiantes',
        id_registro: id,
        datos_anteriores: JSON.stringify(prev),
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
      const prev = await EstudianteModel.obtenerPorId(id);
      if (!prev) return res.status(404).json({ error: "Estudiante no encontrado" });

      await EstudianteModel.eliminar(id);
      res.json({ message: "🗑️ Estudiante eliminado" });

      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar',
        tabla_afectada: 'estudiantes',
        id_registro: id,
        datos_anteriores: JSON.stringify(prev),
        datos_nuevos: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      logger.error("Error al eliminar estudiante", error);
      next(error);
    }
  }

  static async obtenerActivos(_req, res, next) {
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
