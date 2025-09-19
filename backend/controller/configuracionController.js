const ConfiguracionModel = require('../models/configuracionModel');
const logger = require('../utils/logger');
const LogsActividadModel = require('../models/logsActividadModel');

const configuracionController = {
  async listar(req, res) {
    try {
      const datos = await ConfiguracionModel.listar();
      res.json(datos);
    } catch (error) {
      logger.error('Error al listar configuraciones:', error);
      res.status(500).json({ 
        error: 'Error al obtener configuraciones',
        detalles: error.message 
      });
    }
  },

  async obtenerPorTipo(req, res) {
    try {
      const { tipo } = req.params;
      const tiposValidos = ['institucional', 'personalizacion', 'politicas', 'email'];

      if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({ 
          error: 'Tipo de configuración inválido',
          tiposValidos 
        });
      }

      const datos = await ConfiguracionModel.obtenerPorTipo(tipo);

      if (!datos || Object.keys(datos).length === 0) {
        return res.status(404).json({ 
          error: `No se encontraron configuraciones para el tipo: ${tipo}` 
        });
      }

      // Transformar objeto a array de objetos
      const configuraciones = Object.entries(datos).map(([clave, valor]) => ({
        clave,
        valor
      }));

      res.json(configuraciones);
    } catch (error) {
      logger.error('Error al obtener configuraciones por tipo:', error);
      res.status(500).json({ 
        error: 'Error al obtener configuraciones',
        detalles: error.message 
      });
    }
  },

  async crear(req, res) {
    try {
      const data = { 
        ...req.body, 
        usuario_modificacion: req.usuario?.email || 'sistema' 
      };
      await ConfiguracionModel.crear(data);
      
      // Auditoría
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
      res.status(500).json({ 
        error: 'Error al crear configuración',
        detalles: error.message 
      });
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
        if (item.clave && item.valor !== undefined) {
          valores[item.clave] = item.valor;
        }
      });

      const data = { 
        valores,
        usuario_modificacion: req.usuario?.email || 'sistema'
      };

      // Obtener datos anteriores (opcional, según modelo)
      // const prev = await ConfiguracionModel.obtenerPorTipo(tipo);
      await ConfiguracionModel.actualizar(tipo, data);
      
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'configuracion',
        id_registro: tipo,
        datos_anteriores: null, // Puedes agregar prev si lo deseas
        datos_nuevos: JSON.stringify(data),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
      
      res.json({ mensaje: 'Configuración actualizada correctamente' });
    } catch (error) {
      logger.error('Error al actualizar configuración:', error);
      res.status(500).json({ 
        error: 'Error al actualizar configuración',
        detalles: error.message 
      });
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      // Obtener datos anteriores (opcional, según modelo)
      // const prev = await ConfiguracionModel.obtenerPorId(id);
      await ConfiguracionModel.eliminar(id);
      
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar',
        tabla_afectada: 'configuracion',
        id_registro: id,
        datos_anteriores: null, // Puedes agregar prev si lo deseas
        datos_nuevos: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
      
      res.json({ mensaje: 'Configuración eliminada correctamente' });
    } catch (error) {
      logger.error('Error al eliminar configuración:', error);
      res.status(500).json({ 
        error: 'Error al eliminar configuración',
        detalles: error.message 
      });
    }
  },

  async obtenerEstadisticas(req, res) {
    try {
      logger.info('📊 Obteniendo estadísticas reales del sistema...');
      
      // Verificar conexión a la base de datos
      const { sql, poolPromise } = require('../config/db');
      const pool = await poolPromise;

      logger.info('✅ Conexión a la base de datos establecida');

      // Consultas directas a la base de datos para obtener conteos reales
      const [
        estudiantesResult,
        usuariosResult,
        evaluacionesResult,
        entrevistasResult,
        intervencionesResult,
        recursosResult
      ] = await Promise.all([
        pool.request().query('SELECT COUNT(*) as total FROM Estudiantes').catch((err) => {
          logger.warn('⚠️ Error al contar estudiantes:', err.message);
          return { recordset: [{ total: 0 }] };
        }),
        pool.request().query('SELECT COUNT(*) as total FROM Usuarios').catch((err) => {
          logger.warn('⚠️ Error al contar usuarios:', err.message);
          return { recordset: [{ total: 0 }] };
        }),
        pool.request().query('SELECT COUNT(*) as total FROM Evaluaciones_Vocacionales').catch((err) => {
          logger.warn('⚠️ Error al contar evaluaciones:', err.message);
          return { recordset: [{ total: 0 }] };
        }),
        pool.request().query('SELECT COUNT(*) as total FROM Entrevistas').catch((err) => {
          logger.warn('⚠️ Error al contar entrevistas:', err.message);
          return { recordset: [{ total: 0 }] };
        }),
        pool.request().query('SELECT COUNT(*) as total FROM Intervenciones').catch((err) => {
          logger.warn('⚠️ Error al contar intervenciones:', err.message);
          return { recordset: [{ total: 0 }] };
        }),
        pool.request().query('SELECT COUNT(*) as total FROM Recursos').catch((err) => {
          logger.warn('⚠️ Error al contar recursos:', err.message);
          return { recordset: [{ total: 0 }] };
        })
      ]);

      const estadisticas = {
        estudiantes: Number(estudiantesResult.recordset[0]?.total) || 0,
        usuarios: Number(usuariosResult.recordset[0]?.total) || 0,
        evaluaciones: Number(evaluacionesResult.recordset[0]?.total) || 0,
        entrevistas: Number(entrevistasResult.recordset[0]?.total) || 0,
        intervenciones: Number(intervencionesResult.recordset[0]?.total) || 0,
        recursos: Number(recursosResult.recordset[0]?.total) || 0,
        ultimaActividad: new Date().toISOString(),
        estadoSistema: 'activo'
      };

      logger.info('✅ Estadísticas obtenidas:', estadisticas);
      res.json(estadisticas);
    } catch (error) {
      logger.error('❌ Error al obtener estadísticas:', error);
      res.status(500).json({ 
        error: 'Error al obtener estadísticas del sistema',
        detalles: error.message 
      });
    }
  }
};

module.exports = configuracionController;
