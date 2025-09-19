const HistorialModel = require("../models/historialAcademicoModel");

const obtenerTodos = async (req, res) => {
  try {
    const historial = await HistorialModel.obtenerTodos();
    res.json(historial);
  } catch (error) {
    console.error("Error al obtener todos los historiales:", error);
    res.status(500).json({ error: "Error al obtener los historiales." });
  }
};

const obtenerPorEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const anio = req.query.anio || null;
    console.log("📥 Recibido ID:", id, "Año:", anio); // Debug
    const historial = await HistorialModel.obtenerPorEstudiante(id, anio);
    res.json(historial);
  } catch (error) {
    console.error("Error al obtener historial por estudiante:", error);
    res.status(500).json({ error: "Error al obtener historial." });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const historial = await HistorialModel.obtenerPorId(id);
    if (!historial) {
      return res.status(404).json({ error: "Historial no encontrado." });
    }
    res.json(historial);
  } catch (error) {
    console.error("Error al obtener historial por ID:", error);
    res.status(500).json({ error: "Error al obtener historial." });
  }
};

const crear = async (req, res) => {
  try {
    const nuevoHistorial = await HistorialModel.crear(req.body);
    res.status(201).json(nuevoHistorial);
  } catch (error) {
    console.error("Error al crear historial:", error);
    res.status(500).json({ error: "Error al crear historial." });
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    await HistorialModel.actualizar(id, req.body);
    res.json({ mensaje: "Historial actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar historial:", error);
    res.status(500).json({ error: "Error al actualizar historial." });
  }
};

const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await HistorialModel.eliminar(id);
    res.json({ mensaje: "Historial eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar historial:", error);
    res.status(500).json({ error: "Error al eliminar historial." });
  }
};

module.exports = {
  obtenerTodos,
  obtenerPorEstudiante,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
