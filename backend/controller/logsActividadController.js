const LogsActividadModel = require('../models/logsActividadModel');

class LogsActividadController {
  async obtenerTodos(req, res) {
    try {
      // Extraer filtros de query params
      const filtros = {
        usuario: req.query.usuario || null, // nombre o id
        accion: req.query.accion || null,
        tabla: req.query.tabla || null,
        fecha_desde: req.query.fecha_desde || null,
        fecha_hasta: req.query.fecha_hasta || null,
        ip: req.query.ip || null,
      };
      const data = await LogsActividadModel.obtenerTodos(filtros);
      res.json(data.recordset || data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async obtenerPorId(req, res) {
    try {
      const data = await LogsActividadModel.obtenerPorId(req.params.id);
      if (!data) return res.status(404).json({ error: 'No encontrado' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async crear(req, res) {
    try {
      const result = await LogsActividadModel.crear(req.body);
      res.status(201).json({ message: 'Creado correctamente', id: result.insertId });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async eliminar(req, res) {
    try {
      await LogsActividadModel.eliminar(req.params.id);
      res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new LogsActividadController(); 