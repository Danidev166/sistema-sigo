const ConfiguracionSistemaModel = require('../models/configuracionSistemaModel');

class ConfiguracionSistemaController {
  async obtenerTodos(_req, res) {
    try {
      const data = await ConfiguracionSistemaModel.obtenerTodos();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async obtenerPorId(req, res) {
    try {
      const data = await ConfiguracionSistemaModel.obtenerPorId(req.params.id);
      if (!data) return res.status(404).json({ error: 'No encontrado' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async crear(req, res) {
    try {
      const creado = await ConfiguracionSistemaModel.crear(req.body); // retorna registro
      res.status(201).json({ message: 'Creado correctamente', id: creado?.id || null, data: creado });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async actualizar(req, res) {
    try {
      await ConfiguracionSistemaModel.actualizar(req.params.id, req.body);
      res.json({ message: 'Actualizado correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async eliminar(req, res) {
    try {
      await ConfiguracionSistemaModel.eliminar(req.params.id);
      res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ConfiguracionSistemaController();
