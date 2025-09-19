import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.18.10:3001/api';

const evaluacionesService = {
  // Enviar test vocacional por email
  async enviarTestPorEmail(data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/evaluaciones/enviar-email`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error enviando test por email:', error);
      throw error;
    }
  }
};

export default evaluacionesService;



