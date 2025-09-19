/**
 * Servicio para manejar evaluaciones vocacionales desde dispositivos móviles
 * 
 * Integra con el backend real para guardar resultados de test
 * 
 * @service
 */
import api from '../../../services/axios';

const evaluacionMobileService = {
  /**
   * Guarda una evaluación vocacional en el backend
   * @param {Object} evaluacionData - Datos de la evaluación
   * @param {number} evaluacionData.id_estudiante - ID del estudiante
   * @param {string} evaluacionData.tipo_evaluacion - Tipo de test (Kuder, Holland, Aptitudes)
   * @param {Object} evaluacionData.resultados - Resultados del test
   * @param {string} evaluacionData.nombre_completo - Nombre completo del estudiante
   * @param {string} evaluacionData.curso - Curso del estudiante
   * @returns {Promise<Object>} Evaluación guardada
   */
  async guardarEvaluacion(evaluacionData) {
    try {
      // Debug logs removidos para producción
      
      const response = await api.post('/evaluaciones', evaluacionData);

      // Evaluación guardada exitosamente
      return response.data;
    } catch (error) {
      console.error('Error al guardar evaluación:', error);
      console.error('❌ Error completo:', error);
      throw new Error(`Error al guardar evaluación: ${error.response?.data?.error || error.message}`);
    }
  },

  /**
   * Obtiene evaluaciones de un estudiante específico
   * @param {number} idEstudiante - ID del estudiante
   * @returns {Promise<Array>} Lista de evaluaciones
   */
  async obtenerEvaluacionesPorEstudiante(idEstudiante) {
    try {
      const response = await api.get(`/evaluaciones?estudiante=${idEstudiante}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener evaluaciones:', error);
      throw new Error(`Error al obtener evaluaciones: ${error.response?.data?.error || error.message}`);
    }
  },

  /**
   * Procesa y formatea los resultados de un test para guardar
   * @param {string} tipoTest - Tipo de test (kuder, holland, aptitudes)
   * @param {Object} resultados - Resultados del test
   * @param {Object} estudiante - Datos del estudiante
   * @returns {Object} Datos formateados para guardar
   */
  procesarResultadosParaGuardar(tipoTest, resultados, estudiante) {
    const tipoEvaluacion = this.mapearTipoTest(tipoTest);
    const fechaActual = new Date().toISOString();
    
    // Crear objeto de resultados con metadatos
    const resultadosCompletos = {
      ...resultados,
      fecha_completado: fechaActual,
      dispositivo: 'móvil',
      version_test: '1.0'
    };
    
    return {
      id_estudiante: parseInt(estudiante.id),
      tipo_evaluacion: tipoEvaluacion,
      resultados: JSON.stringify(resultadosCompletos), // Convertir a string para el backend
      fecha_evaluacion: fechaActual,
      nombre_completo: `${estudiante.nombre} ${estudiante.apellido}`,
      curso: estudiante.curso || 'No especificado'
    };
  },

  /**
   * Mapea el tipo de test a formato del backend
   * @param {string} tipoTest - Tipo de test (kuder, holland, aptitudes)
   * @returns {string} Tipo formateado para el backend
   */
  mapearTipoTest(tipoTest) {
    const mapeo = {
      'kuder': 'Kuder',
      'holland': 'Holland',
      'aptitudes': 'Aptitudes'
    };
    return mapeo[tipoTest] || tipoTest;
  }
};

export default evaluacionMobileService;
