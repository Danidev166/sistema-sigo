/**
 * Servicio para gestión de apoderados
 * Obtiene lista de apoderados con filtros y paginación
 */

import axios from '../services/axios';

const apoderadosService = {
  /**
   * Obtener todos los apoderados con filtros
   * @param {Object} filtros - Filtros de búsqueda
   * @param {string} filtros.curso - Filtro por curso
   * @param {string} filtros.nombre - Filtro por nombre
   * @param {string} filtros.email - Filtro por email
   * @param {number} filtros.limit - Límite de resultados
   * @param {number} filtros.offset - Offset para paginación
   */
  async obtenerApoderados(filtros = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filtros.curso) params.append('curso', filtros.curso);
      if (filtros.nombre) params.append('nombre', filtros.nombre);
      if (filtros.email) params.append('email', filtros.email);
      if (filtros.limit) params.append('limit', filtros.limit);
      if (filtros.offset) params.append('offset', filtros.offset);
      
      const response = await axios.get(`/estudiantes/apoderados?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener apoderados:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de apoderados
   */
  async obtenerEstadisticas() {
    try {
      const response = await axios.get('/estudiantes/apoderados/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  /**
   * Obtener lista de cursos disponibles
   */
  async obtenerCursos() {
    try {
      const response = await axios.get('/estudiantes/cursos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      throw error;
    }
  }
};

export default apoderadosService;
