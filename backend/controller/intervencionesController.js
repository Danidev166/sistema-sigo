const model = require("../models/intervencionesModel");
const logger = require("../utils/logger"); //  Importar logger

const IntervencionController = {
  async crear(req, res, next) {
    try {
      await model.crear(req.body);
      res.status(201).json({ message: " Intervención registrada" });
    } catch (err) {
      logger.error(" Error al crear intervención: " + err.message);
      next(err);
    }
  },

  async obtenerTodos(req, res, next) {
    try {
      const datos = await model.obtenerTodos();
      res.json(datos);
    } catch (err) {
      logger.error(" Error al obtener intervenciones: " + err.message);
      next(err);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const dato = await model.obtenerPorId(req.params.id);
      if (!dato) {
        logger.warn(" Intervención no encontrada con ID: " + req.params.id);
        return res.status(404).json({ error: " No encontrado" });
      }
      res.json(dato);
    } catch (err) {
      logger.error(" Error al obtener intervención por ID: " + err.message);
      next(err);
    }
  },

  async actualizar(req, res, next) {
    try {
      await model.actualizar(req.params.id, req.body);
      res.json({ message: " Intervención actualizada" });
    } catch (err) {
      logger.error(" Error al actualizar intervención: " + err.message);
      next(err);
    }
  },

  async eliminar(req, res, next) {
    try {
      await model.eliminar(req.params.id);
      res.json({ message: " Intervención eliminada" });
    } catch (err) {
      logger.error(" Error al eliminar intervención: " + err.message);
      next(err);
    }
  }
};

module.exports = IntervencionController;
