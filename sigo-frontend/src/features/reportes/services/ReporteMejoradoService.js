import api from "../../../services/axios";

const reporteMejoradoService = {
  // 📊 Reportes de Datos Reales
  getEstudiantesPorCurso: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/reportes-mejorado/estudiantes-por-curso${query ? `?${query}` : ''}`);
  },

  getReporteInstitucional: () => 
    api.get("/reportes-mejorado/institucional"),

  getReporteAsistencia: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/reportes-mejorado/asistencia${query ? `?${query}` : ''}`);
  },

  // 📈 Dashboard y KPIs
  getDashboardKPIs: () => 
    api.get("/reportes-mejorado/dashboard"),

  // 📊 Gráficos
  getGraficoAsistenciaMensual: () => 
    api.get("/reportes-mejorado/graficos/asistencia-mensual"),

  getGraficoMotivosEntrevistas: () => 
    api.get("/reportes-mejorado/graficos/motivos-entrevistas"),
};

export default reporteMejoradoService;
