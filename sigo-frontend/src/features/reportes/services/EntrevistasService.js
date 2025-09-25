import api from "../../../services/axios";

const entrevistasService = {
  // Obtener todas las entrevistas
  async getEntrevistas(filtros = {}) {
    try {
      const response = await api.get('/entrevistas', { params: filtros });
      return response.data;
    } catch (error) {
      console.error('Error al obtener entrevistas:', error);
      throw error;
    }
  },

  // Obtener entrevistas por estudiante
  async getEntrevistasPorEstudiante(estudianteId) {
    try {
      const response = await api.get(`/entrevistas/estudiante/${estudianteId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener entrevistas del estudiante:', error);
      throw error;
    }
  },

  // Obtener estadísticas de entrevistas
  async getEstadisticasEntrevistas(filtros = {}) {
    try {
      const response = await api.get('/entrevistas/estadisticas', { params: filtros });
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de entrevistas:', error);
      throw error;
    }
  },

  // Obtener motivos de entrevistas para gráficos
  async getMotivosEntrevistas() {
    try {
      const response = await api.get('/reportes/graficos/motivos-entrevistas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener motivos de entrevistas:', error);
      throw error;
    }
  }
};

export default entrevistasService;
