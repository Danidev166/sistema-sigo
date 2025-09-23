const ConfiguracionModel = require('../models/configuracionModel');
const logger = require('../utils/logger');
const LogsActividadModel = require('../models/logsActividadModel');
const { getPool } = require('../config/db');

const configuracionController = {
  async listar(_req, res) {
    try {
      const datos = await ConfiguracionModel.listar();
      res.json(datos);
    } catch (error) {
      logger.error('Error al listar configuraciones:', error);
      res.status(500).json({ error: 'Error al obtener configuraciones', detalles: error.message });
    }
  },

  async obtenerPorTipo(req, res) {
    try {
      const { tipo } = req.params;
      const tiposValidos = ['institucional', 'personalizacion', 'politicas', 'email'];
      if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({ error: 'Tipo de configuración inválido', tiposValidos });
      }

      const datos = await ConfiguracionModel.obtenerPorTipo(tipo);
      if (!datos || Object.keys(datos).length === 0) {
        return res.status(404).json({ error: `No se encontraron configuraciones para el tipo: ${tipo}` });
      }

      const configuraciones = Object.entries(datos).map(([clave, valor]) => ({ clave, valor }));
      res.json(configuraciones);
    } catch (error) {
      logger.error('Error al obtener configuraciones por tipo:', error);
      res.status(500).json({ error: 'Error al obtener configuraciones', detalles: error.message });
    }
  },

  async crear(req, res) {
    try {
      const data = {
        ...req.body,
        usuario_modificacion: req.user?.email || 'sistema'
      };
      await ConfiguracionModel.crear(data);

      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Crear',
        tabla_afectada: 'configuracion',
        id_registro: null,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(data),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });

      res.status(201).json({ mensaje: 'Configuración creada correctamente' });
    } catch (error) {
      logger.error('Error al crear configuración:', error);
      res.status(500).json({ error: 'Error al crear configuración', detalles: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const { tipo } = req.params;
      const payload = req.body;

      if (!Array.isArray(payload)) {
        return res.status(400).json({
          error: 'El cuerpo de la solicitud debe ser un array de objetos con clave y valor'
        });
      }

      const valores = {};
      payload.forEach(item => {
        if (item.clave && item.valor !== undefined) valores[item.clave] = item.valor;
      });

      const data = {
        valores,
        usuario_modificacion: req.user?.email || 'sistema'
      };

      await ConfiguracionModel.actualizar(tipo, data);

      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'configuracion',
        id_registro: null, // Cambiado de 'tipo' a null para evitar error de validación
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(data),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });

      res.json({ mensaje: 'Configuración actualizada correctamente' });
    } catch (error) {
      logger.error('Error al actualizar configuración:', error);
      res.status(500).json({ error: 'Error al actualizar configuración', detalles: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await ConfiguracionModel.eliminar(id);

      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar',
        tabla_afectada: 'configuracion',
        id_registro: id,
        datos_anteriores: null,
        datos_nuevos: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });

      res.json({ mensaje: 'Configuración eliminada correctamente' });
    } catch (error) {
      logger.error('Error al eliminar configuración:', error);
      res.status(500).json({ error: 'Error al eliminar configuración', detalles: error.message });
    }
  },

  // 📊 estadísticas reales con PG
  async obtenerEstadisticas(_req, res) {
    try {
      const pool = await getPool();
      const q = async (sql) => {
        const r = await pool.request().query(sql);
        return Number(r.recordset[0]?.total) || 0;
      };

      const [
        estudiantes,
        usuarios,
        evaluaciones,
        entrevistas,
        intervenciones,
        recursos
      ] = await Promise.all([
        q("SELECT COUNT(*)::int AS total FROM estudiantes"),
        q("SELECT COUNT(*)::int AS total FROM usuarios"),
        q("SELECT COUNT(*)::int AS total FROM evaluaciones_vocacionales"),
        q("SELECT COUNT(*)::int AS total FROM entrevistas"),
        q("SELECT COUNT(*)::int AS total FROM intervenciones"),
        q("SELECT COUNT(*)::int AS total FROM recursos")
      ]);

      const estadisticas = {
        estudiantes, usuarios, evaluaciones, entrevistas, intervenciones, recursos,
        ultimaActividad: new Date().toISOString(),
        estadoSistema: 'activo'
      };

      res.json(estadisticas);
    } catch (error) {
      logger.error('❌ Error al obtener estadísticas:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas del sistema', detalles: error.message });
    }
  }
};

module.exports = configuracionController;
