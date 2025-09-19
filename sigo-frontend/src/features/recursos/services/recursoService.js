// src/features/recursos/services/recursoService.js
import api from "../../../services/axios";

const handleError = (error) => {
  console.error("Error en la petición:", error);
  if (error.response) {
    console.error("Respuesta del servidor:", error.response.data);
  }
  throw error;
};

const recursoService = {
  // 📦 Inventario de Recursos
  getRecursos: async () => {
    try {
      return await api.get("/recursos");
    } catch (error) {
      handleError(error);
    }
  },

  getRecursoById: async (id) => {
    try {
      return await api.get(`/recursos/${id}`);
    } catch (error) {
      handleError(error);
    }
  },

  crearRecurso: async (data) => {
    try {
      return await api.post("/recursos", data);
    } catch (error) {
      handleError(error);
    }
  },

  actualizarRecurso: async (id, data) => {
    try {
      return await api.put(`/recursos/${id}`, data);
    } catch (error) {
      handleError(error);
    }
  },

  eliminarRecurso: async (id) => {
    try {
      return await api.delete(`/recursos/${id}`);
    } catch (error) {
      handleError(error);
    }
  },

  // 📤 Entregas de Recursos
 getEntregas: async () => {
  try {
    return await api.get("/recursos/entregas"); // <-- Esta es la ruta real
  } catch (error) {
    handleError(error);
  }
},


  getEntregasPorEstudiante: async (idEstudiante) => {
    try {
      return await api.get(`/recursos/entregas/estudiante/${idEstudiante}`);
    } catch (error) {
      handleError(error);
    }
  },

  registrarEntrega: async (data) => {
    try {
      return await api.post("/recursos/entregas", data);
    } catch (error) {
      handleError(error);
    }
  },
};

export default recursoService;
