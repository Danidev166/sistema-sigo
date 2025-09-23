// src/features/recursos/services/movimientoService.js
import api from "../../../services/axios";

const handleError = (error) => {
  console.error("Error en MovimientoRecurso:", error);
  if (error.response) {
    console.error("Respuesta del servidor:", error.response.data);
  }
  throw error;
};

const movimientoService = {
  // Obtener todos los movimientos
  getMovimientos: async () => {
    try {
      return await api.get("/movimientos");
    } catch (error) {
      handleError(error);
    }
  },

  // Registrar un nuevo movimiento (entrada o salida)
  registrarMovimiento: async (data) => {
    try {
      return await api.post("/movimientos", data);
    } catch (error) {
      handleError(error);
    }
  },

  // Actualizar un movimiento existente
  actualizarMovimiento: async (id, data) => {
    try {
      return await api.put(`/movimientos/${id}`, data);
    } catch (error) {
      handleError(error);
    }
  },

  // Eliminar un movimiento
  eliminarMovimiento: async (id) => {
    try {
      return await api.delete(`/movimientos/${id}`);
    } catch (error) {
      handleError(error);
    }
  },
};

export default movimientoService;
