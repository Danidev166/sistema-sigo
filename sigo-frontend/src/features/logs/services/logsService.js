import axios from '../../../services/axios';

class LogsService {
  async obtenerTodos(filtros = {}) {
    try {
      // Construir query string a partir de filtros
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await axios.get(`/logs-actividad${params.toString() ? '?' + params.toString() : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener logs:', error);
      throw error;
    }
  }

  async obtenerTodosPaginado(filtros = {}, page = 1, limit = 10) {
    try {
      // Construir query string a partir de filtros y paginación
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('page', page);
      params.append('limit', limit);
      
      const response = await axios.get(`/logs-actividad?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener logs paginados:', error);
      throw error;
    }
  }

  async obtenerPorId(id) {
    try {
      const response = await axios.get(`/logs-actividad/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener log:', error);
      throw error;
    }
  }

  async crear(logData) {
    try {
      const response = await axios.post('/logs-actividad', logData);
      return response.data;
    } catch (error) {
      console.error('Error al crear log:', error);
      throw error;
    }
  }

  async eliminar(id) {
    try {
      const response = await axios.delete(`/logs-actividad/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar log:', error);
      throw error;
    }
  }
}

export default new LogsService(); 