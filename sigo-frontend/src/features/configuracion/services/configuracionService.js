import api from '../../../services/axios';

const BASE_URL = '/configuracion';

const configuracionService = {
  listar: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  obtenerPorTipo: async (tipo) => {
    try {
      const response = await api.get(`${BASE_URL}/tipo/${tipo}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener configuración de tipo ${tipo}:`, error);
      throw error;
    }
  },

  obtenerPersonalizacion: async () => {
    try {
      const response = await api.get(`${BASE_URL}/tipo/personalizacion`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener configuración de personalización:', error);
      throw error;
    }
  },

  guardarPersonalizacion: async (data) => {
    try {
      const response = await api.put(`${BASE_URL}/tipo/personalizacion`, data);
      return response.data;
    } catch (error) {
      console.error('Error al guardar configuración de personalización:', error);
      throw error;
    }
  },

  obtenerPoliticas: async () => {
    try {
      const response = await api.get(`${BASE_URL}/tipo/politicas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener políticas:', error);
      throw error;
    }
  },

  guardarPoliticas: async (data) => {
    try {
      const response = await api.put(`${BASE_URL}/tipo/politicas`, data);
      return response.data;
    } catch (error) {
      console.error('Error al guardar políticas:', error);
      throw error;
    }
  },

  crear: async (data) => {
    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error('Error al crear configuración:', error);
      throw error;
    }
  },

  actualizar: async (tipo, data) => {
    try {
      const response = await api.put(`${BASE_URL}/tipo/${tipo}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar configuración de tipo ${tipo}:`, error);
      throw error;
    }
  },

  eliminar: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar configuración:', error);
      throw error;
    }
  },

  obtenerEstadisticas: async () => {
    try {
      const response = await api.get(`${BASE_URL}/estadisticas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  ejecutarHerramienta: async (herramienta, parametros = {}) => {
    try {
      const response = await api.post(`${BASE_URL}/herramientas/${herramienta}`, parametros);
      return response.data;
    } catch (error) {
      console.error(`Error al ejecutar herramienta ${herramienta}:`, error);
      throw error;
    }
  },

  probarEmail: async (configuracion) => {
    try {
      const response = await api.post(`${BASE_URL}/email/probar`, configuracion);
      return response.data;
    } catch (error) {
      console.error('Error al probar email:', error);
      throw error;
    }
  }
};

export default configuracionService;
