import api from "../../../services/axios";

const reporteService = {
  // 🚀 Resumen por estudiante (detalle individual)
  getResumenPorEstudiante: (id) =>
    api.get(`/reportes/estudiante/${id}`, { headers: { 'Cache-Control': 'no-cache' } }),

  // 🚀 Reporte general (para dashboard de reportes)
  getReporteGeneral: () =>
    api.get("/reportes/general", { headers: { 'Cache-Control': 'no-cache' } }),

  // 🚀 Gráfico asistencia mensual
  getGraficoAsistenciaMensual: () =>
  api.get("/reportes/graficos/asistencia-mensual", { headers: { 'Cache-Control': 'no-cache' } }),

  // 🚀 Gráfico motivos de entrevistas
  getGraficoMotivosEntrevistas: () =>
    api.get("/reportes/graficos/motivos-entrevistas", { headers: { 'Cache-Control': 'no-cache' } }),

  // Reporte de Estudiantes Atendidos
  getEstudiantesAtendidos: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/reportes/atendidos${query ? `?${query}` : ''}`);
  },

  // Reporte de Derivaciones
  getDerivaciones: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/reportes/derivaciones${query ? `?${query}` : ''}`);
  },

  // Reporte de Situaciones de Riesgo
  getSituacionesRiesgo: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/reportes/situaciones-riesgo${query ? `?${query}` : ''}`);
  },

  // Reporte de Asistencia a Citaciones
  getAsistenciaCitaciones: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/reportes/asistencia-citaciones${query ? `?${query}` : ''}`);
  },

  // Reporte General por Curso
  getGeneralPorCurso: () => 
    api.get("/reportes/general-por-curso"),

  // Reporte de Estadísticas Globales
  getEstadisticasGlobales: () => 
    api.get("/reportes/estadisticas-globales"),
};

export default reporteService;
