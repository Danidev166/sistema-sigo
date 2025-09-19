// src/features/agenda/services/agendaService.js
import api from "../../../services/axios";

const agendaService = {
  // Obtener todas las agendas
  getAll: () => api.get("/agenda"),

  // Obtener una agenda por ID
  getById: (id) => api.get(`/agenda/${id}`),

  // Crear una nueva agenda
  crear: (data) => api.post("/agenda", data),

  // Actualizar una agenda existente
  actualizar: (id, data) => api.put(`/agenda/${id}`, data),

  // Eliminar una agenda por ID
  eliminar: (id) => api.delete(`/agenda/${id}`)
};

export default agendaService;
