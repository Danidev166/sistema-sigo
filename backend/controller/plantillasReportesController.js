const PlantillasReportesModel = require('../models/plantillasReportesModel');

class PlantillasReportesController {
  async obtenerTodos(req, res) {
    try {
      const data = await PlantillasReportesModel.obtenerTodos();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async obtenerPorId(req, res) {
    try {
      const data = await PlantillasReportesModel.obtenerPorId(req.params.id);
      if (!data) return res.status(404).json({ error: 'No encontrado' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async crear(req, res) {
    try {
      // Preparar datos para el modelo
      const datos = {
        ...req.body,
        creado_por: req.body.creado_por || req.user?.id || 1, // Usar ID del usuario autenticado o 1 por defecto
        activa: req.body.activa !== undefined ? req.body.activa : true
      };

      // Si vienen columnas del frontend, convertir a configuracion JSON
      if (req.body.columnas && Array.isArray(req.body.columnas)) {
        datos.configuracion = JSON.stringify({
          columnas: req.body.columnas,
          orden: req.body.columnas,
          filtros: [],
          agrupaciones: []
        });
      }

      const result = await PlantillasReportesModel.crear(datos);
      res.status(201).json({ message: 'Creado correctamente', id: result.insertId });
    } catch (error) {
      console.error('Error al crear plantilla:', error);
      res.status(400).json({ error: error.message });
    }
  }
  async actualizar(req, res) {
    try {
      // Preparar datos para el modelo
      const datos = {
        ...req.body,
        activa: req.body.activa !== undefined ? req.body.activa : true
      };

      // Si vienen columnas del frontend, convertir a configuracion JSON
      if (req.body.columnas && Array.isArray(req.body.columnas)) {
        datos.configuracion = JSON.stringify({
          columnas: req.body.columnas,
          orden: req.body.columnas,
          filtros: [],
          agrupaciones: []
        });
      }

      await PlantillasReportesModel.actualizar(req.params.id, datos);
      res.json({ message: 'Actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar plantilla:', error);
      res.status(400).json({ error: error.message });
    }
  }
  async eliminar(req, res) {
    try {
      await PlantillasReportesModel.eliminar(req.params.id);
      res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PlantillasReportesController(); 