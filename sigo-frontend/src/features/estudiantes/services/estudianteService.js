// src/features/estudiantes/services/estudianteService.js
import api from "../../../services/axios";

const estudianteService = {
  // Estudiantes
  getEstudiantes: () =>
    api.get("/estudiantes", { headers: { "Cache-Control": "no-cache" } }),
  getEstudiantesActivos: () => api.get("/estudiantes/activos"),
  getEstudianteById: (id) => api.get(`/estudiantes/${id}`),
 getEstudiantesPaginados: (page = 1, limit = 10, search = "") =>
  api.get(`/estudiantes/paginado?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),


  createEstudiante: (data) => api.post("/estudiantes", data),
  updateEstudiante: (id, data) => api.put(`/estudiantes/${id}`, data),
  deleteEstudiante: (id) => api.delete(`/estudiantes/${id}`),
  createBulk: (estudiantes) => api.post("/estudiantes/masivo", estudiantes),

  // Seguimiento Académico (detalle por asignatura)
  getSeguimientoAcademico: (idEstudiante, anio) =>
    api.get(`/seguimiento-academico/estudiante/${idEstudiante}?anio=${anio}`),

  getSeguimientoPorId: (id) => api.get(`/seguimiento-academico/${id}`),

  crearSeguimiento: (data) => api.post("/seguimiento-academico", data),

  actualizarSeguimiento: (id, data) =>
    api.put(`/seguimiento-academico/${id}`, data),

  eliminarSeguimiento: (id) => api.delete(`/seguimiento-academico/${id}`),

  // Historial Académico (resumen general)
  // Historial Académico (resumen general)
  getHistorialAcademico: (idEstudiante, anio) =>
    api.get(`/historial-academico/estudiante/${idEstudiante}?anio=${anio}`),

  crearHistorialAcademico: (data) => api.post("/historial-academico", data),
  actualizarHistorialAcademico: (id, data) =>
    api.put(`/historial-academico/${id}`, data),
  eliminarHistorialAcademico: (id) => api.delete(`/historial-academico/${id}`),

  // Evaluaciones Vocacionales
  getEvaluaciones: (idEstudiante) =>
    api.get(`/evaluaciones?id_estudiante=${idEstudiante}`),
  crearEvaluacion: (data) => api.post("/evaluaciones", data),
  actualizarEvaluacion: (id, data) => api.put(`/evaluaciones/${id}`, data),
  eliminarEvaluacion: (id) => api.delete(`/evaluaciones/${id}`),

  // Conducta
  getConducta: (idEstudiante) =>
    api.get(`/conducta/estudiante/${idEstudiante}`),
  crearConducta: (data) => api.post("/conducta", data),
  actualizarConducta: (id, data) => api.put(`/conducta/${id}`, data),
  eliminarConducta: (id) => api.delete(`/conducta/${id}`),

  // Asistencia
  getAsistencia: (idEstudiante) =>
    api.get(`/asistencia?id_estudiante=${idEstudiante}`),
  crearAsistencia: (data) => api.post("/asistencia", data),
  actualizarAsistencia: (id, data) => api.put(`/asistencia/${id}`, data),
  eliminarAsistencia: (id) => api.delete(`/asistencia/${id}`),

  // Entrevistas
  getEntrevistas: (idEstudiante, estado = "realizada") =>
    api.get(`/entrevistas/estudiante/${idEstudiante}?estado=${estado}`),

  crearEntrevista: (data) => api.post("/entrevistas", data),
  actualizarEntrevista: (id, data) => api.put(`/entrevistas/${id}`, data),
  eliminarEntrevista: (id) => api.delete(`/entrevistas/${id}`),

  // Intervenciones
  getIntervenciones: (idEstudiante) =>
    api.get(`/intervenciones?id_estudiante=${idEstudiante}`),
  crearIntervencion: (data) => api.post("/intervenciones", data),
  actualizarIntervencion: (id, data) => api.put(`/intervenciones/${id}`, data),
  eliminarIntervencion: (id) => api.delete(`/intervenciones/${id}`),

  // Comunicación Familia
  getComunicacionFamilia: (idEstudiante) =>
    api.get(`/comunicacion-familia?id_estudiante=${idEstudiante}`),
  crearComunicacion: (data) => api.post("/comunicacion-familia", data),
  actualizarComunicacion: (id, data) =>
    api.put(`/comunicacion-familia/${id}`, data),
  eliminarComunicacion: (id) => api.delete(`/comunicacion-familia/${id}`),

  // Consolidado
  getVistaConsolidada: (idEstudiante) =>
    api.get(`/reportes/estudiante/${idEstudiante}`),

  // Estudiantes para selección general (por ejemplo en Agenda)
  getAll: () => api.get("/estudiantes"),

 // Recursos entregados
getRecursosEntregados: (idEstudiante) =>
  api.get(`/entregas/estudiante/${idEstudiante}`),

};

export default estudianteService;
