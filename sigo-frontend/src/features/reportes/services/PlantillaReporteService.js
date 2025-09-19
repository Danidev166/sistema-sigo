import api from "../../../services/axios";

const plantillaReporteService = {
  getAll: () => api.get("/plantillas-reportes"),
  getById: (id) => api.get(`/plantillas-reportes/${id}`),
  create: (data) => api.post("/plantillas-reportes", data),
  update: (id, data) => api.put(`/plantillas-reportes/${id}`, data),
  delete: (id) => api.delete(`/plantillas-reportes/${id}`),
};

export default plantillaReporteService; 