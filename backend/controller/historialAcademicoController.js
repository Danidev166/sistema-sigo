const HistorialModel = require("../models/historialAcademicoModel");
const SeguimientoAcademicoModel = require("../models/seguimientoAcademicoModel");
const AsistenciaModel = require("../models/asistenciaModel");

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
    const { id_estudiante, promedio_general, asistencia, observaciones_academicas } = req.body;
    
    // Validar que el estudiante existe (opcional pero recomendado)
    // const estudiante = await EstudianteModel.obtenerPorId(id_estudiante);
    // if (!estudiante) {
    //   return res.status(404).json({ error: "Estudiante no encontrado." });
    // }

    // Calcular automáticamente si no se proporcionan valores
    let promedioCalculado = promedio_general;
    let asistenciaCalculada = asistencia;

    if (!promedio_general || !asistencia) {
      // Obtener datos de seguimiento y asistencia para cálculo automático
      const seguimientoData = await SeguimientoAcademicoModel.obtenerPorEstudiante(id_estudiante);
      const asistenciaData = await AsistenciaModel.obtenerPorEstudiante(id_estudiante);

      // Calcular promedio si no se proporciona
      if (!promedio_general && seguimientoData.length > 0) {
        const notas = seguimientoData
          .map(s => s.rendimiento || s.nota)
          .filter(n => n && !isNaN(n));
        
        if (notas.length > 0) {
          promedioCalculado = (notas.reduce((sum, nota) => sum + parseFloat(nota), 0) / notas.length).toFixed(1);
        }
      }

      // Calcular asistencia si no se proporciona
      if (!asistencia && asistenciaData.length > 0) {
        const presentes = asistenciaData.filter(a => 
          a.tipo === 'Presente' || a.tipo === 'Justificada'
        ).length;
        
        asistenciaCalculada = ((presentes / asistenciaData.length) * 100).toFixed(1);
      }
    }

    const datosHistorial = {
      ...req.body,
      promedio_general: parseFloat(promedioCalculado) || 0,
      asistencia: parseFloat(asistenciaCalculada) || 0,
      fecha_actualizacion: new Date()
    };

    const nuevoHistorial = await HistorialModel.crear(datosHistorial);
    
    res.status(201).json({
      ...nuevoHistorial,
      calculado_automaticamente: {
        promedio: !promedio_general,
        asistencia: !asistencia
      }
    });
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
