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
};

export default reporteService;
