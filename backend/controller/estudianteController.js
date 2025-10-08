//  controller/estudianteController.js (PostgreSQL)
const logger = require("../utils/logger");
const LogsActividadModel = require('../models/logsActividadModel');
const EstudianteModel = require('../models/estudianteModel');

class EstudianteController {
static async obtenerTodos(req, res, next) {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    // Si hay parámetros de paginación, usar método paginado
    if (page || limit || search) {
      const result = await EstudianteModel.listarPaginado({
        page: parseInt(page),
        limit: parseInt(limit),
        search: search
      });
      return res.json(result);
    }
    
    // Si no hay parámetros, devolver todos los estudiantes
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
      res.status(201).json({ message: " Estudiante creado", id: nuevo?.id, estudiante: nuevo });

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
      res.status(201).json({ message: " Estudiantes registrados correctamente" });
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
      res.json({ message: " Estudiante actualizado" });

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
      res.json({ message: " Estudiante eliminado" });

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

  /**
   * Obtener todos los apoderados con filtros
   * GET /api/estudiantes/apoderados?curso=4A&nombre=maria&email=gmail
   */
  static async obtenerApoderados(req, res, next) {
    try {
      const { curso, nombre, email, limit = 10, offset = 0 } = req.query;
      
      logger.info(' Obteniendo lista de apoderados:', { curso, nombre, email, limit, offset });
      
      const { getPool } = require('../config/db');
      const pool = await getPool();
      
      // Construir query con filtros
      let whereConditions = [];
      let queryParams = [];
      let paramIndex = 1;
      
      // Filtro por curso
      if (curso) {
        whereConditions.push(`e.curso LIKE @curso${paramIndex}`);
        queryParams.push({ name: `curso${paramIndex}`, value: `%${curso}%` });
        paramIndex++;
      }
      
      // Filtro por nombre del apoderado o estudiante
      if (nombre) {
        whereConditions.push(`(e.nombre_apoderado LIKE @nombre${paramIndex} OR e.nombre LIKE @nombre${paramIndex})`);
        queryParams.push({ name: `nombre${paramIndex}`, value: `%${nombre}%` });
        paramIndex++;
      }
      
      // Filtro por email del apoderado
      if (email) {
        whereConditions.push(`e.email_apoderado LIKE @email${paramIndex}`);
        queryParams.push({ name: `email${paramIndex}`, value: `%${email}%` });
        paramIndex++;
      }
      
      // Solo apoderados con email válido y estudiantes activos
      whereConditions.push(`e.email_apoderado IS NOT NULL AND e.email_apoderado != '' AND e.estado = 'Activo'`);
      
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
      
      // Query principal
      const query = `
        SELECT 
          e.id as estudiante_id,
          e.nombre as estudiante_nombre,
          e.apellido as estudiante_apellido,
          e.rut as estudiante_rut,
          e.curso,
          e.especialidad,
          e.nombre_apoderado,
          e.email_apoderado,
          e.telefono_apoderado,
          e.estado as estudiante_estado,
          COUNT(cf.id) as total_comunicaciones,
          MAX(cf.fecha_comunicacion) as ultima_comunicacion
        FROM estudiantes e
        LEFT JOIN comunicacion_familia cf ON e.id = cf.id_estudiante
        ${whereClause}
        GROUP BY e.id, e.nombre, e.apellido, e.rut, e.curso, e.especialidad, 
                 e.nombre_apoderado, e.email_apoderado, e.telefono_apoderado, e.estado
        ORDER BY e.curso, e.nombre_apoderado, e.nombre
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `;
      
      // Agregar parámetros de paginación
      queryParams.push({ name: 'offset', value: parseInt(offset) });
      queryParams.push({ name: 'limit', value: parseInt(limit) });
      
      // Ejecutar query
      let request = pool.request();
      queryParams.forEach(param => {
        request = request.input(param.name, param.value);
      });
      
      const result = await request.query(query);
      
      // Query para contar total
      const countQuery = `
        SELECT COUNT(DISTINCT e.id) as total
        FROM estudiantes e
        ${whereClause}
      `;
      
      let countRequest = pool.request();
      queryParams.slice(0, -2).forEach(param => { // Excluir offset y limit
        countRequest = countRequest.input(param.name, param.value);
      });
      
      const countResult = await countRequest.query(countQuery);
      const total = countResult.recordset[0].total;
      
      logger.info(` Apoderados obtenidos: ${result.recordset.length} de ${total}`);
      
      res.json({
        apoderados: result.recordset,
        paginacion: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          paginas: Math.ceil(total / limit)
        },
        filtros: {
          curso: curso || null,
          nombre: nombre || null,
          email: email || null
        }
      });
      
    } catch (error) {
      logger.error(' Error al obtener apoderados:', error);
      next(error);
    }
  }

  /**
   * Obtener estadísticas de apoderados
   * GET /api/estudiantes/apoderados/estadisticas
   */
  static async obtenerEstadisticasApoderados(req, res, next) {
    try {
      const { getPool } = require('../config/db');
      const pool = await getPool();
      
      // Estadísticas por curso
      const cursoQuery = `
        SELECT 
          e.curso,
          COUNT(*) as total_apoderados,
          COUNT(CASE WHEN e.email_apoderado IS NOT NULL AND e.email_apoderado != '' THEN 1 END) as con_email,
          COUNT(CASE WHEN e.email_apoderado IS NULL OR e.email_apoderado = '' THEN 1 END) as sin_email
        FROM estudiantes e
        WHERE e.estado = 'Activo'
        GROUP BY e.curso
        ORDER BY e.curso
      `;
      
      const cursoResult = await pool.request().query(cursoQuery);
      
      // Estadísticas generales
      const generalQuery = `
        SELECT 
          COUNT(*) as total_estudiantes,
          COUNT(CASE WHEN e.email_apoderado IS NOT NULL AND e.email_apoderado != '' THEN 1 END) as total_con_email,
          COUNT(CASE WHEN e.email_apoderado IS NULL OR e.email_apoderado = '' THEN 1 END) as total_sin_email
        FROM estudiantes e
        WHERE e.estado = 'Activo'
      `;
      
      const generalResult = await pool.request().query(generalQuery);
      
      res.json({
        por_curso: cursoResult.recordset,
        general: generalResult.recordset[0]
      });
      
    } catch (error) {
      logger.error(' Error al obtener estadísticas de apoderados:', error);
      next(error);
    }
  }

  /**
   * Obtener lista de cursos disponibles
   * GET /api/estudiantes/cursos
   */
  static async obtenerCursos(req, res, next) {
    try {
      const { getPool } = require('../config/db');
      const pool = await getPool();
      
      const query = `
        SELECT DISTINCT e.curso
        FROM estudiantes e
        WHERE e.estado = 'Activo' 
          AND e.email_apoderado IS NOT NULL 
          AND e.email_apoderado != ''
        ORDER BY e.curso
      `;
      
      const result = await pool.request().query(query);
      
      res.json({
        cursos: result.recordset.map(row => row.curso)
      });
      
    } catch (error) {
      logger.error(' Error al obtener cursos:', error);
      next(error);
    }
  }
}

module.exports = EstudianteController;
