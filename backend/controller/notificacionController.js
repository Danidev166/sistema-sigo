const NotificacionModel = require('../models/notificacionModel');
const LogsActividadModel = require('../models/logsActividadModel');

class NotificacionController {
  async obtenerTodos(req, res) {
    try {
      const data = await NotificacionModel.obtenerTodos();
      res.json(data); // data debe ser un array
    } catch (error) {
      console.error('Error en notificacionController.obtenerTodos:', error);
      res.status(500).json({ error: error.message });
    }
  }
  async obtenerPorId(req, res) {
    try {
      const data = await NotificacionModel.obtenerPorId(req.params.id);
      if (!data) return res.status(404).json({ error: 'No encontrado' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async crear(req, res) {
    try {
      const result = await NotificacionModel.crear(req.body);
      res.status(201).json({ message: 'Creado correctamente', id: result.insertId });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Crear',
        tabla_afectada: 'notificaciones',
        id_registro: result.insertId,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(req.body),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async actualizar(req, res) {
    try {
      // Obtener datos anteriores (opcional)
      // const prev = await NotificacionModel.obtenerPorId(req.params.id);
      await NotificacionModel.actualizar(req.params.id, req.body);
      res.json({ message: 'Actualizado correctamente' });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'notificaciones',
        id_registro: req.params.id,
        datos_anteriores: null, // Puedes agregar prev si lo deseas
        datos_nuevos: JSON.stringify(req.body),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async eliminar(req, res) {
    try {
      // Obtener datos anteriores (opcional)
      // const prev = await NotificacionModel.obtenerPorId(req.params.id);
      await NotificacionModel.eliminar(req.params.id);
      res.json({ message: 'Eliminado correctamente' });
      // Auditoría
      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar',
        tabla_afectada: 'notificaciones',
        id_registro: req.params.id,
        datos_anteriores: null, // Puedes agregar prev si lo deseas
        datos_nuevos: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async marcarComoLeida(req, res) {
    try {
      await NotificacionModel.marcarComoLeida(req.params.id, req.body.leida);
      res.json({ message: 'Estado de lectura actualizado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new NotificacionController(); 