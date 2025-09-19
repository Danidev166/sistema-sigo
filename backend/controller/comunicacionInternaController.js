const ComunicacionInternaModel = require('../models/comunicacionInternaModel');

class ComunicacionInternaController {
  async obtenerTodos(req, res) {
    try {
      const data = await ComunicacionInternaModel.obtenerTodos();
      res.json(data);
    } catch (error) {
      console.error(error); // Esto mostrará el error real en la consola
      res.status(500).json({ error: error.message });
    }
  }
  async obtenerPorId(req, res) {
    try {
      const data = await ComunicacionInternaModel.obtenerPorId(req.params.id);
      if (!data) return res.status(404).json({ error: 'No encontrado' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async crear(req, res) {
    try {
      const result = await ComunicacionInternaModel.crear(req.body);
      res.status(201).json({ message: 'Creado correctamente', id: result.insertId });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async actualizar(req, res) {
    try {
      await ComunicacionInternaModel.actualizar(req.params.id, req.body);
      res.json({ message: 'Actualizado correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async eliminar(req, res) {
    try {
      await ComunicacionInternaModel.eliminar(req.params.id);
      res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ComunicacionInternaController(); 