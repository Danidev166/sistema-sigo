// src/features/evaluaciones/services/evaluacionService.js
import api from "../../../services/axios";

const evaluacionService = {
  listar: () => api.get("/evaluaciones"),
  obtener: (id) => api.get(`/evaluaciones/${id}`),
  buscarPorRut: (rut) => api.get(`/evaluaciones/buscar/${rut}`),
  crear: (data) => api.post("/evaluaciones", data),
  actualizar: (id, data) => api.put(`/evaluaciones/${id}`, data),
  eliminar: (id) => api.delete(`/evaluaciones/${id}`),
};

export default evaluacionService;
